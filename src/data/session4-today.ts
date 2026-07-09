export type Session4Status = "Final" | "Live" | "Stats pending" | "Scheduled";

export type Session4Game = {
  id: number;
  date: string;
  time: string;
  iso: string;
  division: string;
  homeTeam: string;
  awayTeam: string;
  court: string;
  venue: string;
  streamUrl: string;
  status: Session4Status;
  relationGameId: string | null;
  awayScore: number | null;
  homeScore: number | null;
  sourceUrl: string | null;
  statsPosted: boolean;
  trackedLines: string[];
};

export type Session4PlayerLine = {
  player: string;
  team: string;
  opponent: string;
  result: "W" | "L" | "T" | null;
  teamScore: number | null;
  opponentScore: number | null;
  gameId: number;
  relationGameId: string | null;
  division: string;
  date: string;
  time: string;
  iso: string;
  court: string;
  status: Session4Status;
  sourceUrl: string;
  streamUrl: string;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  minutes: number | null;
  fg: string;
  threeFg: string;
  ft: string;
  fgPct: number | null;
  threePct: number | null;
  fantasy: number;
};

export type Session4Today = {
  source: string;
  event: string;
  location: string;
  date: string;
  generatedAt: string;
  games: Session4Game[];
  playerLines: Session4PlayerLine[];
  latestLineByPlayer: Partial<Record<string, Session4PlayerLine>>;
  highlights: Session4PlayerLine[];
};

export const session4Today: Session4Today = {
  "source": "Cerebro Sports public widget API",
  "event": "Nike EYBL Session IV",
  "location": "Las Vegas Convention Center",
  "date": "7/9/2026",
  "generatedAt": "2026-07-09T17:13:22.390Z",
  "games": [
    {
      "id": 38053937,
      "date": "7/9/2026",
      "time": "9:00 AM",
      "iso": "2026-07-09T09:00:00-07:00",
      "division": "EYCL 15'S",
      "homeTeam": "Kingdom Hoops",
      "awayTeam": "MOKAN SPURS",
      "court": "Court 14",
      "venue": "Las Vegas Convention Center",
      "streamUrl": "https://nikeeyb.com/session4day2",
      "status": "Live",
      "relationGameId": null,
      "awayScore": null,
      "homeScore": null,
      "sourceUrl": null,
      "statsPosted": false,
      "trackedLines": []
    },
    {
      "id": 38053935,
      "date": "7/9/2026",
      "time": "10:30 AM",
      "iso": "2026-07-09T10:30:00-07:00",
      "division": "EYCL 15'S",
      "homeTeam": "Soldiers Camo",
      "awayTeam": "All Iowa Attack",
      "court": "Court 14",
      "venue": "Las Vegas Convention Center",
      "streamUrl": "https://nikeeyb.com/session4day2",
      "status": "Scheduled",
      "relationGameId": null,
      "awayScore": null,
      "homeScore": null,
      "sourceUrl": null,
      "statsPosted": false,
      "trackedLines": []
    },
    {
      "id": 37884816,
      "date": "7/9/2026",
      "time": "12:00 PM",
      "iso": "2026-07-09T12:00:00-07:00",
      "division": "E15",
      "homeTeam": "Mac Irvin Fire",
      "awayTeam": "Indy Heat",
      "court": "Court 12",
      "venue": "Las Vegas Convention Center",
      "streamUrl": "https://nikeeyb.com/session4day2",
      "status": "Scheduled",
      "relationGameId": null,
      "awayScore": null,
      "homeScore": null,
      "sourceUrl": null,
      "statsPosted": false,
      "trackedLines": []
    },
    {
      "id": 37884818,
      "date": "7/9/2026",
      "time": "12:00 PM",
      "iso": "2026-07-09T12:00:00-07:00",
      "division": "E15",
      "homeTeam": "Team Herro",
      "awayTeam": "MOKAN Elite",
      "court": "Court 13",
      "venue": "Las Vegas Convention Center",
      "streamUrl": "https://nikeeyb.com/session4day2",
      "status": "Scheduled",
      "relationGameId": null,
      "awayScore": null,
      "homeScore": null,
      "sourceUrl": null,
      "statsPosted": false,
      "trackedLines": []
    },
    {
      "id": 39584978,
      "date": "7/9/2026",
      "time": "12:00 PM",
      "iso": "2026-07-09T12:00:00-07:00",
      "division": "EYCL 16'S",
      "homeTeam": "All Iowa Attack",
      "awayTeam": "Middleton Hoops",
      "court": "Court 14",
      "venue": "Las Vegas Convention Center",
      "streamUrl": "https://nikeeyb.com/session4day2",
      "status": "Scheduled",
      "relationGameId": null,
      "awayScore": null,
      "homeScore": null,
      "sourceUrl": null,
      "statsPosted": false,
      "trackedLines": []
    },
    {
      "id": 39584391,
      "date": "7/9/2026",
      "time": "12:00 PM",
      "iso": "2026-07-09T12:00:00-07:00",
      "division": "EYCL 17'S",
      "homeTeam": "TT Reform Sports",
      "awayTeam": "All Iowa Attack",
      "court": "Court 17",
      "venue": "Las Vegas Convention Center",
      "streamUrl": "https://nikeeyb.com/session4day2",
      "status": "Scheduled",
      "relationGameId": null,
      "awayScore": null,
      "homeScore": null,
      "sourceUrl": null,
      "statsPosted": false,
      "trackedLines": []
    },
    {
      "id": 37884318,
      "date": "7/9/2026",
      "time": "1:30 PM",
      "iso": "2026-07-09T13:30:00-07:00",
      "division": "EYBL",
      "homeTeam": "Team Takeover",
      "awayTeam": "MOKAN Elite",
      "court": "Court 5",
      "venue": "Las Vegas Convention Center",
      "streamUrl": "https://nikeeyb.com/session4day2",
      "status": "Scheduled",
      "relationGameId": null,
      "awayScore": null,
      "homeScore": null,
      "sourceUrl": null,
      "statsPosted": false,
      "trackedLines": []
    },
    {
      "id": 39584397,
      "date": "7/9/2026",
      "time": "1:30 PM",
      "iso": "2026-07-09T13:30:00-07:00",
      "division": "EYCL 17'S",
      "homeTeam": "MOKAN SPURS",
      "awayTeam": "Grassroots Elite",
      "court": "Court 18",
      "venue": "Las Vegas Convention Center",
      "streamUrl": "https://nikeeyb.com/session4day2",
      "status": "Scheduled",
      "relationGameId": null,
      "awayScore": null,
      "homeScore": null,
      "sourceUrl": null,
      "statsPosted": false,
      "trackedLines": []
    },
    {
      "id": 39584985,
      "date": "7/9/2026",
      "time": "3:00 PM",
      "iso": "2026-07-09T15:00:00-07:00",
      "division": "EYCL 16'S",
      "homeTeam": "Next Page Force",
      "awayTeam": "MOKAN SPURS",
      "court": "Court 11",
      "venue": "Las Vegas Convention Center",
      "streamUrl": "https://nikeeyb.com/session4day2",
      "status": "Scheduled",
      "relationGameId": null,
      "awayScore": null,
      "homeScore": null,
      "sourceUrl": null,
      "statsPosted": false,
      "trackedLines": []
    },
    {
      "id": 39584986,
      "date": "7/9/2026",
      "time": "3:00 PM",
      "iso": "2026-07-09T15:00:00-07:00",
      "division": "EYCL 16'S",
      "homeTeam": "Kingdom Hoops",
      "awayTeam": "Ohio Buckets",
      "court": "Court 12",
      "venue": "Las Vegas Convention Center",
      "streamUrl": "https://nikeeyb.com/session4day2",
      "status": "Scheduled",
      "relationGameId": null,
      "awayScore": null,
      "homeScore": null,
      "sourceUrl": null,
      "statsPosted": false,
      "trackedLines": []
    },
    {
      "id": 37884497,
      "date": "7/9/2026",
      "time": "4:30 PM",
      "iso": "2026-07-09T16:30:00-07:00",
      "division": "E16",
      "homeTeam": "MOKAN Elite",
      "awayTeam": "Team Herro",
      "court": "Court 3",
      "venue": "Las Vegas Convention Center",
      "streamUrl": "https://nikeeyb.com/session4day2",
      "status": "Scheduled",
      "relationGameId": null,
      "awayScore": null,
      "homeScore": null,
      "sourceUrl": null,
      "statsPosted": false,
      "trackedLines": []
    },
    {
      "id": 37884495,
      "date": "7/9/2026",
      "time": "4:30 PM",
      "iso": "2026-07-09T16:30:00-07:00",
      "division": "E16",
      "homeTeam": "Indy Heat",
      "awayTeam": "Mac Irvin Fire",
      "court": "Court 9",
      "venue": "Las Vegas Convention Center",
      "streamUrl": "https://nikeeyb.com/session4day2",
      "status": "Scheduled",
      "relationGameId": null,
      "awayScore": null,
      "homeScore": null,
      "sourceUrl": null,
      "statsPosted": false,
      "trackedLines": []
    },
    {
      "id": 38076524,
      "date": "7/9/2026",
      "time": "4:30 PM",
      "iso": "2026-07-09T16:30:00-07:00",
      "division": "EYCL 17'S",
      "homeTeam": "USC Unleashed",
      "awayTeam": "Kingdom Hoops",
      "court": "Court 17",
      "venue": "Las Vegas Convention Center",
      "streamUrl": "https://nikeeyb.com/session4day2",
      "status": "Scheduled",
      "relationGameId": null,
      "awayScore": null,
      "homeScore": null,
      "sourceUrl": null,
      "statsPosted": false,
      "trackedLines": []
    },
    {
      "id": 38053977,
      "date": "7/9/2026",
      "time": "6:00 PM",
      "iso": "2026-07-09T18:00:00-07:00",
      "division": "EYCL 15'S",
      "homeTeam": "Team Mookie Betts",
      "awayTeam": "All Iowa Attack",
      "court": "Court 11",
      "venue": "Las Vegas Convention Center",
      "streamUrl": "https://nikeeyb.com/session4day2",
      "status": "Scheduled",
      "relationGameId": null,
      "awayScore": null,
      "homeScore": null,
      "sourceUrl": null,
      "statsPosted": false,
      "trackedLines": []
    },
    {
      "id": 38053979,
      "date": "7/9/2026",
      "time": "6:00 PM",
      "iso": "2026-07-09T18:00:00-07:00",
      "division": "EYCL 15'S",
      "homeTeam": "LivOn - LA",
      "awayTeam": "MOKAN SPURS",
      "court": "Court 12",
      "venue": "Las Vegas Convention Center",
      "streamUrl": "https://nikeeyb.com/session4day2",
      "status": "Scheduled",
      "relationGameId": null,
      "awayScore": null,
      "homeScore": null,
      "sourceUrl": null,
      "statsPosted": false,
      "trackedLines": []
    },
    {
      "id": 38053982,
      "date": "7/9/2026",
      "time": "6:00 PM",
      "iso": "2026-07-09T18:00:00-07:00",
      "division": "EYCL 15'S",
      "homeTeam": "Kingdom Hoops",
      "awayTeam": "Team Ramey",
      "court": "Court 19",
      "venue": "Las Vegas Convention Center",
      "streamUrl": "https://nikeeyb.com/session4day2",
      "status": "Scheduled",
      "relationGameId": null,
      "awayScore": null,
      "homeScore": null,
      "sourceUrl": null,
      "statsPosted": false,
      "trackedLines": []
    },
    {
      "id": 37884823,
      "date": "7/9/2026",
      "time": "7:30 PM",
      "iso": "2026-07-09T19:30:00-07:00",
      "division": "E15",
      "homeTeam": "MOKAN Elite",
      "awayTeam": "Oakland Soldiers",
      "court": "Court 1",
      "venue": "Las Vegas Convention Center",
      "streamUrl": "https://nikeeyb.com/session4day2",
      "status": "Scheduled",
      "relationGameId": null,
      "awayScore": null,
      "homeScore": null,
      "sourceUrl": null,
      "statsPosted": false,
      "trackedLines": []
    },
    {
      "id": 37884820,
      "date": "7/9/2026",
      "time": "7:30 PM",
      "iso": "2026-07-09T19:30:00-07:00",
      "division": "E15",
      "homeTeam": "Howard Pulley",
      "awayTeam": "Mac Irvin Fire",
      "court": "Court 5",
      "venue": "Las Vegas Convention Center",
      "streamUrl": "https://nikeeyb.com/session4day2",
      "status": "Scheduled",
      "relationGameId": null,
      "awayScore": null,
      "homeScore": null,
      "sourceUrl": null,
      "statsPosted": false,
      "trackedLines": []
    }
  ],
  "playerLines": [],
  "latestLineByPlayer": {},
  "highlights": []
};

export const session4PlayerLines = session4Today.latestLineByPlayer as Partial<Record<string, Session4PlayerLine>>;
export const session4Highlights = session4Today.highlights as Session4PlayerLine[];
