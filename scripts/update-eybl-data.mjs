import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const OVERALL_ID = "260104";
const API_URL = "https://cerebro-widget.vercel.app/api/trpc/RouterCerebroPlayers.PlayersList";

const trackedSpecs = [
  { displayName: "Charles Crawley", cerebroName: "Charles Crawley", regionTag: "Eastern Iowa watch" },
  { displayName: "Traeshon Fields", cerebroName: "Traeshon Fields", regionTag: "Eastern Iowa watch" },
  {
    displayName: "Halbert Jackson",
    cerebroName: "Halbert Jackson",
    expectedTeamName: "All Iowa Attack",
    programLabel: "All Iowa Attack 16U",
    regionTag: "Eastern Iowa watch",
    optional: true,
  },
  { displayName: "MarQwan Morgan", cerebroName: "MarQwan Morgan", regionTag: "Eastern Iowa watch" },
  { displayName: "Vasaun Wilmington", cerebroName: "Vasaun Wilmington", regionTag: "Eastern Iowa watch" },
  { displayName: "Andrew Allen", cerebroName: "Andrew Allen", regionTag: "Eastern Iowa watch" },
  { displayName: "Chase Goodheart", cerebroName: "Chase Goodheart", regionTag: "Eastern Iowa watch" },
  { displayName: "Tate McCollum", cerebroName: "Tate McCollum", regionTag: "Eastern Iowa watch" },
  { displayName: "Zane Rus", cerebroName: "Zane Rus", programLabel: "All Iowa Attack 17U", regionTag: "Eastern Iowa watch" },
  { displayName: "Brayden Tanny", cerebroName: "Brayden Tanny", programLabel: "All Iowa Attack 17U", regionTag: "Eastern Iowa watch" },
  { displayName: "Pernell Grover Jr.", cerebroName: "Pernell Grover Jr.", programLabel: "All Iowa Attack 15U", regionTag: "Eastern Iowa watch" },
  { displayName: "Alexander Tanny", cerebroName: "Alexander Tanny", programLabel: "All Iowa Attack 15U", regionTag: "Eastern Iowa watch" },
  { displayName: "Ryland Gbor", cerebroName: "Ryland Gbor", programLabel: "Kingdom Hoops 17U", regionTag: "Eastern Iowa watch" },
];

const trackedTeams = [
  "Kingdom Hoops",
  "All Iowa Attack",
  "Mac Irvin Fire",
  "Brad Beal Elite",
  "MOKAN Elite",
  "MOKAN SPURS",
];

function round(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return value ?? null;
  return Math.round(value * 1000) / 1000;
}

function slimPlayer(player, displayName = player.name, note, spec = {}) {
  const keys = [
    "id",
    "name",
    "position",
    "teamName",
    "jerseyNumber",
    "games_played",
    "pts_per_game",
    "reb_per_game",
    "ast_per_game",
    "stl_per_game",
    "blk_per_game",
    "tov_per_game",
    "fg_pct",
    "ft_pct",
    "three_pt_pct",
    "total_minutes",
  ];

  const output = Object.fromEntries(keys.map((key) => [key, round(player[key])]));
  output.displayName = displayName;
  if (spec.programLabel) output.programLabel = spec.programLabel;
  if (spec.regionTag) output.regionTag = spec.regionTag;
  if (note) output.note = note;
  return output;
}

async function fetchPlayers() {
  const input = {
    0: {
      json: {
        overallId: OVERALL_ID,
        page: 1,
        pageSize: 3000,
      },
    },
  };

  const params = new URLSearchParams({
    batch: "1",
    input: JSON.stringify(input),
  });

  const response = await fetch(`${API_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Cerebro player feed failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const players = data?.[0]?.result?.data?.json?.players;
  if (!Array.isArray(players)) {
    throw new Error("Cerebro player feed returned an unexpected shape");
  }
  return players;
}

function findPlayer(players, name) {
  return players.find((player) => player.name?.toLowerCase() === name.toLowerCase())
    ?? players.find((player) => player.name?.toLowerCase().includes(name.toLowerCase()));
}

function buildTrackedPlayers(players) {
  return trackedSpecs.map((spec) => {
    const player = findPlayer(players, spec.cerebroName);
    if (!player) {
      return {
        displayName: spec.displayName,
        name: spec.cerebroName,
        teamName: spec.expectedTeamName ?? null,
        programLabel: spec.programLabel ?? null,
        regionTag: spec.regionTag ?? null,
        status: "not_found",
        note: spec.expectedTeamName
          ? `${spec.displayName} is on the CR Pulse watchlist for ${spec.programLabel ?? spec.expectedTeamName}; current stat line is not posted yet.`
          : `No current stat line found for ${spec.displayName}.`,
      };
    }

    const note = player.name !== spec.displayName
      ? `Cerebro lists this player as ${player.name}.`
      : undefined;
    return slimPlayer(player, spec.displayName, note, spec);
  });
}

function buildTeamBoards(players) {
  return trackedTeams.map((teamName) => {
    const roster = players.filter((player) => player.teamName?.toLowerCase() === teamName.toLowerCase());
    return {
      teamName,
      playersTracked: roster.length,
      topScorers: [...roster]
        .sort((a, b) => (b.pts_per_game ?? 0) - (a.pts_per_game ?? 0) || a.name.localeCompare(b.name))
        .slice(0, 8)
        .map((player) => slimPlayer(player)),
      topRebounders: [...roster]
        .sort((a, b) => (b.reb_per_game ?? 0) - (a.reb_per_game ?? 0) || a.name.localeCompare(b.name))
        .slice(0, 5)
        .map((player) => slimPlayer(player)),
      topPlaymakers: [...roster]
        .sort((a, b) => (b.ast_per_game ?? 0) - (a.ast_per_game ?? 0) || a.name.localeCompare(b.name))
        .slice(0, 5)
        .map((player) => slimPlayer(player)),
    };
  });
}

function summarizeSnapshot(payload) {
  const trackedPlayers = payload.trackedPlayers
    .filter((player) => typeof player.pts_per_game === "number")
    .map((player) => ({
      displayName: player.displayName,
      teamName: player.teamName,
      games_played: player.games_played,
      pts_per_game: player.pts_per_game,
      reb_per_game: player.reb_per_game,
      ast_per_game: player.ast_per_game,
      stl_per_game: player.stl_per_game,
      blk_per_game: player.blk_per_game,
      fg_pct: player.fg_pct,
      three_pt_pct: player.three_pt_pct,
      ft_pct: player.ft_pct,
      total_minutes: player.total_minutes,
    }));

  return {
    generatedAt: payload.generatedAt,
    overallId: payload.overallId,
    trackedPlayers,
  };
}

async function updateHistory(payload) {
  const historyPath = path.join(process.cwd(), "src", "data", "eybl-history.json");
  let history = { snapshots: [] };

  if (existsSync(historyPath)) {
    history = JSON.parse(await readFile(historyPath, "utf8"));
  }

  const snapshot = summarizeSnapshot(payload);
  const last = history.snapshots.at(-1);
  const lastComparable = last ? JSON.stringify(last.trackedPlayers) : null;
  const nextComparable = JSON.stringify(snapshot.trackedPlayers);

  if (lastComparable !== nextComparable) {
    history.snapshots.push(snapshot);
  } else if (last) {
    last.generatedAt = snapshot.generatedAt;
  } else {
    history.snapshots.push(snapshot);
  }

  history.snapshots = history.snapshots.slice(-60);
  await writeFile(historyPath, `${JSON.stringify(history, null, 2)}\n`);
  return history;
}

const players = await fetchPlayers();
const payload = {
  source: "Cerebro Sports public widget API",
  overallId: OVERALL_ID,
  generatedAt: new Date().toISOString(),
  totalPlayers: players.length,
  trackedPlayers: buildTrackedPlayers(players),
  trackedTeams: buildTeamBoards(players),
};

const output = `export const eyblData = ${JSON.stringify(payload, null, 2)} as const;\n\nexport type EyblPlayer = (typeof eyblData.trackedPlayers)[number];\n`;
const outputPath = path.join(process.cwd(), "src", "data", "eybl.ts");
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, output);
const history = await updateHistory(payload);

console.log(`Updated ${outputPath}`);
console.log(`History snapshots: ${history.snapshots.length}`);
console.log(`Tracked players: ${payload.trackedPlayers.map((player) => player.displayName).join(", ")}`);
console.log(`Generated at: ${payload.generatedAt}`);
