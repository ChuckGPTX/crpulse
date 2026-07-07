import Link from "next/link";
import { eyblData } from "@/data/eybl";
import {
  getPlayerAsset,
  getPlayerRanks,
  getPlayerTrend,
  getStockLabel,
  getTeamAsset,
  getTopMovers,
  hasStats,
  numberValue,
  percentValue,
  signedNumber,
  signedPercent,
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

const featureIdeas = [
  {
    title: "Player compare",
    eyebrow: "Coming soon",
    copy: "Pick two prospects and compare scoring role, efficiency, team context, and recent movement in one shareable scouting view.",
  },
  {
    title: "Breakout watch",
    eyebrow: "Coming soon",
    copy: "Highlight players whose scoring, minutes, or shooting splits jump enough to deserve a CR Pulse stock-up note.",
  },
  {
    title: "Game-log timeline",
    eyebrow: "Coming soon",
    copy: "Turn each player page into a living dossier with game-by-game bars, stat spikes, and notes from recent sessions.",
  },
  {
    title: "Share cards",
    eyebrow: "Coming soon",
    copy: "Create clean graphics for newsletters and social posts with player photos, team marks, and updated stat lines.",
  },
];

function TeamLogo({ teamName, className = "h-12 w-12" }: { teamName?: string; className?: string }) {
  const asset = getTeamAsset(teamName);
  if (!asset) return <div className={`${className} rounded-2xl bg-slate-800`} />;
  const darkBackedLogo = teamName?.includes("Kingdom") || teamName?.includes("MOKAN");
  return (
    <div className={`${className} flex items-center justify-center overflow-hidden rounded-2xl ${darkBackedLogo ? "bg-slate-950" : "bg-white"} p-2 shadow-sm ring-1 ring-white/20`}>
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
      <div className={`h-full w-full overflow-hidden rounded-3xl border border-white/15 ${playerAsset ? "bg-slate-900" : darkBackedLogo ? "bg-slate-950" : "bg-white"} shadow-lg`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={playerAsset?.image ?? teamAsset?.logo ?? ""}
          alt={playerAsset ? `${player.displayName} basketball photo` : `${player.teamName} logo`}
          className={`h-full w-full ${playerAsset ? "object-cover object-[center_28%]" : "object-contain p-2"}`}
        />
      </div>
      {playerAsset && teamAsset ? (
        <div className={`absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl border border-white/20 ${darkBackedLogo ? "bg-slate-950" : "bg-white"} p-1 shadow-lg`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={teamAsset.logo} alt={`${player.teamName} logo`} className="max-h-full max-w-full object-contain" />
        </div>
      ) : null}
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-slate-200 shadow-inner">
      <span className="mr-2 text-slate-500">{label}</span>
      <span className="font-black text-white">{value}</span>
    </div>
  );
}

function PlayerCard({ player, index }: { player: AnyTrackedPlayer; index: number }) {
  if (!hasStats(player)) {
    return (
      <article className="reveal-card rounded-[2rem] border border-amber-300/25 bg-amber-300/10 p-6 text-amber-50 shadow-sm" style={{ animationDelay: `${index * 70}ms` }}>
        <div className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">Roster note</div>
        <h3 className="font-display mt-4 text-2xl tracking-tight">{player.displayName}</h3>
        {"programLabel" in player && player.programLabel ? <div className="mt-2 text-sm font-bold text-amber-200">{player.programLabel}</div> : null}
        <p className="mt-3 text-sm leading-6 text-amber-100/75">{"note" in player ? player.note : "Current stat line is not posted yet."}</p>
      </article>
    );
  }

  const trend = getPlayerTrend(player.displayName);
  const ranks = getPlayerRanks(player);
  const stock = getStockLabel(player);
  const scoringWidth = Math.min(100, Math.max(8, player.pts_per_game * 4));

  return (
    <article className="reveal-card group relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/90 p-5 text-white shadow-2xl shadow-slate-950/35 transition duration-500 hover:-translate-y-2 hover:border-red-400/50" style={{ animationDelay: `${index * 70}ms` }}>
      <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.26),transparent_35%)]" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <PlayerAvatar player={player} />
          <div>
            <div className="text-xs font-black uppercase tracking-[0.2em] text-red-300">#{player.jerseyNumber ?? "—"} · {"programLabel" in player && player.programLabel ? player.programLabel : player.teamName}</div>
            <h3 className="font-display mt-2 text-2xl leading-none tracking-tight text-white">{player.displayName}</h3>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-black text-slate-950">
              <span className="pulse-dot h-2 w-2 rounded-full bg-red-600 text-red-600" />
              {stock}
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-center">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Rank</div>
          <div className="text-xl font-black">#{ranks.trackedScoring || "—"}</div>
        </div>
      </div>

      <div className="relative mt-6 grid grid-cols-5 gap-2">
        {statLabels.map(([label, key]) => (
          <div key={key} className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-center">
            <div className="text-[10px] font-bold text-slate-500">{label}</div>
            <div className="mt-1 text-lg font-black text-white">{numberValue(player[key])}</div>
          </div>
        ))}
      </div>

      <div className="relative mt-5 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
          <span>Scoring signal</span>
          <span>{numberValue(player.pts_per_game)} PPG</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div className="stat-meter h-full rounded-full bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300" style={{ width: `${scoringWidth}%` }} />
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-2xl border border-white/10 p-3">
          <div className="text-xs font-bold text-slate-500">FG%</div>
          <div className="text-lg font-black">{percentValue(player.fg_pct)}</div>
        </div>
        <div className="rounded-2xl border border-white/10 p-3">
          <div className="text-xs font-bold text-slate-500">3P%</div>
          <div className="text-lg font-black">{percentValue(player.three_pt_pct)}</div>
        </div>
        <div className="rounded-2xl border border-white/10 p-3">
          <div className="text-xs font-bold text-slate-500">Trend</div>
          <div className="text-lg font-black">{signedNumber(trend.ppgDelta)}</div>
        </div>
      </div>

      <Link href={`/players/${slugify(player.displayName)}`} className="relative mt-5 inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-red-500 hover:text-white">
        Open scouting profile
      </Link>
    </article>
  );
}

function TeamTable({ team }: { team: (typeof eyblData.trackedTeams)[number] }) {
  const asset = getTeamAsset(team.teamName);
  return (
    <section className="dark-card group rounded-[2rem] p-5 text-white transition duration-500 hover:-translate-y-1 hover:border-red-400/35">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <TeamLogo teamName={team.teamName} className="h-14 w-14" />
          <div>
            <div className="text-xs font-black uppercase tracking-[0.25em] text-red-300">Program board</div>
            <h3 className="font-display mt-1 text-2xl tracking-tight">{team.teamName}</h3>
            {asset ? <div className="text-xs text-slate-500">Logo: {asset.source}</div> : null}
          </div>
        </div>
        <div className="rounded-full bg-white/10 px-3 py-2 text-sm font-bold">{team.playersTracked} players</div>
      </div>
      <div className="overflow-hidden rounded-3xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/10 text-xs uppercase tracking-widest text-slate-400">
            <tr>
              <th className="px-4 py-3">Player</th>
              <th className="px-3 py-3 text-right">PTS</th>
              <th className="px-3 py-3 text-right">REB</th>
              <th className="px-3 py-3 text-right">AST</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {team.topScorers.slice(0, 6).map((player) => (
              <tr key={player.id} className="transition hover:bg-white/[0.04]">
                <td className="px-4 py-3">
                  <div className="font-bold text-white">{player.name}</div>
                  <div className="text-xs text-slate-500">#{player.jerseyNumber ?? "—"} · {player.games_played} GP</div>
                </td>
                <td className="px-3 py-3 text-right font-black text-red-200">{numberValue(player.pts_per_game)}</td>
                <td className="px-3 py-3 text-right text-slate-300">{numberValue(player.reb_per_game)}</td>
                <td className="px-3 py-3 text-right text-slate-300">{numberValue(player.ast_per_game)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MomentumCard({ player, label }: { player: StatPlayer; label: string }) {
  const trend = getPlayerTrend(player.displayName);
  return (
    <Link href={`/players/${slugify(player.displayName)}`} className="glass-card block rounded-[2rem] p-5 transition duration-500 hover:-translate-y-1 hover:border-red-300/60">
      <div className="text-xs font-black uppercase tracking-[0.25em] text-red-200">{label}</div>
      <div className="mt-3 flex items-center gap-3">
        <TeamLogo teamName={player.teamName} className="h-12 w-12" />
        <div>
          <div className="font-display text-2xl leading-none tracking-tight text-white">{player.displayName}</div>
          <div className="mt-1 text-sm text-slate-400">{player.teamName}</div>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-2xl bg-white/10 p-3"><div className="text-xs text-slate-400">PPG</div><div className="text-xl font-black text-white">{numberValue(player.pts_per_game)}</div></div>
        <div className="rounded-2xl bg-white/10 p-3"><div className="text-xs text-slate-400">3P</div><div className="text-xl font-black text-white">{percentValue(player.three_pt_pct)}</div></div>
        <div className="rounded-2xl bg-white/10 p-3"><div className="text-xs text-slate-400">Δ</div><div className="text-xl font-black text-white">{signedNumber(trend.ppgDelta)}</div></div>
      </div>
    </Link>
  );
}

export default function Home() {
  const foundPlayers = eyblData.trackedPlayers.filter(hasStats);
  const topScorer = [...foundPlayers].sort((a, b) => b.pts_per_game - a.pts_per_game)[0];
  const topShooter = [...foundPlayers].sort((a, b) => (b.three_pt_pct ?? 0) - (a.three_pt_pct ?? 0))[0];
  const topCreator = [...foundPlayers].sort((a, b) => b.ast_per_game - a.ast_per_game)[0];
  const topMovers = getTopMovers();
  const tickerPlayers = [...foundPlayers, ...foundPlayers];

  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] text-white">
      <section className="court-bg court-lines relative overflow-hidden px-6 py-8 sm:py-10">
        <div className="hero-orb -right-40 top-8" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/70 to-transparent" />
        <nav className="relative mx-auto mb-16 flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
          <div className="font-display text-lg tracking-tight">CR Pulse</div>
          <div className="hidden items-center gap-6 text-sm font-bold text-slate-300 md:flex">
            <a href="#watchlist" className="hover:text-white">Watchlist</a>
            <a href="#trends" className="hover:text-white">Trends</a>
            <a href="#programs" className="hover:text-white">Programs</a>
            <a href="#features" className="hover:text-white">Coming soon</a>
          </div>
          <div className="rounded-full bg-red-500 px-4 py-2 text-sm font-black text-white shadow-lg shadow-red-500/25">Live EYBL board</div>
        </nav>

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.3em] text-red-100">
              <span className="pulse-dot h-2 w-2 rounded-full bg-red-400 text-red-400" />
              Midwest watchlist · live stat refresh
            </div>
            <h1 className="kinetic-title font-display max-w-5xl text-5xl leading-[0.88] tracking-[-0.05em] sm:text-7xl lg:text-8xl">
              A moving scouting desk for Midwest EYBL prospects.
            </h1>
            <p className="reveal-card delay-1 mt-7 max-w-2xl text-lg leading-8 text-slate-300">
              Live player profiles, official team marks, Eastern Iowa additions, and rolling stat trends built for quick scouting reads.
            </p>
            <div className="reveal-card delay-2 mt-8 flex flex-wrap gap-3">
              <Link href="#watchlist" className="rounded-full bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-red-500 hover:text-white">Explore players</Link>
              <Link href={`/players/${slugify(topScorer.displayName)}`} className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-black text-white transition hover:bg-white/10">Open top scorer</Link>
            </div>
            <div className="reveal-card delay-3 mt-8 flex flex-wrap gap-3">
              <StatPill label="Last refresh" value={new Date(eyblData.generatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
              <StatPill label="Players in feed" value={eyblData.totalPlayers.toLocaleString()} />
              <StatPill label="Watchlist" value={eyblData.trackedPlayers.length.toString()} />
            </div>
          </div>

          <div className="reveal-card delay-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <MomentumCard player={topScorer} label="Top tracked scorer" />
            <MomentumCard player={topShooter} label="Best tracked shooter" />
            <MomentumCard player={topCreator} label="Best creator" />
          </div>
        </div>

        <div className="relative mx-auto mt-14 max-w-7xl overflow-hidden rounded-full border border-white/10 bg-black/30 py-3 marquee-mask">
          <div className="marquee-track flex w-max gap-3 px-3">
            {tickerPlayers.map((player, index) => (
              <Link key={`${player.displayName}-${index}`} href={`/players/${slugify(player.displayName)}`} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-white/10">
                <span className="text-red-300">{player.displayName}</span>
                <span>{numberValue(player.pts_per_game)} PPG</span>
                <span className="text-slate-500">·</span>
                <span>{player.teamName}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="watchlist" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="text-sm font-black uppercase tracking-[0.25em] text-red-300">Tracked players</div>
            <h2 className="font-display mt-2 text-4xl leading-none tracking-tight sm:text-6xl">Eastern Iowa watchlist</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-400">
            Current production, team context, photos, and profile links for CR Pulse players to follow.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {eyblData.trackedPlayers.map((player, index) => <PlayerCard key={player.displayName} player={player} index={index} />)}
        </div>
      </section>

      <section id="trends" className="mx-auto max-w-7xl px-6 pb-16">
        <div className="glass-card rounded-[2rem] p-6 md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="text-sm font-black uppercase tracking-[0.25em] text-red-200">Trend tracking</div>
              <h2 className="font-display mt-2 text-4xl leading-none tracking-tight sm:text-5xl">Recent movement</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Each refresh keeps a compact stat history. As new games hit the feed, this section will show rising scorers, shooting jumps, and stock-up notes.
              </p>
            </div>
            <div className="rounded-3xl bg-white px-5 py-4 text-slate-950">
              <div className="text-xs font-black uppercase tracking-widest text-slate-500">Top movers</div>
              <div className="mt-1 text-3xl font-black">{topMovers.length || "Baseline"}</div>
            </div>
          </div>
          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {topMovers.length ? topMovers.slice(0, 3).map((mover) => (
              <div key={mover.displayName} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                <div className="font-display text-2xl tracking-tight">{mover.displayName}</div>
                <div className="text-sm text-slate-400">{mover.teamName}</div>
                <div className="mt-3 text-3xl font-black text-red-200">{signedNumber(mover.ppgDelta)} PPG</div>
              </div>
            )) : foundPlayers.slice(0, 3).map((player) => {
              const trend = getPlayerTrend(player.displayName);
              return (
                <div key={player.displayName} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                  <div className="font-display text-2xl tracking-tight">{player.displayName}</div>
                  <div className="text-sm text-slate-400">Baseline captured</div>
                  <div className="mt-3 text-sm font-black uppercase tracking-wider text-slate-300">3P trend {signedPercent(trend.threePtDelta)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-8">
          <div className="text-sm font-black uppercase tracking-[0.25em] text-red-300">Coming next</div>
          <h2 className="font-display mt-2 text-4xl leading-none tracking-tight sm:text-6xl">More scouting tools</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featureIdeas.map((feature, index) => (
            <div key={feature.title} className="reveal-card rounded-[2rem] border border-white/10 bg-white/[0.04] p-6" style={{ animationDelay: `${index * 90}ms` }}>
              <div className="text-xs font-black uppercase tracking-[0.25em] text-red-200">{feature.eyebrow}</div>
              <h3 className="font-display mt-4 text-2xl leading-none tracking-tight">{feature.title}</h3>
              <p className="mt-4 text-sm leading-6 text-slate-400">{feature.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="programs" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8">
          <div className="text-sm font-black uppercase tracking-[0.25em] text-red-300">Program boards</div>
          <h2 className="font-display mt-2 text-4xl leading-none tracking-tight sm:text-6xl">Tracked team scoring leaders</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {eyblData.trackedTeams.map((team) => <TeamTable key={team.teamName} team={team} />)}
        </div>
      </section>
    </main>
  );
}
