import Link from "next/link";
import { notFound } from "next/navigation";
import { GameCountdown } from "@/components/GameCountdown";
import { ProfileViewTracker } from "@/components/visitor-tracking";
import { playerNextGames, vegasEvent } from "@/data/vegas-schedule";
import {
  getPlayerAsset,
  getPlayerBySlug,
  getHighSchoolRole,
  getHighSchoolStats,
  getPlayerLinks,
  getPlayerRanking,
  getPlayerRanks,
  getPlayerTrend,
  getScoutingBlurb,
  getStockLabel,
  getTeamAsset,
  getTeamBoard,
  getTeamContext,
  getTrackedStatPlayers,
  numberValue,
  percentValue,
  signedNumber,
  signedPercent,
  slugify,
  type StatPlayer,
} from "@/lib/eybl-utils";

const statCards: [string, keyof StatPlayer][] = [
  ["Points", "pts_per_game"],
  ["Rebounds", "reb_per_game"],
  ["Assists", "ast_per_game"],
  ["Steals", "stl_per_game"],
  ["Blocks", "blk_per_game"],
  ["Minutes", "total_minutes"],
];

export function generateStaticParams() {
  return getTrackedStatPlayers().map((player) => ({ slug: slugify(player.displayName) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const player = getPlayerBySlug(slug);
  return {
    title: player ? `${player.displayName} Scouting Profile | CR Pulse` : "Player Scouting Profile | CR Pulse",
    description: player ? `${player.displayName} production, team context, movement, and scouting notes.` : "CR Pulse player scouting profile.",
  };
}

function TeamLogo({ player, className = "h-20 w-20" }: { player: StatPlayer; className?: string }) {
  const asset = getTeamAsset(player.teamName);
  if (!asset) return null;
  const darkBackedLogo = player.teamName.includes("Kingdom") || player.teamName.includes("MOKAN");
  return (
    <div className={`${className} flex items-center justify-center rounded-3xl border border-slate-200 ${darkBackedLogo ? "bg-slate-950" : "bg-white"} p-4 shadow-sm`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset.logo} alt={`${player.teamName} logo`} className="max-h-full max-w-full object-contain" />
    </div>
  );
}

function StockBadge({ value }: { value: string }) {
  const tone = value === "Stock up" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : value === "Watch" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-700 border-slate-200";
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide ${tone}`}>{value}</span>;
}

function PrepHoopsBadge({ name }: { name: string }) {
  const ranking = getPlayerRanking(name);
  if (!ranking) return null;
  return (
    <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-red-700">
      {ranking.label}
    </span>
  );
}

function RecruitingLinks({ name }: { name: string }) {
  const links = getPlayerLinks(name);
  if (!links) return null;
  const x = "x" in links ? links.x : null;
  const hudl = "hudl" in links ? links.hudl : null;
  const highSchool = "highSchool" in links ? links.highSchool : null;
  const snapshot = "snapshot" in links ? links.snapshot : null;
  const items = [
    x ? { label: "X profile", href: x, description: "Player updates and highlights" } : null,
    hudl ? { label: "Hudl", href: hudl, description: "Video highlights" } : null,
    highSchool ? { label: highSchool.label, href: highSchool.url, description: "Bound team page" } : null,
  ].filter(Boolean) as { label: string; href: string; description: string }[];
  if (!items.length && !snapshot) return null;
  return (
    <div className="paper-card p-6">
      <div className="text-sm font-black uppercase tracking-[0.25em] text-red-700">Recruiting links</div>
      {snapshot ? <p className="mt-4 text-sm leading-7 text-slate-600">{snapshot}</p> : null}
      <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
        {items.map((item) => (
          <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-red-700 hover:bg-white">
            <div className="text-sm font-black text-slate-950">{item.label}</div>
            <div className="mt-1 text-xs text-slate-500">{item.description}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

function HighSchoolProduction({ player }: { player: StatPlayer }) {
  const stats = getHighSchoolStats(player.displayName);
  const role = getHighSchoolRole(player.displayName);
  if (!stats) return null;
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-10 lg:grid-cols-[1fr_1fr]">
      <div className="paper-card overflow-hidden p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-black uppercase tracking-[0.25em] text-red-700">High School Production</div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{stats.school}</h2>
            <div className="mt-2 text-sm font-bold text-slate-500">#{stats.jersey} · {stats.grade} · listed on GoBound as {stats.goBoundName}</div>
          </div>
          <a href={stats.sourceUrl} target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-slate-700 transition hover:border-red-700 hover:text-red-700">
            GoBound source
          </a>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-slate-950 p-4 text-white">
            <div className="text-xs font-bold text-slate-400">PPG</div>
            <div className="mt-1 text-3xl font-black">{numberValue(stats.ppg)}</div>
          </div>
          <div className="rounded-2xl bg-slate-100 p-4">
            <div className="text-xs font-bold text-slate-500">RPG</div>
            <div className="mt-1 text-3xl font-black">{numberValue(stats.rpg)}</div>
          </div>
          <div className="rounded-2xl bg-slate-100 p-4">
            <div className="text-xs font-bold text-slate-500">APG</div>
            <div className="mt-1 text-3xl font-black">{numberValue(stats.apg)}</div>
          </div>
          <div className="rounded-2xl bg-red-50 p-4 text-red-800">
            <div className="text-xs font-bold text-red-500">Role</div>
            <div className="mt-1 text-sm font-black leading-tight">{role}</div>
          </div>
        </div>
        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 p-4"><span className="font-black">FG</span> {stats.fieldGoals.made}/{stats.fieldGoals.attempted} · {percentValue(stats.fieldGoals.pct)}</div>
          <div className="rounded-2xl border border-slate-200 p-4"><span className="font-black">3PT</span> {stats.threes.made}/{stats.threes.attempted} · {percentValue(stats.threes.pct)}</div>
          <div className="rounded-2xl border border-slate-200 p-4"><span className="font-black">FT</span> {stats.freeThrows.made}/{stats.freeThrows.attempted} · {percentValue(stats.freeThrows.pct)}</div>
        </div>
      </div>

      <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
        <div className="text-sm font-black uppercase tracking-[0.25em] text-red-300">EYBL vs High School</div>
        <h2 className="mt-2 text-3xl font-black tracking-tight">Two-context read</h2>
        <div className="mt-6 grid gap-3">
          {[
            ["Scoring", `${numberValue(player.pts_per_game)} EYBL`, `${numberValue(stats.ppg)} HS`],
            ["Shooting", `${percentValue(player.three_pt_pct)} EYBL 3PT`, `${percentValue(stats.threes.pct)} HS 3PT`],
            ["Creation", `${numberValue(player.ast_per_game)} EYBL APG`, `${numberValue(stats.apg)} HS APG`],
          ].map(([label, eybl, school]) => (
            <div key={label} className="grid grid-cols-[0.8fr_1fr_1fr] items-center gap-3 rounded-2xl bg-white/10 p-4">
              <div className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</div>
              <div className="font-black text-white">{eybl}</div>
              <div className="font-black text-red-100">{school}</div>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm leading-6 text-slate-300">High-school stats are season totals from public GoBound pages; EYBL stats are the current CR Pulse/Cerebro sample.</p>
      </div>
    </section>
  );
}

export default async function PlayerProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const player = getPlayerBySlug(slug);
  if (!player) notFound();

  const ranks = getPlayerRanks(player);
  const trend = getPlayerTrend(player.displayName);
  const team = getTeamBoard(player.teamName);
  const playerAsset = getPlayerAsset(player.displayName);
  const links = getPlayerLinks(player.displayName);
  const stock = getStockLabel(player);
  const scouting = getScoutingBlurb(player);
  const program = player.programLabel ?? player.teamName;
  const nextGame = playerNextGames[player.displayName as keyof typeof playerNextGames];

  return (
    <main className="min-h-screen bg-[#f5f1e8] text-slate-950">
      <ProfileViewTracker playerName={player.displayName} slug={slug} teamName={player.teamName} />
      <section className="scout-hero px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center justify-between border-b border-slate-300 pb-5">
            <Link href="/" className="text-sm font-black uppercase tracking-wide text-red-700 hover:text-slate-950">← Back to CR Pulse</Link>
            <div className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">Scouting profile</div>
          </nav>

          <div className="grid gap-8 py-10 lg:grid-cols-[1fr_380px] lg:items-end">
            <div>
              <div className="mb-6 flex items-center gap-4">
                <TeamLogo player={player} />
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.3em] text-red-700">#{player.jerseyNumber ?? "—"} · {program}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <StockBadge value={stock} />
                    <PrepHoopsBadge name={player.displayName} />
                  </div>
                </div>
              </div>
              <h1 className="max-w-4xl text-6xl font-black leading-[0.9] tracking-[-0.055em] text-slate-950 sm:text-7xl lg:text-8xl">{player.displayName}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">{scouting}</p>
            </div>
            <div className="space-y-4">
              {playerAsset ? (
                <div className="overflow-hidden rounded-[2rem] border border-slate-300 bg-white shadow-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={playerAsset.image} alt={`${player.displayName} basketball photo`} className="h-[430px] w-full object-cover object-[center_32%]" />
                  <div className="px-4 py-3 text-xs font-bold text-slate-500">Photo submitted to CR Pulse</div>
                </div>
              ) : (
                <div className="paper-card flex min-h-[300px] items-center justify-center p-8">
                  <TeamLogo player={player} className="h-36 w-36" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {nextGame ? (
        <section className="mx-auto max-w-7xl px-6 pb-10">
          <div className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.28em] text-amber-200">Next Vegas game</div>
                <h2 className="mt-2 text-3xl font-black tracking-tight">{nextGame.awayTeam} vs {nextGame.homeTeam}</h2>
                <div className="mt-2 text-sm font-bold text-slate-300">{nextGame.date} · {nextGame.time} PT · {nextGame.court} · {nextGame.division}</div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <GameCountdown targetIso={nextGame.iso} />
                <a href={vegasEvent.streamHubUrl} target="_blank" rel="noreferrer" className="rounded-full bg-amber-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-white">Watch stream</a>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto grid max-w-7xl gap-5 px-6 py-10 md:grid-cols-3">
        {statCards.map(([label, key]) => (
          <div key={key} className="paper-card p-6">
            <div className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">{label}</div>
            <div className="mt-2 text-5xl font-black text-slate-950">{numberValue(player[key])}</div>
            <div className="mt-2 text-sm text-slate-500">Current board number</div>
          </div>
        ))}
      </section>

      <HighSchoolProduction player={player} />

      {links ? (
        <section className="mx-auto max-w-7xl px-6 pb-10">
          <RecruitingLinks name={player.displayName} />
        </section>
      ) : null}

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="paper-card p-6">
          <div className="text-sm font-black uppercase tracking-[0.25em] text-red-700">Shooting profile</div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-slate-100 p-4 text-center">
              <div className="text-xs font-bold text-slate-500">FG%</div>
              <div className="mt-1 text-3xl font-black">{percentValue(player.fg_pct)}</div>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4 text-center">
              <div className="text-xs font-bold text-slate-500">3P%</div>
              <div className="mt-1 text-3xl font-black">{percentValue(player.three_pt_pct)}</div>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4 text-center">
              <div className="text-xs font-bold text-slate-500">FT%</div>
              <div className="mt-1 text-3xl font-black">{percentValue(player.ft_pct)}</div>
            </div>
          </div>
        </div>

        <div className="paper-card p-6">
          <div className="text-sm font-black uppercase tracking-[0.25em] text-red-700">Team context</div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-950 p-4 text-white">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Team scoring</div>
              <div className="mt-2 whitespace-nowrap text-3xl font-black">#{ranks.teamScoring || "—"}</div>
              <div className="text-xs text-slate-400">within program leaders</div>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Watchlist rank</div>
              <div className="mt-2 text-3xl font-black">#{ranks.trackedScoring || "—"}</div>
              <div className="text-xs text-slate-500">by points per game</div>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Team sample</div>
              <div className="mt-2 text-3xl font-black">{team?.playersTracked ?? "—"}</div>
              <div className="text-xs text-slate-500">players reviewed</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-16 lg:grid-cols-2">
        <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
          <div className="text-sm font-black uppercase tracking-[0.25em] text-red-300">Recent movement</div>
          <h2 className="mt-2 text-3xl font-black">Latest comparison</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Movement is measured against the prior board refresh so production swings stay easy to monitor.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <div className="text-xs font-bold text-slate-400">PPG</div>
              <div className="mt-1 text-3xl font-black text-red-200">{signedNumber(trend.ppgDelta)}</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <div className="text-xs font-bold text-slate-400">3P</div>
              <div className="mt-1 text-3xl font-black text-red-200">{signedPercent(trend.threePtDelta)}</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <div className="text-xs font-bold text-slate-400">Minutes</div>
              <div className="mt-1 text-3xl font-black text-red-200">{signedNumber(trend.minutesDelta, 0)}</div>
            </div>
          </div>
          <div className="mt-5 text-xs text-slate-400">Refreshes compared: {trend.snapshots.length}</div>
        </div>

        <div className="paper-card p-6">
          <div className="text-sm font-black uppercase tracking-[0.25em] text-red-700">Scouting note</div>
          <h2 className="mt-2 text-3xl font-black">{stock}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            {stock === "Stock up"
              ? `${player.displayName} is showing a clear signal through scoring efficiency, volume, or shooting value. Keep this player high on the CR Pulse recap list.`
              : stock === "Watch"
                ? `${player.displayName} needs continued tracking as the sample grows. Watch minutes, shot volume, and role stability over the next refreshes.`
                : `${player.displayName} remains in the monitored group. The next useful signal will be movement in PPG, three-point rate, or minutes.`}
          </p>
          <p className="mt-5 rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-700">{getTeamContext(player)}</p>
        </div>
      </section>
    </main>
  );
}
