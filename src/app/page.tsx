import { eyblData } from "@/data/eybl";

type Player = (typeof eyblData.trackedPlayers)[number];
type FullPlayer = Player & {
  teamName: string;
  jerseyNumber: string | null;
  games_played: number;
  pts_per_game: number;
  reb_per_game: number;
  ast_per_game: number;
  stl_per_game: number;
  blk_per_game: number;
  tov_per_game: number;
  fg_pct: number | null;
  ft_pct: number | null;
  three_pt_pct: number | null;
  note?: string;
};

const statLabels = [
  ["PTS", "pts_per_game"],
  ["REB", "reb_per_game"],
  ["AST", "ast_per_game"],
  ["STL", "stl_per_game"],
  ["BLK", "blk_per_game"],
] as const;

function numberValue(value: unknown, digits = 1) {
  if (typeof value !== "number") return "—";
  return Number.isInteger(value) ? String(value) : value.toFixed(digits).replace(/\.0$/, "");
}

function percentValue(value: unknown) {
  if (typeof value !== "number") return "—";
  return `${Math.round(value * 100)}%`;
}

function hasStats(player: Player): player is FullPlayer {
  return "pts_per_game" in player;
}

function PlayerCard({ player }: { player: Player }) {
  if (!hasStats(player)) {
    return (
      <article className="rounded-3xl border border-dashed border-amber-300/60 bg-amber-50 p-6 text-amber-950 shadow-sm">
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-amber-700">Watchlist gap</div>
        <h3 className="mt-3 text-2xl font-black">{player.displayName}</h3>
        <p className="mt-3 text-sm leading-6 text-amber-900/80">{"note" in player ? player.note : "No current stats found in the Cerebro feed."}</p>
      </article>
    );
  }

  return (
    <article className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-red-600">#{player.jerseyNumber ?? "—"} · {player.teamName}</div>
          <h3 className="mt-3 text-2xl font-black text-slate-950">{player.displayName}</h3>
          {"note" in player && player.note ? <p className="mt-1 text-xs text-slate-500">{player.note}</p> : null}
        </div>
        <div className="rounded-2xl bg-slate-950 px-3 py-2 text-center text-white">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-300">GP</div>
          <div className="text-xl font-black">{player.games_played}</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-5 gap-2">
        {statLabels.map(([label, key]) => (
          <div key={key} className="rounded-2xl bg-slate-100 p-3 text-center">
            <div className="text-[10px] font-bold text-slate-500">{label}</div>
            <div className="mt-1 text-lg font-black text-slate-950">{numberValue(player[key])}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-2xl border border-slate-200 p-3">
          <div className="text-xs font-bold text-slate-500">FG%</div>
          <div className="text-lg font-black">{percentValue(player.fg_pct)}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 p-3">
          <div className="text-xs font-bold text-slate-500">3P%</div>
          <div className="text-lg font-black">{percentValue(player.three_pt_pct)}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 p-3">
          <div className="text-xs font-bold text-slate-500">FT%</div>
          <div className="text-lg font-black">{percentValue(player.ft_pct)}</div>
        </div>
      </div>
    </article>
  );
}

function TeamTable({ team }: { team: (typeof eyblData.trackedTeams)[number] }) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950 p-5 text-white shadow-xl">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-red-400">Tracked team</div>
          <h3 className="mt-2 text-2xl font-black">{team.teamName}</h3>
        </div>
        <div className="rounded-2xl bg-white/10 px-3 py-2 text-sm font-bold">{team.playersTracked} players</div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/10 text-xs uppercase tracking-widest text-slate-300">
            <tr>
              <th className="px-4 py-3">Player</th>
              <th className="px-3 py-3 text-right">PTS</th>
              <th className="px-3 py-3 text-right">REB</th>
              <th className="px-3 py-3 text-right">AST</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {team.topScorers.slice(0, 6).map((player) => (
              <tr key={player.id}>
                <td className="px-4 py-3">
                  <div className="font-bold">{player.name}</div>
                  <div className="text-xs text-slate-400">#{player.jerseyNumber ?? "—"} · {player.games_played} GP</div>
                </td>
                <td className="px-3 py-3 text-right font-black">{numberValue(player.pts_per_game)}</td>
                <td className="px-3 py-3 text-right">{numberValue(player.reb_per_game)}</td>
                <td className="px-3 py-3 text-right">{numberValue(player.ast_per_game)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function Home() {
  const foundPlayers = eyblData.trackedPlayers.filter(hasStats);
  const topScorer = [...foundPlayers].sort((a, b) => b.pts_per_game - a.pts_per_game)[0];
  const topShooter = [...foundPlayers].sort((a, b) => (b.three_pt_pct ?? 0) - (a.three_pt_pct ?? 0))[0];

  return (
    <main className="min-h-screen bg-[#f6f3ec] text-slate-950">
      <section className="relative overflow-hidden bg-slate-950 px-6 py-16 text-white sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(239,68,68,0.35),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(250,204,21,0.2),_transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 inline-flex rounded-full border border-red-400/40 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-red-200">
            CR Pulse EYBL tracker · Cerebro overallId {eyblData.overallId}
          </div>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl">
                Iowa & Midwest EYBL watchlist, updated with live stat feed numbers.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Current player production for CR Pulse tracked prospects plus quick boards for Kingdom Hoops, All Iowa Attack, Mac Irvin Fire, Brad Beal Elite, and MOKAN programs.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                <div className="text-sm font-bold uppercase tracking-widest text-slate-300">Top tracked scorer</div>
                <div className="mt-3 text-3xl font-black">{topScorer?.displayName}</div>
                <div className="text-red-200">{numberValue(topScorer?.pts_per_game)} PPG · {topScorer?.teamName}</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                <div className="text-sm font-bold uppercase tracking-widest text-slate-300">Best tracked 3P%</div>
                <div className="mt-3 text-3xl font-black">{topShooter?.displayName}</div>
                <div className="text-red-200">{percentValue(topShooter?.three_pt_pct)} from three</div>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="rounded-full bg-white/10 px-4 py-2">Generated {eyblData.generatedAt}</span>
            <span className="rounded-full bg-white/10 px-4 py-2">{eyblData.totalPlayers.toLocaleString()} players in feed</span>
            <span className="rounded-full bg-white/10 px-4 py-2">Source: {eyblData.source}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.25em] text-red-600">Tracked players</div>
            <h2 className="mt-2 text-4xl font-black">Current numbers</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            Per-game stats are from the current Cerebro EYBL player feed. Shooting splits are rounded from raw percentages.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {eyblData.trackedPlayers.map((player) => <PlayerCard key={player.displayName} player={player} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-8">
          <div className="text-sm font-bold uppercase tracking-[0.25em] text-red-600">Program boards</div>
          <h2 className="mt-2 text-4xl font-black">Tracked team scoring leaders</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {eyblData.trackedTeams.map((team) => <TeamTable key={team.teamName} team={team} />)}
        </div>
      </section>
    </main>
  );
}
