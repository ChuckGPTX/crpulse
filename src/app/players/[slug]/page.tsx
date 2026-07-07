import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPlayerAsset,
  getPlayerBySlug,
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
    title: player ? `${player.displayName} EYBL Profile | CR Pulse` : "EYBL Player Profile | CR Pulse",
    description: player ? `${player.displayName} stats, team context, trends, and scouting notes.` : "CR Pulse EYBL player profile.",
  };
}

function TeamLogo({ player }: { player: StatPlayer }) {
  const asset = getTeamAsset(player.teamName);
  if (!asset) return null;
  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white p-4 shadow-xl ring-1 ring-slate-200">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset.logo} alt={`${player.teamName} logo`} className="max-h-full max-w-full object-contain" />
    </div>
  );
}

export default async function PlayerProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const player = getPlayerBySlug(slug);
  if (!player) notFound();

  const ranks = getPlayerRanks(player);
  const trend = getPlayerTrend(player.displayName);
  const team = getTeamBoard(player.teamName);
  const asset = getTeamAsset(player.teamName);
  const playerAsset = getPlayerAsset(player.displayName);
  const stock = getStockLabel(player);
  const scouting = getScoutingBlurb(player);

  return (
    <main className="min-h-screen bg-[#f6f3ec] text-slate-950">
      <section className="bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="text-sm font-bold text-red-200 hover:text-white">← Back to tracker</Link>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <div className="mb-5 flex items-center gap-4">
                <TeamLogo player={player} />
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.3em] text-red-300">#{player.jerseyNumber ?? "—"} · {player.teamName}</div>
                  {asset ? <div className="mt-1 text-xs text-slate-400">Logo source: {asset.source}</div> : null}
                </div>
              </div>
              <h1 className="text-5xl font-black leading-none tracking-tight sm:text-7xl">{player.displayName}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{scouting}</p>
            </div>
            <div className="space-y-4">
              {playerAsset ? (
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={playerAsset.image} alt={`${player.displayName} basketball photo`} className="h-[420px] w-full object-cover object-[center_35%]" />
                  <div className="px-4 py-3 text-xs text-slate-300">Photo source: {playerAsset.source}</div>
                </div>
              ) : null}
              <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                <div className="text-xs font-bold uppercase tracking-[0.25em] text-slate-300">CR Pulse status</div>
                <div className="mt-3 text-4xl font-black">{stock}</div>
                <div className="mt-3 text-sm leading-6 text-slate-300">{getTeamContext(player)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-10 md:grid-cols-3">
        {statCards.map(([label, key]) => (
          <div key={key} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">{label}</div>
            <div className="mt-2 text-4xl font-black">{numberValue(player[key])}</div>
            <div className="mt-2 text-sm text-slate-500">Per-game feed unless noted</div>
          </div>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-bold uppercase tracking-[0.25em] text-red-600">Shooting splits</div>
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

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-bold uppercase tracking-[0.25em] text-red-600">Team context</div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-950 p-4 text-white">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Team PPG rank</div>
              <div className="mt-2 text-3xl font-black">#{ranks.teamScoring || "—"}</div>
              <div className="text-xs text-slate-400">among displayed team leaders</div>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Tracked rank</div>
              <div className="mt-2 text-3xl font-black">#{ranks.trackedScoring || "—"}</div>
              <div className="text-xs text-slate-500">CR Pulse watchlist PPG</div>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Team sample</div>
              <div className="mt-2 text-3xl font-black">{team?.playersTracked ?? "—"}</div>
              <div className="text-xs text-slate-500">players in feed</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-16 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-bold uppercase tracking-[0.25em] text-red-600">Trend tracking</div>
          <h2 className="mt-2 text-3xl font-black">Snapshot movement</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            We now save a rolling snapshot on each scheduled refresh. The first live refresh establishes the baseline; future updates will show true movement.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-100 p-4">
              <div className="text-xs font-bold text-slate-500">PPG Δ</div>
              <div className="mt-1 text-3xl font-black text-red-600">{signedNumber(trend.ppgDelta)}</div>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4">
              <div className="text-xs font-bold text-slate-500">3P Δ</div>
              <div className="mt-1 text-3xl font-black text-red-600">{signedPercent(trend.threePtDelta)}</div>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4">
              <div className="text-xs font-bold text-slate-500">Minutes Δ</div>
              <div className="mt-1 text-3xl font-black text-red-600">{signedNumber(trend.minutesDelta, 0)}</div>
            </div>
          </div>
          <div className="mt-5 text-xs text-slate-500">Snapshots captured: {trend.snapshots.length}</div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-bold uppercase tracking-[0.25em] text-red-600">Stock / watch note</div>
          <h2 className="mt-2 text-3xl font-black">{stock}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            {stock === "Stock up"
              ? `${player.displayName} is showing a clear signal through scoring efficiency, volume, or shooting value. Keep this player high on the daily recap list.`
              : stock === "Watch"
                ? `${player.displayName} needs continued tracking as the sample grows. Watch minutes, shot volume, and role stability over the next refreshes.`
                : `${player.displayName} remains in the monitored group. The next useful signal will be movement in PPG, three-point rate, or minutes.`}
          </p>
        </div>
      </section>
    </main>
  );
}
