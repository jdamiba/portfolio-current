import { NextRequest, NextResponse } from "next/server";

// Types (copy from client)
type Player = {
  name: string;
  color: string;
  seed: number;
  playstyle: string;
  preferredShape: string;
};
type Match = [Player, Player];

interface TournamentState {
  players: Player[];
  bracket: Match[];
  currentMatch: number;
  currentRun: 0 | 1;
  scores: [number | null, number | null];
  winners: Player[];
  losers: Player[];
  isTournamentComplete: boolean;
  round: number; // 1 = winners, 2 = losers, 3 = grand final
  grandFinal: Match | null;
  isGrandFinal: boolean;
  matchHistory: {
    round: number;
    matchIndex: number;
    a: Player;
    b: Player;
    scoreA: number;
    scoreB: number;
    winner: Player;
  }[];
}

// In-memory tournament state
let tournament: TournamentState | null = null;

const initialPlayers: Player[] = [
  {
    name: "Alice",
    color: "#f00",
    seed: 1,
    playstyle: "aggressivePathfinding",
    preferredShape: "circle",
  },
  {
    name: "Bob",
    color: "#0f0",
    seed: 2,
    playstyle: "cautiousPathfinding",
    preferredShape: "triangle",
  },
  {
    name: "Carol",
    color: "#00f",
    seed: 3,
    playstyle: "randomPathfinding",
    preferredShape: "square",
  },
  {
    name: "Dave",
    color: "#ff0",
    seed: 4,
    playstyle: "greedyPathfinding",
    preferredShape: "pentagon",
  },
  {
    name: "Eve",
    color: "#0ff",
    seed: 5,
    playstyle: "wallHuggerPathfinding",
    preferredShape: "hexagon",
  },
  {
    name: "Frank",
    color: "#f0f",
    seed: 6,
    playstyle: "centerSeekerPathfinding",
    preferredShape: "heptagon",
  },
  {
    name: "Grace",
    color: "#fa0",
    seed: 7,
    playstyle: "cornerCamperPathfinding",
    preferredShape: "octagon",
  },
  {
    name: "Heidi",
    color: "#0af",
    seed: 8,
    playstyle: "zigzagPathfinding",
    preferredShape: "x",
  },
];

function makeBracket(players: Player[]): Match[] {
  const matches: Match[] = [];
  for (let i = 0; i < players.length; i += 2) {
    matches.push([players[i], players[i + 1]]);
  }
  return matches;
}

function getInitialTournament(): TournamentState {
  return {
    players: initialPlayers,
    bracket: makeBracket(initialPlayers),
    currentMatch: 0,
    currentRun: 0,
    scores: [null, null],
    winners: [],
    losers: [],
    isTournamentComplete: false,
    round: 1,
    grandFinal: null,
    isGrandFinal: false,
    matchHistory: [],
  };
}

export async function GET() {
  if (!tournament) tournament = getInitialTournament();
  return NextResponse.json(tournament);
}

export async function POST(req: NextRequest) {
  const { action, score } = await req.json();
  if (action === "start") {
    tournament = getInitialTournament();
    return NextResponse.json(tournament);
  }
  if (action === "advance") {
    if (!tournament)
      return NextResponse.json({ error: "No tournament" }, { status: 400 });
    if (typeof score !== "number")
      return NextResponse.json({ error: "Score required" }, { status: 400 });
    if (tournament.currentRun === 0) {
      // Advance to next player
      tournament.scores[0] = score;
      tournament.currentRun = 1;
      return NextResponse.json(tournament);
    } else {
      // Advance to next match
      tournament.scores[1] = score;
      const [scoreA, scoreB] = tournament.scores;
      const match = tournament.bracket[tournament.currentMatch];
      const winner = scoreA! >= scoreB! ? match[0] : match[1];
      const loser = scoreA! < scoreB! ? match[0] : match[1];
      // Add to matchHistory
      tournament.matchHistory.push({
        round: tournament.round,
        matchIndex: tournament.currentMatch,
        a: match[0],
        b: match[1],
        scoreA: scoreA ?? 0,
        scoreB: scoreB ?? 0,
        winner,
      });
      let nextMatch = tournament.currentMatch + 1;
      let newBracket = tournament.bracket;
      let newRound = tournament.round;
      let isComplete = false;
      const newWinners = [...tournament.winners, winner];
      const newLosers = [...tournament.losers, loser];
      let grandFinal: Match | null = tournament.grandFinal;
      let isGrandFinal = tournament.isGrandFinal;
      // If first round complete, schedule losers bracket
      if (nextMatch === tournament.bracket.length && tournament.round === 1) {
        // Pair up losers for the losers bracket
        const losersBracket: Match[] = [];
        for (let i = 0; i < newLosers.length; i += 2) {
          losersBracket.push([newLosers[i], newLosers[i + 1]]);
        }
        newBracket = losersBracket;
        newRound = 2;
        nextMatch = 0;
        if (losersBracket.length === 0) isComplete = true;
      } else if (
        nextMatch === tournament.bracket.length &&
        tournament.round === 2
      ) {
        // Schedule grand final
        const winnersChampion = newWinners[newWinners.length - 1];
        const losersChampion = newLosers[newLosers.length - 1];
        grandFinal = [winnersChampion, losersChampion];
        newBracket = [grandFinal];
        newRound = 3;
        nextMatch = 0;
        isGrandFinal = true;
      } else if (
        nextMatch === tournament.bracket.length &&
        tournament.round === 3
      ) {
        isComplete = true;
      }
      tournament = {
        ...tournament,
        winners: newWinners,
        losers: newLosers,
        bracket: newBracket,
        currentMatch: nextMatch,
        currentRun: 0,
        scores: [null, null],
        isTournamentComplete: isComplete,
        round: newRound,
        grandFinal,
        isGrandFinal,
        matchHistory: tournament.matchHistory,
      };
      return NextResponse.json(tournament);
    }
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
