export type RecentGameStat = {
  source: "GameDay Preps";
  sourceUrl: string;
  eventId: number;
  date: string;
  status: "Final" | "Live" | "Scheduled";
  team: string;
  opponent: string;
  result: "W" | "L" | "T";
  teamScore: number;
  opponentScore: number;
  jersey: string;
  player: string;
  rawName: string;
  points: number;
  fg: string;
  threeFg: string;
  ft: string;
  offensiveRebounds: number;
  defensiveRebounds: number;
  rebounds: number;
  assists: number;
  fouls: number;
  turnovers: number;
  blocks: number;
  steals: number;
  minutes: number;
  plusMinus: number;
};

export const recentGameStats = {
  "Charles Crawley": {
    source: "GameDay Preps",
    sourceUrl: "https://live.gamedaypreps.com/15317",
    eventId: 15317,
    date: "2026-07-08",
    status: "Final",
    team: "Kingdom Hoops",
    opponent: "MOKAN SPURS",
    result: "L",
    teamScore: 51,
    opponentScore: 58,
    jersey: "23",
    player: "Charles Crawley",
    rawName: "CRAWLEY, CHARLES",
    points: 3,
    fg: "1-1",
    threeFg: "1-1",
    ft: "0-0",
    offensiveRebounds: 1,
    defensiveRebounds: 2,
    rebounds: 3,
    assists: 1,
    fouls: 1,
    turnovers: 1,
    blocks: 0,
    steals: 0,
    minutes: 8,
    plusMinus: -6,
  },
  "Traeshon Fields": {
    source: "GameDay Preps",
    sourceUrl: "https://live.gamedaypreps.com/15321",
    eventId: 15321,
    date: "2026-07-08",
    status: "Final",
    team: "All Iowa Attack",
    opponent: "Genesis Canada",
    result: "W",
    teamScore: 72,
    opponentScore: 53,
    jersey: "2",
    player: "Traeshon Fields",
    rawName: "FIELDS, TRAESHON",
    points: 17,
    fg: "7-12",
    threeFg: "3-7",
    ft: "0-2",
    offensiveRebounds: 0,
    defensiveRebounds: 2,
    rebounds: 2,
    assists: 7,
    fouls: 0,
    turnovers: 4,
    blocks: 1,
    steals: 3,
    minutes: 24,
    plusMinus: 13,
  },
  "Halbert Jackson": {
    source: "GameDay Preps",
    sourceUrl: "https://live.gamedaypreps.com/15321",
    eventId: 15321,
    date: "2026-07-08",
    status: "Final",
    team: "All Iowa Attack",
    opponent: "Genesis Canada",
    result: "W",
    teamScore: 72,
    opponentScore: 53,
    jersey: "30",
    player: "Halbert Jackson",
    rawName: "JACKSON, HALBERT",
    points: 10,
    fg: "5-10",
    threeFg: "0-1",
    ft: "0-0",
    offensiveRebounds: 2,
    defensiveRebounds: 3,
    rebounds: 5,
    assists: 1,
    fouls: 0,
    turnovers: 1,
    blocks: 1,
    steals: 1,
    minutes: 22,
    plusMinus: 9,
  },
  "Andrew Allen": {
    source: "GameDay Preps",
    sourceUrl: "https://live.gamedaypreps.com/15321",
    eventId: 15321,
    date: "2026-07-08",
    status: "Final",
    team: "All Iowa Attack",
    opponent: "Genesis Canada",
    result: "W",
    teamScore: 72,
    opponentScore: 53,
    jersey: "1",
    player: "Andrew Allen",
    rawName: "ALLEN, ANDREW",
    points: 2,
    fg: "1-5",
    threeFg: "0-3",
    ft: "0-0",
    offensiveRebounds: 1,
    defensiveRebounds: 2,
    rebounds: 3,
    assists: 3,
    fouls: 2,
    turnovers: 1,
    blocks: 0,
    steals: 2,
    minutes: 22,
    plusMinus: 14,
  },
  "Chase Goodheart": {
    source: "GameDay Preps",
    sourceUrl: "https://live.gamedaypreps.com/15321",
    eventId: 15321,
    date: "2026-07-08",
    status: "Final",
    team: "All Iowa Attack",
    opponent: "Genesis Canada",
    result: "W",
    teamScore: 72,
    opponentScore: 53,
    jersey: "13",
    player: "Chase Goodheart",
    rawName: "GOODHEART, CHASE",
    points: 14,
    fg: "6-11",
    threeFg: "0-5",
    ft: "2-2",
    offensiveRebounds: 2,
    defensiveRebounds: 3,
    rebounds: 5,
    assists: 0,
    fouls: 0,
    turnovers: 2,
    blocks: 0,
    steals: 2,
    minutes: 27,
    plusMinus: 20,
  },
} as const satisfies Record<string, RecentGameStat>;
