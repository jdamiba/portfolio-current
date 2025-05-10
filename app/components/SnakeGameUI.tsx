import React from "react";

interface TournamentState {
  bracket: number[][][];
  currentRound: number;
  currentMatch: number;
  matchResults: Record<
    string,
    { scores: [number, number]; lengths: [number, number] }
  >;
  runIndex: number;
  runScores: (number | null)[];
  runLengths: (number | null)[];
  isMatchComplete: boolean;
  isTournamentComplete: boolean;
  winnerSeed: number | null;
  loserSeed: number | null;
  advancingSeeds: number[];
  eliminatedSeeds: number[];
  scoreToBeat: number | null;
  lengthToBeat: number | null;
}

const COMPETITORS = [
  { name: "Alice", color: "#f00", seed: 1 },
  { name: "Bob", color: "#0f0", seed: 2 },
  { name: "Carol", color: "#00f", seed: 3 },
  { name: "Dave", color: "#ff0", seed: 4 },
  { name: "Eve", color: "#0ff", seed: 5 },
  { name: "Frank", color: "#f0f", seed: 6 },
  { name: "Grace", color: "#fa0", seed: 7 },
  { name: "Heidi", color: "#0af", seed: 8 },
];

function getCompetitorBySeed(seed: number) {
  return COMPETITORS.find((c) => c.seed === seed) || COMPETITORS[0];
}

// Bracket UI
export function renderBracket(tournament: TournamentState) {
  return (
    <div className="mb-4 p-2 bg-gray-800 rounded text-white">
      <div className="font-bold mb-2">Tournament Bracket</div>
      {tournament.bracket.map((round, rIdx) => (
        <div key={rIdx} className="mb-2">
          <div className="font-semibold">Round {rIdx + 1}</div>
          {round.map((match, mIdx) => (
            <div key={mIdx} className="ml-4">
              {match.map((seed, i) => {
                const c = getCompetitorBySeed(seed);
                return (
                  <span key={seed} style={{ color: c.color }}>
                    {c.name} (Seed {c.seed}){i === 0 ? " vs " : ""}
                  </span>
                );
              })}
              {tournament.matchResults &&
                tournament.matchResults[`${rIdx}-${mIdx}`] && (
                  <span className="ml-2">
                    Result:{" "}
                    {JSON.stringify(tournament.matchResults[`${rIdx}-${mIdx}`])}
                  </span>
                )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// Current Run UI
export function renderCurrentRun(
  snakeProps: { name: string; color: string; seed: number } | null,
  tournament: TournamentState,
  runScore: number
) {
  if (!snakeProps) return null;
  const match =
    tournament.bracket[tournament.currentRound][tournament.currentMatch];
  const opponentSeed = match[1 - tournament.runIndex];
  const opponent = getCompetitorBySeed(opponentSeed);
  return (
    <div className="mb-4 p-2 bg-gray-700 rounded text-white">
      <div className="font-bold mb-2">Current Match</div>
      <div>
        <span style={{ color: snakeProps.color, fontWeight: "bold" }}>
          {snakeProps.name}
        </span>
        {` (Seed ${snakeProps.seed})`}
        <span className="ml-4">vs</span>
        <span
          style={{ color: opponent.color, fontWeight: "bold" }}
          className="ml-4"
        >
          {opponent.name}
        </span>
        {` (Seed ${opponent.seed})`}
      </div>
      <div className="mt-2">
        Apples Eaten: <span className="font-mono text-lg">{runScore}</span>
      </div>
      {/* Show score to beat for second player */}
      {tournament.runIndex === 1 && tournament.scoreToBeat !== null && (
        <div className="mt-2 text-yellow-300 font-semibold">
          Score to Beat: {tournament.scoreToBeat} (Length:{" "}
          {tournament.lengthToBeat})
        </div>
      )}
      {tournament.isMatchComplete && (
        <div className="mt-2 font-bold text-green-400">
          {tournament.winnerSeed === snakeProps.seed ? "WINNER" : ""}
        </div>
      )}
    </div>
  );
}

// Next Button UI
export function renderNextButton(tournament: TournamentState) {
  if (tournament.isTournamentComplete) {
    const champ = getCompetitorBySeed(tournament.winnerSeed || 1);
    return (
      <div className="text-2xl text-yellow-400 font-bold">
        Champion: {champ.name} (Seed {champ.seed})
      </div>
    );
  }
  return null;
}
