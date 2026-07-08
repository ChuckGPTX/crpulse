export const playerNotes = {
  "Charles Crawley": {
    label: "Film note",
    value: "18 pts · 6 reb · 4/8 3P",
    detail: "Game film vs. Xavier showed shot-making that matches the EYCL line.",
  },
  "Traeshon Fields": {
    label: "High school game",
    value: "39 pts · 11/15 3P",
    detail: "Substate highlight tape vs. Pleasant Valley: 39 points and 11 threes.",
  },
  "Chase Goodheart": {
    label: "Freshman year",
    value: "7.9 PPG · 34% 3P",
    detail: "Freshman numbers give his All Iowa Attack line more context.",
  },
  "Tate McCollum": {
    label: "Offer and scoring",
    value: "D1 offer · 19 PPG",
    detail: "Montana State offer, 19 PPG, and strong junior-year shooting.",
  },
  "Brayden Tanny": {
    label: "Game note",
    value: "13 pts · 8 reb · 5 ast",
    detail: "Regional game line with three dunks and eight boards.",
  },
} as const;

export type PlayerNoteName = keyof typeof playerNotes;
