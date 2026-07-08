export const playerNotes = {
  "Charles Crawley": {
    label: "High school film note",
    value: "18 pts · 6 reb · 4/8 3P",
    detail: "Posted game film vs. Xavier on X; useful shooting marker next to the current EYCL sample.",
  },
  "Traeshon Fields": {
    label: "High school heater",
    value: "39 pts · 11/15 3P",
    detail: "Posted substate-quarterfinal highlights vs. Pleasant Valley; strong enough to anchor the movement board even when live deltas are flat.",
  },
  "Chase Goodheart": {
    label: "Freshman baseline",
    value: "7.9 PPG · 34% 3P",
    detail: "Public Hudl/X post gives a high-school baseline to compare against the current All Iowa Attack sample.",
  },
  "Tate McCollum": {
    label: "Offer + shooting signal",
    value: "D1 offer · 19 PPG",
    detail: "X/Hudl notes include Montana State offer and junior-year scoring/shooting production.",
  },
  "Brayden Tanny": {
    label: "Event/game note",
    value: "13 pts · 8 reb · 5 ast",
    detail: "Posted regional-game production with three dunks; pairs well with his current 7.5 RPG board line.",
  },
} as const;

export type PlayerNoteName = keyof typeof playerNotes;
