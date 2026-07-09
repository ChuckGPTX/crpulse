import Link from "next/link";
import { GameCountdown } from "@/components/GameCountdown";
import { ProfileLink } from "@/components/visitor-tracking";
import { eyblData } from "@/data/eybl";
import { session4Highlights, session4PlayerLines, session4Today, type Session4Game, type Session4PlayerLine } from "@/data/session4-today";
import { playerNextGames, vegasEvent, type VegasGame } from "@/data/vegas-schedule";
import {
  getPlayerAsset,
  getHighSchoolRole,
  getHighSchoolStats,
  getPlayerLinks,
  getPlayerRanking,
  getPlayerRanks,
  getPlayerSpotlights,
  getPlayerTrend,
  getRecentGameStat,
  getStockLabel,
  getTeamAsset,
  hasStats,
  numberValue,
  percentValue,
  signedNumber,
  slugify,
  type AnyTrackedPlayer,
  type StatPlayer,
} from "@/lib/eybl-utils";

const statLabels = [
  ["PTS", "pts_per_game"],
  ["REB", "reb_per_game"],
  ["AST", "ast_per_game"],
  ["STL", "stl_per_game"],
  ["BLK", "blk_per_game"],
] as const;

const displayTeams = new Set(["Kingdom Hoops", "All Iowa Attack", "Mac Irvin Fire", "MOKAN Elite"]);

function TeamLogo({ teamName, className = "h-12 w-12" }: { teamName?: string; className?: string }) {
  const asset = getTeamAsset(teamName);
  if (!asset) return <div className={`${className} rounded-2xl bg-slate-200`} />;
  const darkBackedLogo = teamName?.includes("Kingdom") || teamName?.includes("MOKAN");
  return (
    <div className={`${className} flex items-center justify-center overflow-hidden rounded-2xl border border-slate-200 ${darkBackedLogo ? "bg-slate-950" : "bg-white"} p-2 shadow-sm`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset.logo} alt={`${teamName} logo`} className="max-h-full max-w-full object-contain" />
    </div>
  );
}

function PlayerAvatar({ player, className = "h-16 w-16" }: { player: StatPlayer; className?: string }) {
  const playerAsset = getPlayerAsset(player.displayName);
  const teamAsset = getTeamAsset(player.teamName);
  const darkBackedLogo = player.teamName.includes("Kingdom") || player.teamName.includes("MOKAN");

  return (
    <div className={`${className} relative shrink-0`}>
      <div className={`h-full w-full overflow-hidden rounded-2xl border border-slate-200 ${playerAsset ? "bg-slate-900" : darkBackedLogo ? "bg-slate-950" : "bg-white"} shadow-sm`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={playerAsset?.image ?? teamAsset?.logo ?? ""}
          alt={playerAsset ? `${player.displayName} basketball photo` : `${player.teamName} logo`}
          className={`h-full w-full ${playerAsset ? "object-cover object-[center_28%]" : "object-contain p-2"}`}
        />
      </div>
      {playerAsset && teamAsset ? (
        <div className={`absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl border border-slate-200 ${darkBackedLogo ? "bg-slate-950" : "bg-white"} p-1 shadow-md`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={teamAsset.logo} alt={`${player.teamName} logo`} className="max-h-full max-w-full object-contain" />
        </div>
      ) : null}
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
      <span className="mr-2 uppercase tracking-wide text-slate-500">{label}</span>
      <span className="font-black text-slate-950">{value}</span>
    </div>
  );
}

function StockBadge({ value }: { value: string }) {
  const tone = value === "Stock up" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : value === "Watch" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-700 border-slate-200";
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ${tone}`}>{value}</span>;
}

function PrepHoopsBadge({ name }: { name: string }) {
  const ranking = getPlayerRanking(name);
  if (!ranking) return null;
  return (
    <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-red-700">
      {ranking.label}
    </span>
  );
}

function HighSchoolBadge({ name }: { name: string }) {
  const stats = getHighSchoolStats(name);
  const role = getHighSchoolRole(name);
  if (!stats) return null;
  return (
    <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-amber-700" title={`${role} at ${stats.school}`}>
      HS {numberValue(stats.ppg)} PPG
    </span>
  );
}

function NextGameBadge({ game }: { game?: VegasGame | null }) {
  if (!game) return null;
  return <GameCountdown targetIso={game.iso} compact />;
}

function formatVegasDate(game: VegasGame | Session4Game) {
  return `${game.date} · ${game.time} PT`;
}

function formatUpdatedAt(value: string) {
  return new Date(value).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" });
}

function opponentFor(game: VegasGame | Session4Game, teamName: string) {
  if (game.homeTeam === teamName) return game.awayTeam;
  if (game.awayTeam === teamName) return game.homeTeam;
  return `${game.awayTeam} vs ${game.homeTeam}`;
}

type DisplayGameLine = Pick<Session4PlayerLine, "player" | "team" | "opponent" | "result" | "teamScore" | "opponentScore" | "date" | "status" | "points" | "rebounds" | "assists" | "steals" | "blocks" | "fg" | "threeFg" | "minutes">;

function displayDate(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return `${month}/${day}/${year}`;
  }
  return value;
}

function recentGameLine(name: string): DisplayGameLine | null {
  const stat = getRecentGameStat(name);
  if (!stat) return null;
  return {
    player: stat.player,
    team: stat.team,
    opponent: stat.opponent,
    result: stat.result,
    teamScore: stat.teamScore,
    opponentScore: stat.opponentScore,
    date: displayDate(stat.date),
    status: stat.status,
    points: stat.points,
    rebounds: stat.rebounds,
    assists: stat.assists,
    steals: stat.steals,
    blocks: stat.blocks,
    fg: stat.fg,
    threeFg: stat.threeFg,
    minutes: stat.minutes,
  };
}

function latestDisplayLine(name: string): DisplayGameLine | null {
  return session4PlayerLines[name as keyof typeof session4PlayerLines] ?? recentGameLine(name);
}

function TodayStatStrip({ line, compact = false }: { line?: DisplayGameLine | null; compact?: boolean }) {
  if (!line) return null;
  const result = line.result === "W" ? "Win" : line.result === "L" ? "Loss" : line.result === "T" ? "Tie" : "Result pending";
  const score = typeof line.teamScore === "number" && typeof line.opponentScore === "number"
    ? `${line.team} ${line.teamScore}, ${line.opponent} ${line.opponentScore}`
    : null;
  return (
    <div className={`mt-4 rounded-2xl border border-amber-300 bg-amber-50 shadow-sm ${compact ? "p-3" : "p-4"}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">Latest game</div>
          <div className="mt-1 text-xs font-black text-slate-700">{result} · {line.date} · {line.opponent}</div>
        </div>
        <div className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase text-slate-700">{line.status}</div>
      </div>
      <div className={`mt-3 grid grid-cols-5 gap-2 text-center ${compact ? "text-sm" : "text-base"}`}>
        {[["PTS", line.points], ["REB", line.rebounds], ["AST", line.assists], ["STL", line.steals], ["BLK", line.blocks]].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-white p-2">
            <div className="text-[9px] font-black uppercase text-slate-500">{label}</div>
            <div className="font-black text-slate-950">{value}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-black text-slate-700">
        <div className="rounded-xl bg-white px-3 py-2"><span className="text-slate-500">FG</span> {line.fg}</div>
        <div className="rounded-xl bg-white px-3 py-2"><span className="text-slate-500">3PT</span> {line.threeFg}</div>
        <div className="rounded-xl bg-white px-3 py-2"><span className="text-slate-500">MIN</span> {line.minutes ?? "—"}</div>
      </div>
      {score ? <div className="mt-2 text-xs font-bold text-slate-600">{score}</div> : null}
    </div>
  );
}

function SessionStatusBadge({ game }: { game: Session4Game }) {
  const live = game.status === "Live";
  const final = game.status === "Final";
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wide ${live ? "border-emerald-300 bg-emerald-50 text-emerald-700" : final ? "border-white/20 bg-white text-slate-950" : "border-amber-300 bg-amber-50 text-amber-800"}`}>
      <span className={`h-2 w-2 rounded-full ${live ? "bg-emerald-500" : final ? "bg-slate-950" : "bg-amber-500"}`} />
      {game.status}
    </span>
  );
}

function VegasGameCard({ game, compact = false }: { game: Session4Game; compact?: boolean }) {
  const hasScore = typeof game.awayScore === "number" && typeof game.homeScore === "number";
  const href = game.sourceUrl ?? game.streamUrl;
  return (
    <a href={href} target="_blank" rel="noreferrer" className="block rounded-3xl border border-white/10 bg-white/[0.07] p-4 text-white transition hover:-translate-y-0.5 hover:bg-white/[0.12]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-200">{game.division}</div>
          <div className={`${compact ? "text-base" : "text-xl"} mt-2 font-black leading-tight`}>
            {hasScore ? `${game.awayTeam} ${game.awayScore}, ${game.homeTeam} ${game.homeScore}` : `${game.awayTeam} vs ${game.homeTeam}`}
          </div>
        </div>
        <SessionStatusBadge game={game} />
      </div>
      <div className="mt-3 text-sm font-bold text-slate-300">{formatVegasDate(game)} · {game.court}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {game.statsPosted ? <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-[10px] font-black uppercase text-emerald-100">Stats posted</span> : null}
        {game.trackedLines.slice(0, 4).map((name) => <span key={name} className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase text-white">{name}</span>)}
      </div>
    </a>
  );
}

function PlayerQuickLinks({ name }: { name: string }) {
  const links = getPlayerLinks(name);
  if (!links) return null;
  const x = "x" in links ? links.x : null;
  const hudl = "hudl" in links ? links.hudl : null;
  const highSchool = "highSchool" in links ? links.highSchool : null;
  const items = [
    x ? { label: "X", href: x } : null,
    hudl ? { label: "Hudl", href: hudl } : null,
    highSchool ? { label: "Bound", href: highSchool.url } : null,
  ].filter(Boolean) as { label: string; href: string }[];
  if (!items.length) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {items.map((item) => (
        <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-wide text-slate-600 transition hover:border-red-700 hover:text-red-700">
          {item.label}
        </a>
      ))}
    </div>
  );
}

function PlayerCard({ player, index }: { player: AnyTrackedPlayer; index: number }) {
  if (!hasStats(player)) {
    const rosterProgram = "programLabel" in player && player.programLabel ? String(player.programLabel) : null;
    return (
      <article className="paper-card reveal-card p-6" style={{ animationDelay: `${index * 45}ms` }}>
        <div className="text-xs font-black uppercase tracking-[0.22em] text-red-700">On watch</div>
        <h3 className="mt-5 text-3xl font-black leading-none tracking-tight text-slate-950">{player.displayName}</h3>
        {rosterProgram ? <div className="mt-3 text-sm font-bold text-slate-700">{rosterProgram}</div> : null}
        <div className="mt-4"><PrepHoopsBadge name={player.displayName} /></div>
        <PlayerQuickLinks name={player.displayName} />
      </article>
    );
  }

  const trend = getPlayerTrend(player.displayName);
  const latestLine = latestDisplayLine(player.displayName);
  const ranks = getPlayerRanks(player);
  const stock = getStockLabel(player);
  const nextGame = playerNextGames[player.displayName as keyof typeof playerNextGames];
  const scoringWidth = Math.min(100, Math.max(8, player.pts_per_game * 4));

  return (
    <article className="paper-card reveal-card group flex min-h-full flex-col p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl" style={{ animationDelay: `${index * 45}ms` }}>
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex min-w-0 gap-4">
          <PlayerAvatar player={player} className="h-20 w-20" />
          <div className="min-w-0">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-red-700">#{player.jerseyNumber ?? "—"} · {player.programLabel ?? player.teamName}</div>
            <h3 className="mt-2 text-3xl font-black leading-[0.95] tracking-tight text-slate-950">{player.displayName}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <StockBadge value={stock} />
              <PrepHoopsBadge name={player.displayName} />
              <HighSchoolBadge name={player.displayName} />
              <NextGameBadge game={nextGame} />
            </div>
            {nextGame ? <div className="mt-2 text-xs font-bold text-slate-500">Next: {opponentFor(nextGame, player.teamName)} · {nextGame.time} PT · {nextGame.court}</div> : null}
            <PlayerQuickLinks name={player.displayName} />
          </div>
        </div>
        <div className="shrink-0 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-center">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Rank</div>
          <div className="text-xl font-black text-slate-950">#{ranks.trackedScoring || "—"}</div>
        </div>
      </div>

      <TodayStatStrip line={latestLine} compact />

      <div className="mt-5 grid grid-cols-5 gap-2">
        {statLabels.map(([label, key]) => (
          <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center">
            <div className="text-[10px] font-black uppercase text-slate-500">{label}</div>
            <div className="mt-1 text-lg font-black text-slate-950">{numberValue(player[key])}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-500">
          <span>Scoring</span>
          <span>{numberValue(player.pts_per_game)} PPG</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-gradient-to-r from-red-700 via-red-500 to-amber-400" style={{ width: `${scoringWidth}%` }} />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-2xl border border-slate-200 p-3">
          <div className="text-xs font-bold text-slate-500">FG%</div>
          <div className="text-lg font-black text-slate-950">{percentValue(player.fg_pct)}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 p-3">
          <div className="text-xs font-bold text-slate-500">3P%</div>
          <div className="text-lg font-black text-slate-950">{percentValue(player.three_pt_pct)}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 p-3">
          <div className="text-xs font-bold text-slate-500">Move</div>
          <div className="text-lg font-black text-slate-950">{signedNumber(trend.ppgDelta)}</div>
        </div>
      </div>

      <ProfileLink href={`/players/${slugify(player.displayName)}`} playerName={player.displayName} source="watchlist_card" className="mt-auto inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-red-700">
        View player
      </ProfileLink>
    </article>
  );
}

function TeamTable({ team }: { team: (typeof eyblData.trackedTeams)[number] }) {
  return (
    <section className="paper-card p-5">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <TeamLogo teamName={team.teamName} className="h-14 w-14" />
          <div>
            <div className="text-xs font-black uppercase tracking-[0.22em] text-red-700">Team leaders</div>
            <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-950">{team.teamName}</h3>
          </div>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-black text-slate-700">{team.playersTracked} players</div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950 text-xs uppercase tracking-widest text-white">
            <tr>
              <th className="px-4 py-3">Player</th>
              <th className="px-3 py-3 text-right">PTS</th>
              <th className="px-3 py-3 text-right">REB</th>
              <th className="px-3 py-3 text-right">AST</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {team.topScorers.slice(0, 6).map((player) => (
              <tr key={player.id} className="transition hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="font-black text-slate-950">{player.name}</div>
                  <div className="text-xs text-slate-500">#{player.jerseyNumber ?? "—"} · {player.games_played} GP</div>
                </td>
                <td className="px-3 py-3 text-right font-black text-red-700">{numberValue(player.pts_per_game)}</td>
                <td className="px-3 py-3 text-right text-slate-700">{numberValue(player.reb_per_game)}</td>
                <td className="px-3 py-3 text-right text-slate-700">{numberValue(player.ast_per_game)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function LeadFeature({ player, label, line }: { player: StatPlayer; label: string; line?: DisplayGameLine | null }) {
  const trend = getPlayerTrend(player.displayName);
  return (
    <ProfileLink href={`/players/${slugify(player.displayName)}`} playerName={player.displayName} source="lead_feature" className="paper-card block p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center gap-4">
        <PlayerAvatar player={player} className="h-20 w-20" />
        <div>
          <div className="text-xs font-black uppercase tracking-[0.22em] text-red-700">{label}</div>
          <div className="mt-2 text-3xl font-black leading-none tracking-tight text-slate-950">{player.displayName}</div>
          <div className="mt-1 text-sm font-bold text-slate-600">{player.teamName}</div>
          <div className="mt-2"><PrepHoopsBadge name={player.displayName} /></div>
        </div>
      </div>
      {line ? <TodayStatStrip line={line} /> : null}
      <div className="mt-6 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-2xl bg-slate-950 p-3 text-white"><div className="text-xs text-slate-400">PPG</div><div className="text-2xl font-black">{numberValue(player.pts_per_game)}</div></div>
        <div className="rounded-2xl bg-slate-100 p-3"><div className="text-xs text-slate-500">3P</div><div className="text-2xl font-black text-slate-950">{percentValue(player.three_pt_pct)}</div></div>
        <div className="rounded-2xl bg-slate-100 p-3"><div className="text-xs text-slate-500">Move</div><div className="text-2xl font-black text-slate-950">{signedNumber(trend.ppgDelta)}</div></div>
      </div>
    </ProfileLink>
  );
}

export default function Home() {
  const foundPlayers = eyblData.trackedPlayers.filter(hasStats);
  const topScorer = [...foundPlayers].sort((a, b) => b.pts_per_game - a.pts_per_game)[0];
  const topShooter = [...foundPlayers].sort((a, b) => (b.three_pt_pct ?? 0) - (a.three_pt_pct ?? 0))[0];
  const topCreator = [...foundPlayers].sort((a, b) => b.ast_per_game - a.ast_per_game)[0];
  const spotlights = getPlayerSpotlights();
  const todaySpotlights: { line: Session4PlayerLine; player: StatPlayer }[] = session4Highlights.flatMap((line) => {
    const player = foundPlayers.find((entry) => entry.displayName === line.player);
    return player ? [{ line: line as Session4PlayerLine, player: player as StatPlayer }] : [];
  });
  const heroCards: { player: StatPlayer; line: DisplayGameLine | null }[] = [
    todaySpotlights[0] ?? { player: topScorer, line: latestDisplayLine(topScorer.displayName) },
    todaySpotlights[1] ?? { player: topShooter, line: latestDisplayLine(topShooter.displayName) },
    todaySpotlights[3] ?? todaySpotlights[2] ?? { player: topCreator, line: latestDisplayLine(topCreator.displayName) },
  ];
  const tickerLines = session4Today.playerLines.length ? [...session4Today.playerLines, ...session4Today.playerLines] : [];
  const tickerPlayers = [...foundPlayers, ...foundPlayers];

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f1e8] text-slate-950">
      <section className="scout-hero relative px-6 py-6 sm:py-8">
        <nav className="relative mx-auto flex max-w-7xl items-center justify-between border-b border-slate-300 pb-5">
          <Link href="/" className="text-2xl font-black tracking-tight text-slate-950">CR Pulse</Link>
          <div className="hidden items-center gap-7 text-sm font-black uppercase tracking-wide text-slate-600 md:flex">
            <a href="#watchlist" className="hover:text-red-700">Watchlist</a>
            <a href="#vegas" className="hover:text-red-700">Vegas</a>
            <a href="#trends" className="hover:text-red-700">Signals</a>
            <a href="#programs" className="hover:text-red-700">Teams</a>
          </div>
          <a href="#vegas" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white transition hover:bg-red-700">Live scores</a>
        </nav>

        <div className="relative mx-auto grid max-w-7xl gap-10 py-12 lg:grid-cols-[1fr_0.82fr] lg:items-end lg:py-16">
          <div>
            <div className="mb-6 inline-flex border-y border-red-700 py-2 text-xs font-black uppercase tracking-[0.32em] text-red-700">
              EYBL today
            </div>
            <h1 className="max-w-5xl text-6xl font-black leading-[0.9] tracking-[-0.055em] text-slate-950 sm:text-7xl lg:text-8xl">
Vegas Session IV: today’s Iowa watchlist.
            </h1>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#watchlist" className="rounded-full bg-red-700 px-6 py-3 text-sm font-black text-white transition hover:bg-slate-950">View watchlist</Link>
              <ProfileLink href={`/players/${slugify(topScorer.displayName)}`} playerName={topScorer.displayName} source="hero_top_scorer" className="rounded-full border border-slate-400 bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:border-slate-950">Top scorer</ProfileLink>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <StatPill label="Updated" value={`${formatUpdatedAt(session4Today.generatedAt)} CT`} />
              <StatPill label="Today lines" value={session4Today.playerLines.length.toString()} />
              <StatPill label="Finals" value={session4Today.games.filter((game) => game.status === "Final").length.toString()} />
            </div>
          </div>

          <div className="grid gap-4">
            <LeadFeature player={heroCards[0].player} line={heroCards[0].line} label={heroCards[0].line ? "Game ball" : "Lead scorer"} />
            <div className="grid gap-4 sm:grid-cols-2">
              <LeadFeature player={heroCards[1].player} line={heroCards[1].line} label={heroCards[1].line ? "Two-way pop" : "Shot maker"} />
              <LeadFeature player={heroCards[2].player} line={heroCards[2].line} label={heroCards[2].line ? "Fresh line" : "Creator"} />
            </div>
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-full border border-slate-300 bg-white py-3 marquee-mask shadow-sm">
          <div className="marquee-track flex w-max gap-3 px-3">
            {tickerLines.length ? tickerLines.map((line, index) => (
              <ProfileLink key={`${line.player}-${line.gameId}-${index}`} href={`/players/${slugify(line.player)}`} playerName={line.player} source="today_ticker" className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-black text-slate-700 transition hover:border-red-700 hover:text-red-700">
                <span>{line.player}</span>
                <span className="text-slate-400">·</span>
                <span>{line.points} pts</span>
                <span className="text-slate-400">·</span>
                <span>{line.assists} ast</span>
                <span className="text-slate-400">·</span>
                <span>{line.status}</span>
              </ProfileLink>
            )) : tickerPlayers.map((player, index) => (
              <ProfileLink key={`${player.displayName}-${index}`} href={`/players/${slugify(player.displayName)}`} playerName={player.displayName} source="ticker" className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-black text-slate-700 transition hover:border-red-700 hover:text-red-700">
                <span>{player.displayName}</span><span className="text-slate-400">·</span><span>{numberValue(player.pts_per_game)} PPG</span><span className="text-slate-400">·</span><span>{player.teamName}</span>
              </ProfileLink>
            ))}
          </div>
        </div>
      </section>

      <section id="watchlist" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 border-b border-slate-300 pb-7">
          <div>
            <div className="text-sm font-black uppercase tracking-[0.25em] text-red-700">Players</div>
            <h2 className="mt-2 text-5xl font-black leading-none tracking-tight text-slate-950 sm:text-6xl">Watchlist</h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {eyblData.trackedPlayers.map((player, index) => <PlayerCard key={player.displayName} player={player} index={index} />)}
        </div>
      </section>

      <section id="vegas" className="mx-auto max-w-7xl px-6 py-16">
        <div className="overflow-hidden rounded-[2.25rem] bg-slate-950 text-white shadow-2xl">
          <div className="relative grid gap-8 p-6 md:p-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="absolute inset-0 opacity-25">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/vegas/nike-eybl-session.webp" alt="Nike EYBL Las Vegas stream graphic" className="h-full w-full object-cover" />
            </div>
            <div className="relative z-10">
              <div className="mb-5 flex flex-wrap gap-3">
                <span className="rounded-full bg-white px-4 py-2 text-sm font-black tracking-tight text-slate-950">NIKE</span>
                <span className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-black tracking-[0.2em] text-white">EYBL</span>
                <span className="rounded-full border border-amber-300/60 bg-amber-300/15 px-4 py-2 text-sm font-black uppercase tracking-wide text-amber-100">Vegas</span>
              </div>
              <div className="text-sm font-black uppercase tracking-[0.28em] text-amber-200">Finals + next tips</div>
              <h2 className="mt-3 max-w-2xl text-5xl font-black leading-none tracking-tight sm:text-6xl">Vegas live board</h2>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={vegasEvent.scheduleUrl} target="_blank" rel="noreferrer" className="rounded-full bg-amber-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-white">Nike schedule</a>
                <a href={vegasEvent.streamHubUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white hover:text-slate-950">Streams</a>
              </div>
              <div className="mt-6 grid gap-2 sm:grid-cols-5">
                {vegasEvent.dayStreams.map((stream) => (
                  <a key={stream.href} href={stream.href} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/10 bg-white/[0.07] p-3 transition hover:bg-white/[0.14]">
                    <div className="text-xs font-black uppercase tracking-widest text-amber-200">{stream.label}</div>
                    <div className="mt-1 text-sm font-bold text-white">{stream.date}</div>
                  </a>
                ))}
              </div>
            </div>
            <div className="relative z-10 grid content-start gap-3">
              <VegasGameCard game={session4Today.games[0]} />
              <div className="max-h-[520px] overflow-y-auto rounded-3xl border border-white/10 bg-slate-950/70 p-3">
                <div className="mb-3 px-2 text-xs font-black uppercase tracking-[0.25em] text-slate-400">Vegas games</div>
                <div className="grid gap-2">
                  {session4Today.games.slice(1).map((game) => <VegasGameCard key={game.id} game={game} compact />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="trends" className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="text-sm font-black uppercase tracking-[0.25em] text-red-300">Notes</div>
            </div>
            <div className="rounded-3xl bg-white px-5 py-4 text-slate-950">
              <div className="text-xs font-black uppercase tracking-widest text-slate-500">Notes</div>
              <div className="mt-1 text-3xl font-black">{spotlights.length}</div>
            </div>
          </div>
          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {spotlights.slice(0, 3).map(({ player, note, ranks }) => {
              if (!note) return null;
              return (
                <ProfileLink key={player.displayName} href={`/players/${slugify(player.displayName)}`} playerName={player.displayName} source="signals_board" className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 transition hover:-translate-y-1 hover:bg-white/[0.1]">
                  <div className="text-xs font-black uppercase tracking-[0.22em] text-red-200">{note!.label}</div>
                  <div className="mt-2 text-2xl font-black tracking-tight">{player.displayName}</div>
                  <div className="text-sm text-slate-400">{player.teamName} · #{ranks.trackedScoring}</div>
                  <div className="mt-4 text-3xl font-black text-white">{note!.value}</div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{note!.detail}</p>
                </ProfileLink>
              );
            })}
          </div>
        </div>
      </section>

      <section id="programs" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8 border-b border-slate-300 pb-7">
          <div className="text-sm font-black uppercase tracking-[0.25em] text-red-700">Team leaders</div>
          <h2 className="mt-2 text-5xl font-black leading-none tracking-tight text-slate-950 sm:text-6xl">Scoring leaders</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {eyblData.trackedTeams.filter((team) => displayTeams.has(team.teamName)).map((team) => <TeamTable key={team.teamName} team={team} />)}
        </div>
      </section>
    </main>
  );
}
