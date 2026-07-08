import { writeFile } from "node:fs/promises";
import path from "node:path";

const EVENT_ID = 260104;
const API_URL = "https://cerebro-widget.vercel.app/api/trpc/RouterExposureSchedule.ScheduleList";
const STREAM_HUB = "https://nikeeyb.com/session4day1";
const DAY_STREAMS = [
  { label: "Day 1", date: "Wed Jul 8", href: "https://nikeeyb.com/session4day1", gameDate: "7/8/2026" },
  { label: "Day 2", date: "Thu Jul 9", href: "https://nikeeyb.com/session4day2", gameDate: "7/9/2026" },
  { label: "Day 3", date: "Fri Jul 10", href: "https://nikeeyb.com/session4day3", gameDate: "7/10/2026" },
  { label: "Day 4", date: "Sat Jul 11", href: "https://nikeeyb.com/session4day4", gameDate: "7/11/2026" },
  { label: "Day 5", date: "Sun Jul 12", href: "https://nikeeyb.com/session4day5", gameDate: "7/12/2026" },
];
const DAY_STREAM_BY_DATE = Object.fromEntries(DAY_STREAMS.map((stream) => [stream.gameDate, stream.href]));
const TRACKED_TEAMS = new Set(["All Iowa Attack", "Kingdom Hoops", "Mac Irvin Fire", "MOKAN Elite", "MOKAN SPURS"]);

const playerTeam = {
  "Charles Crawley": "Kingdom Hoops",
  "Traeshon Fields": "All Iowa Attack",
  "Halbert Jackson": "All Iowa Attack",
  "MarQwan Morgan": "Mac Irvin Fire",
  "Vasaun Wilmington": "MOKAN Elite",
  "Andrew Allen": "All Iowa Attack",
  "Chase Goodheart": "All Iowa Attack",
  "Tate McCollum": "Kingdom Hoops",
  "Zane Rus": "All Iowa Attack",
  "Brayden Tanny": "All Iowa Attack",
  "Pernell Grover Jr.": "All Iowa Attack",
  "Alexander Tanny": "All Iowa Attack",
  "Ryland Gbor": "Kingdom Hoops",
};

const playerDivision = {
  "Charles Crawley": "EYCL 16'S",
  "Traeshon Fields": "EYCL 16'S",
  "Halbert Jackson": "EYCL 16'S",
  "MarQwan Morgan": "E16",
  "Vasaun Wilmington": "E16",
  "Andrew Allen": "EYCL 16'S",
  "Chase Goodheart": "EYCL 16'S",
  "Tate McCollum": "EYCL 17'S",
  "Zane Rus": "EYCL 17'S",
  "Brayden Tanny": "EYCL 17'S",
  "Pernell Grover Jr.": "EYCL 15'S",
  "Alexander Tanny": "EYCL 15'S",
  "Ryland Gbor": "EYCL 17'S",
};

function vegasIso(date, time) {
  const [month, day, year] = date.split("/").map(Number);
  const match = time.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) throw new Error(`Bad time: ${time}`);
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3].toUpperCase();
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  // Las Vegas is PDT (-07:00) during July.
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00-07:00`;
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
        today: "2026-07-08",
      },
      meta: { values: { divisionId: ["undefined"], teamId: ["undefined"], gameId: ["undefined"] }, v: 1 },
    },
  };
  const params = new URLSearchParams({ batch: "1", input: JSON.stringify(input) });
  const response = await fetch(`${API_URL}?${params.toString()}`, { headers: { referer: "https://cerebro-widget.vercel.app/" } });
  if (!response.ok) throw new Error(`Schedule fetch failed: ${response.status} ${response.statusText}`);
  const data = await response.json();
  const schedule = data?.[0]?.result?.data?.json?.schedule;
  if (!Array.isArray(schedule)) throw new Error("Schedule feed returned an unexpected shape");
  return schedule;
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

const schedule = await fetchSchedule();
const trackedGames = schedule
  .filter((row) => TRACKED_TEAMS.has(row.HomeTeam.Name) || TRACKED_TEAMS.has(row.AwayTeam.Name))
  .map(toGame)
  .sort((a, b) => a.iso.localeCompare(b.iso));

const now = Date.now();
const playerNextGames = Object.fromEntries(Object.entries(playerTeam).flatMap(([player, team]) => {
  const division = playerDivision[player];
  const next = trackedGames.find((game) => (
    game.division === division
    && (game.homeTeam === team || game.awayTeam === team)
    && new Date(game.iso).getTime() > now - 1000 * 60 * 90
  ));
  return next ? [[player, next]] : [];
}));

const content = `export type VegasGame = {\n  id: number;\n  date: string;\n  time: string;\n  iso: string;\n  division: string;\n  homeTeam: string;\n  awayTeam: string;\n  court: string;\n  venue: string;\n  streamUrl: string;\n};\n\nexport const vegasEvent = {\n  label: "Nike EYBL Session IV",\n  location: "Las Vegas Convention Center",\n  scheduleUrl: "https://nikeeyb.com/schedule",\n  streamHubUrl: "${STREAM_HUB}",\n  dayStreams: [\n${DAY_STREAMS.map(({ label, date, href }) => `    { label: "${label}", date: "${date}", href: "${href}" },`).join("\n")}\n  ],\n} as const;\n\nexport const vegasTrackedGames = ${JSON.stringify(trackedGames, null, 2)} as const satisfies readonly VegasGame[];\n\nexport const playerNextGames = ${JSON.stringify(playerNextGames, null, 2)} as const satisfies Record<string, VegasGame>;\n`;

const outputPath = path.join(process.cwd(), "src", "data", "vegas-schedule.ts");
await writeFile(outputPath, content);
console.log(`Updated ${outputPath}`);
console.log(`Tracked Vegas games: ${trackedGames.length}`);
console.log(`Player next games: ${Object.keys(playerNextGames).length}`);
