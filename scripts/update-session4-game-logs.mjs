import { writeFile } from "node:fs/promises";
import path from "node:path";

const EVENT_ID = 260104;
const OVERALL_ID = "260104";
const API_BASE = "https://cerebro-widget.vercel.app/api/trpc";
const SCHEDULE_API = `${API_BASE}/RouterExposureSchedule.ScheduleList`;
const RELATION_API = `${API_BASE}/RouterRelationsGame.RelationsGameRead`;
const STATS_API = `${API_BASE}/RouterCerebroGame.GameXStatisticsList`;
const DATES = ["2026-07-08", "2026-07-09", "2026-07-10", "2026-07-11", "2026-07-12"];
const STREAMS = Object.fromEntries(DATES.map((date, index) => [displayDate(date), `https://nikeeyb.com/session4day${index + 1}`]));

const PLAYERS = [
  { player: "Charles Crawley", team: "Kingdom Hoops", aliases: ["Charles Crawley", "Crawley, Charles"] },
  { player: "Traeshon Fields", team: "All Iowa Attack", aliases: ["Traeshon Fields", "Fields, Traeshon"] },
  { player: "Halbert Jackson", team: "All Iowa Attack", aliases: ["Halbert Jackson", "Jackson, Halbert"] },
  { player: "MarQwan Morgan", team: "Mac Irvin Fire", aliases: ["MarQwan Morgan", "Marqwan Morgan", "Morgan, MarQwan"] },
  { player: "Vasaun Wilmington", team: "MOKAN Elite", aliases: ["Vasaun Wilmington", "Wilmington, Vasaun"] },
  { player: "Andrew Allen", team: "All Iowa Attack", aliases: ["Andrew Allen", "Allen, Andrew"] },
  { player: "Chase Goodheart", team: "All Iowa Attack", aliases: ["Chase Goodheart", "Goodheart, Chase"] },
  { player: "Tate McCollum", team: "Kingdom Hoops", aliases: ["Tate McCollum", "McCollum, Tate"] },
  { player: "Zane Rus", team: "All Iowa Attack", aliases: ["Zane Rus", "Rus, Zane"] },
  { player: "Brayden Tanny", team: "All Iowa Attack", aliases: ["Brayden Tanny", "Tanny, Brayden"] },
  { player: "Pernell Grover Jr.", team: "All Iowa Attack", aliases: ["Pernell Grover Jr.", "Pernell Grover Jr", "Grover, Pernell", "Grover Jr., Pernell"] },
  { player: "Alexander Tanny", team: "All Iowa Attack", aliases: ["Alexander Tanny", "Alex Tanny", "Tanny, Alexander", "Tanny, Alex"] },
  { player: "Ryland Gbor", team: "Kingdom Hoops", aliases: ["Ryland Gbor", "Gbor, Ryland"] },
];

function normalize(value) {
  return String(value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
}
function displayDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${month}/${day}/${year}`;
}
function vegasIso(date, time) {
  const [month, day, year] = date.split("/").map(Number);
  const match = time.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) throw new Error(`Bad time: ${time}`);
  let hour = Number(match[1]);
  if (match[3].toUpperCase() === "PM" && hour !== 12) hour += 12;
  if (match[3].toUpperCase() === "AM" && hour === 12) hour = 0;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${match[2]}:00-07:00`;
}
function attempts(made, attempted) {
  return `${made ?? 0}-${attempted ?? 0}`;
}
async function trpc(url, input) {
  const params = new URLSearchParams({ batch: "1", input: JSON.stringify(input) });
  const response = await fetch(`${url}?${params}`, { headers: { referer: "https://cerebro-widget.vercel.app/" } });
  if (!response.ok) throw new Error(`${url} failed: ${response.status} ${response.statusText}`);
  const first = (await response.json())?.[0];
  if (first?.error) throw new Error(first.error.json?.message ?? "Cerebro API error");
  return first?.result?.data?.json;
}
async function scheduleForDate(iso) {
  const payload = await trpc(SCHEDULE_API, { 0: { json: { eventId: EVENT_ID, divisionId: null, teamId: null, gameId: null, page: 1, pageSize: 600, history: "upcoming", today: iso }, meta: { values: { divisionId: ["undefined"], teamId: ["undefined"], gameId: ["undefined"] }, v: 1 } } });
  if (!Array.isArray(payload?.schedule)) throw new Error(`Unexpected schedule response for ${iso}`);
  return payload.schedule;
}
async function relationFor(game) {
  return trpc(RELATION_API, { 0: { json: { overallId: OVERALL_ID, awayTeam: game.awayTeam, homeTeam: game.homeTeam, division: game.division, date: game.date } } });
}
async function statsFor(gameId) {
  const payload = await trpc(STATS_API, { 0: { json: { gameId } } });
  return Array.isArray(payload?.statistics) ? payload.statistics : [];
}
function score(relation, team) {
  const entry = relation?.team_game?.find((item) => normalize(item?.team?.name) === normalize(team));
  if (!entry?.team_id) return null;
  if (entry.team_id === relation.team_one_id) return relation.team_one_score;
  if (entry.team_id === relation.team_two_id) return relation.team_two_score;
  return null;
}
function toGame(row) {
  return { id: row.Id, date: row.Date, time: row.Time, iso: vegasIso(row.Date, row.Time), division: row.Division.Name, homeTeam: row.HomeTeam.Name, awayTeam: row.AwayTeam.Name, court: row.VenueCourt.Court.Name, venue: row.VenueCourt.Venue.Name, streamUrl: STREAMS[row.Date] };
}
function trackedPlayer(row, game) {
  const raw = normalize(row.playerName);
  return PLAYERS.find((item) => item.aliases.some((alias) => normalize(alias) === raw) && [game.homeTeam, game.awayTeam].some((team) => normalize(team) === normalize(item.team)));
}
function makeLine(row, game, relation) {
  const tracked = trackedPlayer(row, game);
  if (!tracked) return null;
  const opponent = normalize(game.homeTeam) === normalize(tracked.team) ? game.awayTeam : game.homeTeam;
  const teamScore = score(relation, tracked.team);
  const opponentScore = score(relation, opponent);
  return {
    player: tracked.player, rawName: row.playerName, team: tracked.team, opponent,
    result: typeof teamScore === "number" && typeof opponentScore === "number" ? (teamScore > opponentScore ? "W" : teamScore < opponentScore ? "L" : "T") : null,
    teamScore, opponentScore, gameId: game.id, relationGameId: relation.id, division: game.division,
    date: game.date, time: game.time, iso: game.iso, court: game.court, status: "Final",
    sourceUrl: relation.full_boxscore ?? game.streamUrl, streamUrl: game.streamUrl,
    points: row.pts ?? 0, rebounds: row.reb ?? 0, assists: row.ast ?? 0, steals: row.stl ?? 0,
    blocks: row.blk ?? 0, turnovers: row.tov ?? 0, minutes: typeof row.minutes === "number" ? Math.round(row.minutes * 10) / 10 : null,
    fg: attempts(row.fgm, row.fga), threeFg: attempts(row.threePm, row.threePa), ft: attempts(row.ftm, row.fta),
  };
}

const teamNames = new Set(PLAYERS.map(({ team }) => normalize(team)));
const gameMap = new Map();
for (const iso of DATES) {
  for (const row of await scheduleForDate(iso)) {
    if (row.Date !== displayDate(iso)) continue;
    if (![row.HomeTeam.Name, row.AwayTeam.Name].some((team) => teamNames.has(normalize(team)))) continue;
    gameMap.set(row.Id, toGame(row));
  }
}
const games = [...gameMap.values()].sort((a, b) => a.iso.localeCompare(b.iso) || a.id - b.id);
const lines = [];
for (const game of games) {
  const relation = await relationFor(game);
  if (!relation?.id) continue;
  for (const row of await statsFor(relation.id)) {
    const line = makeLine(row, game, relation);
    if (line) lines.push(line);
  }
}
lines.sort((a, b) => b.iso.localeCompare(a.iso) || b.gameId - a.gameId || a.player.localeCompare(b.player));
const gameLogsByPlayer = Object.fromEntries(PLAYERS.map(({ player }) => [player, lines.filter((line) => line.player === player)]));
const latestLineByPlayer = Object.fromEntries(Object.entries(gameLogsByPlayer).filter(([, log]) => log.length).map(([player, log]) => [player, log[0]]));
const payload = { source: "Cerebro Sports public widget API", event: "Nike EYBL Session IV", location: "Las Vegas Convention Center", dateRange: { start: DATES[0], end: DATES.at(-1) }, trackedPlayers: PLAYERS.map(({ player, team, aliases }) => ({ player, team, aliases })), games, lines, gameLogsByPlayer, latestLineByPlayer };
const types = `export type VegasGameLogLine = {\n  player: string; rawName: string; team: string; opponent: string; result: "W" | "L" | "T" | null; teamScore: number | null; opponentScore: number | null; gameId: number; relationGameId: string; division: string; date: string; time: string; iso: string; court: string; status: "Final"; sourceUrl: string; streamUrl: string; points: number; rebounds: number; assists: number; steals: number; blocks: number; turnovers: number; minutes: number | null; fg: string; threeFg: string; ft: string;\n};\n\n`;
const content = `${types}export const session4GameLogs = ${JSON.stringify(payload, null, 2)} as const;\n\nexport const vegasGameLogsByPlayer = session4GameLogs.gameLogsByPlayer as Record<string, readonly VegasGameLogLine[]>;\nexport const vegasLatestLineByPlayer = session4GameLogs.latestLineByPlayer as Partial<Record<string, VegasGameLogLine>>;\n`;
const output = path.join(process.cwd(), "src", "data", "session4-game-logs.ts");
await writeFile(output, content);
console.log(`Updated ${output}`);
console.log(`Range: ${DATES[0]} through ${DATES.at(-1)}`);
console.log(`Tracked games: ${games.length}`);
console.log(`Posted tracked-player lines: ${lines.length}`);
for (const { player } of PLAYERS) console.log(`${player}: ${gameLogsByPlayer[player].length}`);
