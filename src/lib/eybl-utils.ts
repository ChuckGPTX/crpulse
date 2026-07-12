import history from "@/data/eybl-history.json";
import { eyblData } from "@/data/eybl";
import { highSchoolStats } from "@/data/high-school-stats";
import { playerAssets } from "@/data/player-assets";
import { playerLinks } from "@/data/player-links";
import { playerNotes } from "@/data/player-notes";
import { playerRankings } from "@/data/player-rankings";
import { recentGameStats } from "@/data/recent-game-stats";
import { vegasGameLogsByPlayer, vegasLatestLineByPlayer } from "@/data/session4-game-logs";
import { teamAssets } from "@/data/team-assets";

export type StatPlayer = {
  id?: string;
  name: string;
  displayName: string;
  teamName: string;
  jerseyNumber?: string | null;
  games_played: number;
  pts_per_game: number;
  reb_per_game: number;
  ast_per_game: number;
  stl_per_game: number;
  blk_per_game: number;
  tov_per_game?: number;
  fg_pct: number | null;
  ft_pct: number | null;
  three_pt_pct: number | null;
  total_minutes: number;
  programLabel?: string;
  regionTag?: string;
  note?: string;
};

export type AnyTrackedPlayer = (typeof eyblData.trackedPlayers)[number];

export function hasStats(player: AnyTrackedPlayer): player is AnyTrackedPlayer & StatPlayer {
  return "pts_per_game" in player && typeof player.pts_per_game === "number";
}

export function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function numberValue(value: unknown, digits = 1) {
  if (typeof value !== "number") return "—";
  return Number.isInteger(value) ? String(value) : value.toFixed(digits).replace(/\.0$/, "");
}

export function signedNumber(value: number | null | undefined, digits = 1) {
  if (typeof value !== "number") return "—";
  const formatted = numberValue(Math.abs(value), digits);
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return "0";
}

export function percentValue(value: unknown) {
  if (typeof value !== "number") return "—";
  return `${Math.round(value * 100)}%`;
}

export function signedPercent(value: number | null | undefined) {
  if (typeof value !== "number") return "—";
  const points = Math.round(Math.abs(value) * 100);
  if (value > 0) return `+${points} pts`;
  if (value < 0) return `-${points} pts`;
  return "0 pts";
}

export function getTeamAsset(teamName?: string) {
  if (!teamName) return null;
  return teamAssets[teamName as keyof typeof teamAssets] ?? null;
}

export function getPlayerAsset(displayName?: string) {
  if (!displayName) return null;
  return playerAssets[displayName as keyof typeof playerAssets] ?? null;
}

export function getPlayerRanking(displayName?: string) {
  if (!displayName) return null;
  const ranking = playerRankings[displayName as keyof typeof playerRankings];
  if (!ranking || !("stateRank" in ranking)) return null;
  return ranking;
}

export function getRecentGameStat(displayName?: string) {
  if (!displayName) return null;
  return recentGameStats[displayName as keyof typeof recentGameStats] ?? null;
}

export function getVegasGameLog(displayName?: string) {
  if (!displayName) return [];
  return vegasGameLogsByPlayer[displayName] ?? [];
}

export function getVegasLatestGame(displayName?: string) {
  if (!displayName) return null;
  return vegasLatestLineByPlayer[displayName] ?? null;
}

export function getPlayerLinks(displayName?: string) {
  if (!displayName) return null;
  return playerLinks[displayName as keyof typeof playerLinks] ?? null;
}

export function getPlayerNote(displayName?: string) {
  if (!displayName) return null;
  return playerNotes[displayName as keyof typeof playerNotes] ?? null;
}

export function getHighSchoolStats(displayName?: string) {
  if (!displayName) return null;
  return highSchoolStats[displayName as keyof typeof highSchoolStats] ?? null;
}

export function getHighSchoolRole(displayName?: string) {
  const stats = getHighSchoolStats(displayName);
  if (!stats) return null;
  if (stats.ppg >= 15 && stats.threes.pct >= 0.38 && stats.threes.attempted >= 50) return "Primary scorer + verified shooter";
  if (stats.ppg >= 15) return "Primary scorer";
  if (stats.threes.pct >= 0.38 && stats.threes.attempted >= 50) return "Verified shooter";
  if (stats.apg >= 3) return "Creator role";
  return "High-school contributor";
}

export function getTrackedStatPlayers() {
  return eyblData.trackedPlayers.filter(hasStats);
}

export function getPlayerBySlug(slug: string) {
  return getTrackedStatPlayers().find((player) => slugify(player.displayName) === slug);
}

export function getTeamBoard(teamName: string) {
  return eyblData.trackedTeams.find((team) => team.teamName.toLowerCase() === teamName.toLowerCase());
}

function rankInList(players: readonly StatPlayer[], playerName: string, key: keyof StatPlayer) {
  const sorted = [...players].sort((a, b) => {
    const bv = typeof b[key] === "number" ? Number(b[key]) : -Infinity;
    const av = typeof a[key] === "number" ? Number(a[key]) : -Infinity;
    return bv - av || a.displayName.localeCompare(b.displayName);
  });
  return sorted.findIndex((player) => player.displayName === playerName || player.name === playerName) + 1;
}

export function getPlayerRanks(player: StatPlayer) {
  const teamPlayers = getTeamBoard(player.teamName)?.topScorers as readonly StatPlayer[] | undefined;
  const trackedPlayers = getTrackedStatPlayers();
  const sourceTeamPlayers = teamPlayers?.length ? teamPlayers : trackedPlayers.filter((p) => p.teamName === player.teamName);

  return {
    trackedScoring: rankInList(trackedPlayers, player.displayName, "pts_per_game"),
    trackedShooting: rankInList(trackedPlayers, player.displayName, "three_pt_pct"),
    teamScoring: rankInList(sourceTeamPlayers, player.name, "pts_per_game"),
    teamRebounding: rankInList(sourceTeamPlayers, player.name, "reb_per_game"),
    teamAssists: rankInList(sourceTeamPlayers, player.name, "ast_per_game"),
    teamSize: sourceTeamPlayers.length,
  };
}

type SnapshotPlayer = {
  displayName: string;
  teamName: string;
  games_played: number;
  pts_per_game: number;
  reb_per_game: number;
  ast_per_game: number;
  fg_pct: number | null;
  three_pt_pct: number | null;
  total_minutes: number;
};

type Snapshot = {
  generatedAt: string;
  trackedPlayers: SnapshotPlayer[];
};

export function getPlayerTrend(displayName: string) {
  const snapshots = (history.snapshots as Snapshot[])
    .map((snapshot) => ({
      generatedAt: snapshot.generatedAt,
      player: snapshot.trackedPlayers.find((player) => player.displayName === displayName),
    }))
    .filter((entry): entry is { generatedAt: string; player: SnapshotPlayer } => Boolean(entry.player));

  const first = snapshots[0]?.player;
  const previous = snapshots.at(-2)?.player;
  const latest = snapshots.at(-1)?.player;

  return {
    snapshots,
    previous,
    latest,
    ppgDelta: latest && previous ? latest.pts_per_game - previous.pts_per_game : null,
    threePtDelta: latest && previous && latest.three_pt_pct !== null && previous.three_pt_pct !== null ? latest.three_pt_pct - previous.three_pt_pct : null,
    minutesDelta: latest && previous ? latest.total_minutes - previous.total_minutes : null,
    baselinePpgDelta: latest && first ? latest.pts_per_game - first.pts_per_game : null,
  };
}

export function getTopMovers() {
  const snapshots = history.snapshots as Snapshot[];
  const previous = snapshots.at(-2);
  const latest = snapshots.at(-1);
  if (!previous || !latest) return [];

  return latest.trackedPlayers
    .map((player) => {
      const old = previous.trackedPlayers.find((entry) => entry.displayName === player.displayName);
      return old ? { displayName: player.displayName, teamName: player.teamName, ppgDelta: player.pts_per_game - old.pts_per_game } : null;
    })
    .filter((entry): entry is { displayName: string; teamName: string; ppgDelta: number } => Boolean(entry))
    .sort((a, b) => Math.abs(b.ppgDelta) - Math.abs(a.ppgDelta));
}

export function getPlayerSpotlights() {
  return getTrackedStatPlayers()
    .map((player) => ({
      player,
      note: getPlayerNote(player.displayName),
      ranks: getPlayerRanks(player),
      score: player.pts_per_game + player.reb_per_game + player.ast_per_game + ((player.three_pt_pct ?? 0) * 10),
    }))
    .filter((entry) => Boolean(entry.note))
    .sort((a, b) => b.score - a.score);
}

export function getStockLabel(player: StatPlayer) {
  const trend = getPlayerTrend(player.displayName);
  if (trend.ppgDelta !== null && trend.ppgDelta >= 2) return "Stock up";
  if (player.pts_per_game >= 15 || (player.three_pt_pct ?? 0) >= 0.38) return "Stock up";
  if (player.games_played < 6 || player.total_minutes < 80) return "Watch";
  return "Track";
}

export function getScoutingBlurb(player: StatPlayer) {
  const ranks = getPlayerRanks(player);
  const activity = player.stl_per_game + player.blk_per_game;
  const shooting = player.three_pt_pct ?? 0;
  const highSchool = getHighSchoolStats(player.displayName);

  if (highSchool && player.pts_per_game >= 15) {
    return `${player.displayName} has two score lines to watch: ${numberValue(player.pts_per_game)} PPG for ${player.teamName} and ${numberValue(highSchool.ppg)} PPG at ${highSchool.school}.`;
  }

  if (highSchool && highSchool.threes.pct >= 0.38 && highSchool.threes.attempted >= 50) {
    return `${player.displayName} shot it well for ${highSchool.school}: ${percentValue(highSchool.threes.pct)} from three on ${highSchool.threes.made}/${highSchool.threes.attempted} attempts, next to the ${player.teamName} line.`;
  }

  if (player.pts_per_game >= 17) {
    return `${player.displayName} is a lead scorer for ${player.teamName}: No. ${ranks.teamScoring || "—"} on the team at ${numberValue(player.pts_per_game)} PPG.`;
  }

  if (shooting >= 0.38) {
    return `${player.displayName} is spacing the floor at ${percentValue(player.three_pt_pct)} from three with ${numberValue(player.reb_per_game)} rebounds and ${numberValue(player.ast_per_game)} assists per game.`;
  }

  if (activity >= 2) {
    return `${player.displayName} is making plays on both ends: ${numberValue(activity)} combined steals/blocks per game with ${numberValue(player.pts_per_game)} PPG production.`;
  }

  return `${player.displayName} is on the CR Pulse watchlist with ${numberValue(player.pts_per_game)} PPG, ${numberValue(player.reb_per_game)} RPG, and ${numberValue(player.ast_per_game)} APG for ${player.teamName}.`;
}

export function getTeamContext(player: StatPlayer) {
  const ranks = getPlayerRanks(player);
  const highSchool = getHighSchoolStats(player.displayName);
  const schoolContext = highSchool ? ` High school: ${numberValue(highSchool.ppg)} PPG at ${highSchool.school}.` : "";
  return `No. ${ranks.teamScoring || "—"} scorer on ${player.teamName}; No. ${ranks.trackedScoring || "—"} on the CR Pulse list.${schoolContext}`;
}
