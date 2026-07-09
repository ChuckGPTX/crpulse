import { writeFile } from "node:fs/promises";
import path from "node:path";

const EVENT_ID = 260104;
const OVERALL_ID = "260104";
const API_BASE = "https://cerebro-widget.vercel.app/api/trpc";
const SCHEDULE_API = `${API_BASE}/RouterExposureSchedule.ScheduleList`;
const RELATION_API = `${API_BASE}/RouterRelationsGame.RelationsGameRead`;
const STATS_API = `${API_BASE}/RouterCerebroGame.GameXStatisticsList`;
const STREAM_HUB = "https://nikeeyb.com/session4day1";
const DAY_STREAM_BY_DATE = {
  "7/8/2026": "https://nikeeyb.com/session4day1",
  "7/9/2026": "https://nikeeyb.com/session4day2",
  "7/10/2026": "https://nikeeyb.com/session4day3",
  "7/11/2026": "https://nikeeyb.com/session4day4",
  "7/12/2026": "https://nikeeyb.com/session4day5",
};

const TRACKED_TEAMS = new Set(["All Iowa Attack", "Kingdom Hoops", "Mac Irvin Fire", "MOKAN Elite", "MOKAN SPURS"]);
const TRACKED_PLAYERS = new Map([
  ["Charles Crawley", { displayName: "Charles Crawley", team: "Kingdom Hoops" }],
  ["Traeshon Fields", { displayName: "Traeshon Fields", team: "All Iowa Attack" }],
  ["Halbert Jackson", { displayName: "Halbert Jackson", team: "All Iowa Attack" }],
  ["MarQwan Morgan", { displayName: "MarQwan Morgan", team: "Mac Irvin Fire" }],
  ["Vasaun Wilmington", { displayName: "Vasaun Wilmington", team: "MOKAN Elite" }],
  ["Andrew Allen", { displayName: "Andrew Allen", team: "All Iowa Attack" }],
  ["Chase Goodheart", { displayName: "Chase Goodheart", team: "All Iowa Attack" }],
  ["Tate McCollum", { displayName: "Tate McCollum", team: "Kingdom Hoops" }],
  ["Zane Rus", { displayName: "Zane Rus", team: "All Iowa Attack" }],
  ["Brayden Tanny", { displayName: "Brayden Tanny", team: "All Iowa Attack" }],
  ["Pernell Grover Jr.", { displayName: "Pernell Grover Jr.", team: "All Iowa Attack" }],
  ["Alexander Tanny", { displayName: "Alexander Tanny", team: "All Iowa Attack" }],
  ["Ryland Gbor", { displayName: "Ryland Gbor", team: "Kingdom Hoops" }],
]);

function vegasPartsForNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).formatToParts(new Date());
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  return { month, day, year };
}

function displayDateFromIso(value) {
  const [year, month, day] = value.split("-").map(Number);
  return `${month}/${day}/${year}`;
}

function isoDateForNow() {
  const { month, day, year } = vegasPartsForNow();
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const API_TODAY = process.env.SESSION4_API_DATE || process.env.SESSION4_DATE_ISO || isoDateForNow();
const TODAY = process.env.SESSION4_DATE || displayDateFromIso(API_TODAY);

function vegasIso(date, time) {
  const [month, day, year] = date.split("/").map(Number);
  const match = time.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) throw new Error(`Bad time: ${time}`);
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3].toUpperCase();
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00-07:00`;
}

function pct(made, attempted) {
  if (!attempted) return null;
  return Math.round((made / attempted) * 1000) / 10;
}

function fgText(made, attempted) {
  return `${made ?? 0}-${attempted ?? 0}`;
}

async function trpc(url, input) {
  const params = new URLSearchParams({ batch: "1", input: JSON.stringify(input) });
  const response = await fetch(`${url}?${params.toString()}`, { headers: { referer: "https://cerebro-widget.vercel.app/" } });
  if (!response.ok) throw new Error(`${url} failed: ${response.status} ${response.statusText}`);
  const data = await response.json();
  const first = data?.[0];
  if (first?.error) return null;
  return first?.result?.data?.json ?? null;
}

async function fetchSchedule() {
  const input = {
    0: {
      json: {
        eventId: EVENT_ID,
        divisionId: null,
        teamId: null,
        gameId: null,
        page: 1,
        pageSize: 600,
        history: "upcoming",
        today: API_TODAY,
      },
      meta: { values: { divisionId: ["undefined"], teamId: ["undefined"], gameId: ["undefined"] }, v: 1 },
    },
  };
  const payload = await trpc(SCHEDULE_API, input);
  const schedule = payload?.schedule;
  if (!Array.isArray(schedule)) throw new Error("Schedule feed returned an unexpected shape");
  return schedule;
}

async function fetchRelation(game) {
  const input = {
    0: {
      json: {
        overallId: OVERALL_ID,
        awayTeam: game.awayTeam,
        homeTeam: game.homeTeam,
        division: game.division,
        date: game.date,
      },
    },
  };
  return trpc(RELATION_API, input);
}

async function fetchStats(relationGameId) {
  const payload = await trpc(STATS_API, { 0: { json: { gameId: relationGameId } } });
  return Array.isArray(payload?.statistics) ? payload.statistics : [];
}

function scoreForTeam(relation, teamName) {
  const games = Array.isArray(relation?.team_game) ? relation.team_game : [];
  const match = games.find((entry) => entry?.team?.name === teamName);
  if (!match?.team_id) return null;
  if (match.team_id === relation.team_one_id) return relation.team_one_score;
  if (match.team_id === relation.team_two_id) return relation.team_two_score;
  return null;
}

function gameStatus(game, relation) {
  const awayScore = relation ? scoreForTeam(relation, game.awayTeam) : null;
  const homeScore = relation ? scoreForTeam(relation, game.homeTeam) : null;
  if (typeof awayScore === "number" && typeof homeScore === "number") return "Final";
  const diff = new Date(game.iso).getTime() - Date.now();
  if (diff <= 0 && diff > -1000 * 60 * 110) return "Live";
  if (diff <= 0) return "Stats pending";
  return "Scheduled";
}

function toGame(row) {
  return {
    id: row.Id,
    date: row.Date,
    time: row.Time,
    iso: vegasIso(row.Date, row.Time),
    division: row.Division.Name,
    homeTeam: row.HomeTeam.Name,
    awayTeam: row.AwayTeam.Name,
    court: row.VenueCourt.Court.Name,
    venue: row.VenueCourt.Venue.Name,
    streamUrl: DAY_STREAM_BY_DATE[row.Date] ?? STREAM_HUB,
  };
}

function statLine(row, game, relation) {
  const tracked = TRACKED_PLAYERS.get(row.playerName);
  if (!tracked) return null;
  const playerTeam = tracked.team;
  const opponent = game.homeTeam === playerTeam ? game.awayTeam : game.awayTeam === playerTeam ? game.homeTeam : row.oppTeamName ?? "Opponent";
  const teamScore = relation ? scoreForTeam(relation, playerTeam) : null;
  const opponentScore = relation ? scoreForTeam(relation, opponent) : null;
  const result = typeof teamScore === "number" && typeof opponentScore === "number"
    ? teamScore > opponentScore ? "W" : teamScore < opponentScore ? "L" : "T"
    : null;

  return {
    player: tracked.displayName,
    team: playerTeam,
    opponent,
    result,
    teamScore,
    opponentScore,
    gameId: game.id,
    relationGameId: relation?.id ?? null,
    division: game.division,
    date: game.date,
    time: game.time,
    iso: game.iso,
    court: game.court,
    status: gameStatus(game, relation),
    sourceUrl: relation?.full_boxscore ?? game.streamUrl,
    streamUrl: game.streamUrl,
    points: row.pts ?? 0,
    rebounds: row.reb ?? 0,
    assists: row.ast ?? 0,
    steals: row.stl ?? 0,
    blocks: row.blk ?? 0,
    turnovers: row.tov ?? 0,
    minutes: typeof row.minutes === "number" ? Math.round(row.minutes * 10) / 10 : null,
    fg: fgText(row.fgm, row.fga),
    threeFg: fgText(row.threePm, row.threePa),
    ft: fgText(row.ftm, row.fta),
    fgPct: pct(row.fgm, row.fga),
    threePct: pct(row.threePm, row.threePa),
    fantasy: (row.pts ?? 0) + (row.reb ?? 0) * 1.2 + (row.ast ?? 0) * 1.5 + (row.stl ?? 0) * 3 + (row.blk ?? 0) * 3,
  };
}

const schedule = await fetchSchedule();
const todayGames = schedule
  .filter((row) => row.Date === TODAY)
  .filter((row) => TRACKED_TEAMS.has(row.HomeTeam.Name) || TRACKED_TEAMS.has(row.AwayTeam.Name))
  .map(toGame)
  .sort((a, b) => a.iso.localeCompare(b.iso));

const enrichedGames = [];
const playerLines = [];

for (const game of todayGames) {
  let relation = null;
  let rows = [];
  try {
    relation = await fetchRelation(game);
    if (relation?.id) rows = await fetchStats(relation.id);
  } catch (error) {
    console.warn(`Stats lookup failed for ${game.awayTeam} vs ${game.homeTeam}: ${error.message}`);
  }

  const awayScore = relation ? scoreForTeam(relation, game.awayTeam) : null;
  const homeScore = relation ? scoreForTeam(relation, game.homeTeam) : null;
  const lines = rows.map((row) => statLine(row, game, relation)).filter(Boolean);
  playerLines.push(...lines);
  enrichedGames.push({
    ...game,
    status: gameStatus(game, relation),
    relationGameId: relation?.id ?? null,
    awayScore,
    homeScore,
    sourceUrl: relation?.full_boxscore ?? null,
    statsPosted: lines.length > 0,
    trackedLines: lines.map((line) => line.player),
  });
}

const latestLineByPlayer = Object.fromEntries(
  [...playerLines]
    .sort((a, b) => a.iso.localeCompare(b.iso))
    .map((line) => [line.player, line])
);

const highlights = [...Object.values(latestLineByPlayer)]
  .sort((a, b) => b.fantasy - a.fantasy || b.points - a.points || a.player.localeCompare(b.player))
  .slice(0, 6);

const payload = {
  source: "Cerebro Sports public widget API",
  event: "Nike EYBL Session IV",
  location: "Las Vegas Convention Center",
  date: TODAY,
  generatedAt: new Date().toISOString(),
  games: enrichedGames,
  playerLines,
  latestLineByPlayer,
  highlights,
};

const content = `export type Session4Status = "Final" | "Live" | "Stats pending" | "Scheduled";\n\nexport const session4Today = ${JSON.stringify(payload, null, 2)} as const;\n\nexport type Session4Today = typeof session4Today;\nexport type Session4Game = (typeof session4Today.games)[number];\nexport type Session4PlayerLine = (typeof session4Today.playerLines)[number];\nexport const session4PlayerLines = session4Today.latestLineByPlayer;\nexport const session4Highlights = session4Today.highlights;\n`;

const outputPath = path.join(process.cwd(), "src", "data", "session4-today.ts");
await writeFile(outputPath, content);
console.log(`Updated ${outputPath}`);
console.log(`Date: ${TODAY}`);
console.log(`Tracked games: ${enrichedGames.length}`);
console.log(`Tracked player lines: ${playerLines.length}`);
console.log(`Highlights: ${highlights.map((line) => `${line.player} ${line.points}`).join(", ")}`);
