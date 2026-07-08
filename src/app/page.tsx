import Link from "next/link";
import { eyblData } from "@/data/eybl";
import {
  getPlayerAsset,
  getPlayerLinks,
  getPlayerRanking,
  getPlayerRanks,
  getPlayerSpotlights,
  getPlayerTrend,
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
        <div className="text-xs font-black uppercase tracking-[0.22em] text-red-700">Roster note</div>
        <h3 className="mt-5 text-3xl font-black leading-none tracking-tight text-slate-950">{player.displayName}</h3>
        {rosterProgram ? <div className="mt-3 text-sm font-bold text-slate-700">{rosterProgram}</div> : null}
        <div className="mt-4"><PrepHoopsBadge name={player.displayName} /></div>
        <PlayerQuickLinks name={player.displayName} />
      </article>
    );
  }

  const trend = getPlayerTrend(player.displayName);
  const ranks = getPlayerRanks(player);
  const stock = getStockLabel(player);
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
            </div>
            <PlayerQuickLinks name={player.displayName} />
          </div>
        </div>
        <div className="shrink-0 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-center">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Board</div>
          <div className="text-xl font-black text-slate-950">#{ranks.trackedScoring || "—"}</div>
        </div>
      </div>

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
          <span>Scoring role</span>
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

      <Link href={`/players/${slugify(player.displayName)}`} className="mt-auto inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-red-700">
        Open scouting profile
      </Link>
    </article>
  );
}

function TeamTable({ team }: { team: (typeof eyblData.trackedTeams)[number] }) {
  const asset = getTeamAsset(team.teamName);
  return (
    <section className="paper-card p-5">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <TeamLogo teamName={team.teamName} className="h-14 w-14" />
          <div>
            <div className="text-xs font-black uppercase tracking-[0.22em] text-red-700">Program board</div>
            <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-950">{team.teamName}</h3>
            {asset ? <div className="text-xs text-slate-500">Official mark: {asset.source}</div> : null}
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

function LeadFeature({ player, label }: { player: StatPlayer; label: string }) {
  const trend = getPlayerTrend(player.displayName);
  return (
    <Link href={`/players/${slugify(player.displayName)}`} className="paper-card block p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center gap-4">
        <PlayerAvatar player={player} className="h-20 w-20" />
        <div>
          <div className="text-xs font-black uppercase tracking-[0.22em] text-red-700">{label}</div>
          <div className="mt-2 text-3xl font-black leading-none tracking-tight text-slate-950">{player.displayName}</div>
          <div className="mt-1 text-sm font-bold text-slate-600">{player.teamName}</div>
          <div className="mt-2"><PrepHoopsBadge name={player.displayName} /></div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-2xl bg-slate-950 p-3 text-white"><div className="text-xs text-slate-400">PPG</div><div className="text-2xl font-black">{numberValue(player.pts_per_game)}</div></div>
        <div className="rounded-2xl bg-slate-100 p-3"><div className="text-xs text-slate-500">3P</div><div className="text-2xl font-black text-slate-950">{percentValue(player.three_pt_pct)}</div></div>
        <div className="rounded-2xl bg-slate-100 p-3"><div className="text-xs text-slate-500">Move</div><div className="text-2xl font-black text-slate-950">{signedNumber(trend.ppgDelta)}</div></div>
      </div>
    </Link>
  );
}

export default function Home() {
  const foundPlayers = eyblData.trackedPlayers.filter(hasStats);
  const topScorer = [...foundPlayers].sort((a, b) => b.pts_per_game - a.pts_per_game)[0];
  const topShooter = [...foundPlayers].sort((a, b) => (b.three_pt_pct ?? 0) - (a.three_pt_pct ?? 0))[0];
  const topCreator = [...foundPlayers].sort((a, b) => b.ast_per_game - a.ast_per_game)[0];
  const spotlights = getPlayerSpotlights();
  const tickerPlayers = [...foundPlayers, ...foundPlayers];

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f1e8] text-slate-950">
      <section className="scout-hero relative px-6 py-6 sm:py-8">
        <nav className="relative mx-auto flex max-w-7xl items-center justify-between border-b border-slate-300 pb-5">
          <Link href="/" className="text-2xl font-black tracking-tight text-slate-950">CR Pulse</Link>
          <div className="hidden items-center gap-7 text-sm font-black uppercase tracking-wide text-slate-600 md:flex">
            <a href="#watchlist" className="hover:text-red-700">Watchlist</a>
            <a href="#trends" className="hover:text-red-700">Movement</a>
            <a href="#programs" className="hover:text-red-700">Programs</a>
            <a href="#scouting-room" className="hover:text-red-700">Scouting room</a>
          </div>
          <div className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">Live board</div>
        </nav>

        <div className="relative mx-auto grid max-w-7xl gap-10 py-12 lg:grid-cols-[1fr_0.82fr] lg:items-end lg:py-16">
          <div>
            <div className="mb-6 inline-flex border-y border-red-700 py-2 text-xs font-black uppercase tracking-[0.32em] text-red-700">
              EYBL live board
            </div>
            <h1 className="max-w-5xl text-6xl font-black leading-[0.9] tracking-[-0.055em] text-slate-950 sm:text-7xl lg:text-8xl">
              Eastern Iowa prospects, tracked like a real scouting desk.
            </h1>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#watchlist" className="rounded-full bg-red-700 px-6 py-3 text-sm font-black text-white transition hover:bg-slate-950">View watchlist</Link>
              <Link href={`/players/${slugify(topScorer.displayName)}`} className="rounded-full border border-slate-400 bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:border-slate-950">Open top scorer</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <StatPill label="Last refresh" value={new Date(eyblData.generatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
              <StatPill label="Player pool" value={eyblData.totalPlayers.toLocaleString()} />
              <StatPill label="Watchlist" value={eyblData.trackedPlayers.length.toString()} />
            </div>
          </div>

          <div className="grid gap-4">
            <LeadFeature player={topScorer} label="Lead scorer" />
            <div className="grid gap-4 sm:grid-cols-2">
              <LeadFeature player={topShooter} label="Shot maker" />
              <LeadFeature player={topCreator} label="Creator" />
            </div>
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-full border border-slate-300 bg-white py-3 marquee-mask shadow-sm">
          <div className="marquee-track flex w-max gap-3 px-3">
            {tickerPlayers.map((player, index) => (
              <Link key={`${player.displayName}-${index}`} href={`/players/${slugify(player.displayName)}`} className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-black text-slate-700 transition hover:border-red-700 hover:text-red-700">
                <span>{player.displayName}</span>
                <span className="text-slate-400">·</span>
                <span>{numberValue(player.pts_per_game)} PPG</span>
                <span className="text-slate-400">·</span>
                <span>{player.teamName}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="watchlist" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 border-b border-slate-300 pb-7">
          <div>
            <div className="text-sm font-black uppercase tracking-[0.25em] text-red-700">Tracked players</div>
            <h2 className="mt-2 text-5xl font-black leading-none tracking-tight text-slate-950 sm:text-6xl">Eastern Iowa watchlist</h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {eyblData.trackedPlayers.map((player, index) => <PlayerCard key={player.displayName} player={player} index={index} />)}
        </div>
      </section>

      <section id="trends" className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="text-sm font-black uppercase tracking-[0.25em] text-red-300">Signals board</div>
            </div>
            <div className="rounded-3xl bg-white px-5 py-4 text-slate-950">
              <div className="text-xs font-black uppercase tracking-widest text-slate-500">Signals loaded</div>
              <div className="mt-1 text-3xl font-black">{spotlights.length}</div>
            </div>
          </div>
          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {spotlights.slice(0, 3).map(({ player, note, ranks }) => {
              if (!note) return null;
              return (
                <Link key={player.displayName} href={`/players/${slugify(player.displayName)}`} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 transition hover:-translate-y-1 hover:bg-white/[0.1]">
                  <div className="text-xs font-black uppercase tracking-[0.22em] text-red-200">{note!.label}</div>
                  <div className="mt-2 text-2xl font-black tracking-tight">{player.displayName}</div>
                  <div className="text-sm text-slate-400">{player.teamName} · board #{ranks.trackedScoring}</div>
                  <div className="mt-4 text-3xl font-black text-white">{note!.value}</div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{note!.detail}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="programs" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8 border-b border-slate-300 pb-7">
          <div className="text-sm font-black uppercase tracking-[0.25em] text-red-700">Program boards</div>
          <h2 className="mt-2 text-5xl font-black leading-none tracking-tight text-slate-950 sm:text-6xl">Team scoring leaders</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {eyblData.trackedTeams.filter((team) => displayTeams.has(team.teamName)).map((team) => <TeamTable key={team.teamName} team={team} />)}
        </div>
      </section>
    </main>
  );
}
