import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPlayerAsset,
  getPlayerBySlug,
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

export default async function PlayerProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const player = getPlayerBySlug(slug);
  if (!player) notFound();

  const ranks = getPlayerRanks(player);
  const trend = getPlayerTrend(player.displayName);
  const team = getTeamBoard(player.teamName);
  const playerAsset = getPlayerAsset(player.displayName);
  const stock = getStockLabel(player);
  const scouting = getScoutingBlurb(player);
  const program = player.programLabel ?? player.teamName;

  return (
    <main className="min-h-screen bg-[#f5f1e8] text-slate-950">
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

      <section className="mx-auto grid max-w-7xl gap-5 px-6 py-10 md:grid-cols-3">
        {statCards.map(([label, key]) => (
          <div key={key} className="paper-card p-6">
            <div className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">{label}</div>
            <div className="mt-2 text-5xl font-black text-slate-950">{numberValue(player[key])}</div>
            <div className="mt-2 text-sm text-slate-500">Current board number</div>
          </div>
        ))}
      </section>

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
              <div className="mt-2 text-3xl font-black">#{ranks.teamScoring || "—"}</div>
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
