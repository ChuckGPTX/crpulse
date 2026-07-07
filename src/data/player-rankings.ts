export const playerRankings = {
  "Charles Crawley": {
    source: "Prep Hoops",
    label: "PH rank: —",
    note: "Profile/rank not confirmed",
  },
  "Traeshon Fields": {
    source: "Prep Hoops",
    classYear: "2028",
    label: "PH 2028: locked",
    sourceUrl: "https://prephoops.com/player/trae-fields/",
  },
  "Halbert Jackson": {
    source: "Prep Hoops",
    label: "PH rank: —",
    note: "Profile/rank not confirmed",
  },
  "MarQwan Morgan": {
    source: "Prep Hoops",
    classYear: "2028",
    stateRank: 1,
    label: "PH 2028 #1",
    sourceUrl: "https://prephoops.com/iowa/rankings/2028-rankings/",
  },
  "Vasaun Wilmington": {
    source: "Prep Hoops",
    classYear: "2028",
    stateRank: 5,
    label: "PH 2028 #5",
    sourceUrl: "https://prephoops.com/iowa/rankings/2028-rankings/",
  },
  "Andrew Allen": {
    source: "Prep Hoops",
    classYear: "2028",
    label: "PH 2028: locked",
    sourceUrl: "https://prephoops.com/player/andrew-allen/",
  },
  "Chase Goodheart": {
    source: "Prep Hoops",
    classYear: "2028",
    label: "PH 2028: locked",
    sourceUrl: "https://prephoops.com/player/chase-goodheart/",
  },
  "Tate McCollum": {
    source: "Prep Hoops",
    classYear: "2027",
    label: "PH 2027: locked",
    sourceUrl: "https://prephoops.com/player/tate-mccollum/",
  },
  "Zane Rus": {
    source: "Prep Hoops",
    classYear: "2027",
    label: "PH 2027: locked",
    sourceUrl: "https://prephoops.com/player/zane-russ/",
  },
  "Brayden Tanny": {
    source: "Prep Hoops",
    classYear: "2027",
    label: "PH 2027: locked",
    sourceUrl: "https://prephoops.com/player/brayden-tanny/",
  },
  "Pernell Grover Jr.": {
    source: "Prep Hoops",
    classYear: "2029",
    label: "PH 2029: profile",
    sourceUrl: "https://prephoops.com/player/pernell-grover-jr/",
  },
  "Alexander Tanny": {
    source: "Prep Hoops",
    classYear: "2029",
    label: "PH 2029: profile",
    sourceUrl: "https://prephoops.com/player/alexander-tanny/",
  },
  "Ryland Gbor": {
    source: "Prep Hoops",
    label: "PH rank: —",
    note: "Profile/rank not confirmed",
  },
} as const;

export type PlayerRankingName = keyof typeof playerRankings;
