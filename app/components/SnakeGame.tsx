"use client";

import React, { useEffect, useState } from "react";
import { aggressivePathfinding } from "./SnakeGame/logic/snakeLogic";
import { useSnakeGame } from "./SnakeGame/logic/useSnakeGame";
import { useSnakeGameState } from "./SnakeGame/logic/useSnakeGameState";
import { SnakeBoard } from "./SnakeGame/components/SnakeBoard";

import {
  getOccupiedCells,
  SNAKE_PERSONALITIES,
  APPLE_SHAPE_POINTS,
} from "./SnakeGame/logic/tournamentUtils";
import { getHighContrastColor } from "./SnakeGame/logic/colorUtils";

// Types
type Player = {
  name: string;
  color: string;
  seed: number;
  playstyle: keyof typeof SNAKE_PERSONALITIES;
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
}

function getShapePreferences(shape: string | undefined, players: Player[]) {
  if (!shape) return [];
  return players
    .filter((p: Player) => p.preferredShape === shape)
    .map((p: Player) => p.name);
}

export function SnakeGame() {
  const {
    gridSize,
    cellSize,
    autoplay,
    setAutoplay,
    spawnMode,
    setSpawnMode,
    showCountdown,
    setShowCountdown,
    countdown,
    setCountdown,
    intervalRef,
    lastTouchRef,
    snakesRef,
  } = useSnakeGame();

  const { gameState, setGameState, hasMounted, handleReset } =
    useSnakeGameState({
      gridSize,
      cellSize,
      autoplay,
      spawnMode,
      setSpawnMode,
      setAutoplay,
      intervalRef,
      lastTouchRef,
      snakesRef,
      showCountdown,
      setShowCountdown,
      countdown,
      setCountdown,
    });

  const [speed, setSpeed] = useState(50); // default 100ms per tick
  const [isPlaying, setIsPlaying] = useState(true);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showCountdownOverlay, setShowCountdownOverlay] = useState(false);
  const [countdownValue, setCountdownValue] = useState(3);
  const [runInProgress, setRunInProgress] = useState(false);
  const [runScore, setRunScore] = useState(0);

  const [tournamentStarted, setTournamentStarted] = useState(false);
  const [showRunModal, setShowRunModal] = useState(false);

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
    // Simple 1st vs 2nd, 3rd vs 4th, etc.
    const matches: Match[] = [];
    for (let i = 0; i < players.length; i += 2) {
      matches.push([players[i], players[i + 1]]);
    }
    return matches;
  }

  const initialTournament: TournamentState = {
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
  };

  const [tournament, setTournament] =
    useState<TournamentState>(initialTournament);

  // --- Global Clock and Game Loop ---
  useEffect(() => {
    if (!isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [isPlaying, intervalRef]);

  // Countdown effect
  useEffect(() => {
    if (!showCountdown) return;
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c > 1) return c - 1;
        clearInterval(timer);
        setTimeout(() => setShowCountdown(false), 700);
        return 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [setCountdown, setShowCountdown, showCountdown]);

  useEffect(() => {
    snakesRef.current = gameState.snakes;
  }, [snakesRef, gameState.snakes]);

  // Play/pause effect
  useEffect(() => {
    if (!isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
    } else if (isPlaying && !intervalRef.current) {
      // Restart game loop
      // (re-run the main game loop effect by updating a dummy state if needed)
    }
  }, [isPlaying, intervalRef]);

  // --- Main Game Loop: Move snakes, eat apples, respawn apples/snakes ---
  useEffect(() => {
    if (!isPlaying || !runInProgress) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    const interval = setInterval(() => {
      setGameState((prev) => {
        // Only one snake at a time
        const snake = prev.snakes[0];
        if (!snake || !snake.alive) return { ...prev };
        const head = snake.body[0] as [number, number];
        // Use the current player's playstyle for the personality function
        const match = tournament.bracket[tournament.currentMatch];
        const player = match[tournament.currentRun];
        const personalityFn =
          SNAKE_PERSONALITIES[player.playstyle] || aggressivePathfinding;
        const applesXY = prev.apples.map(
          ([x, y]) => [x, y] as [number, number]
        );
        const nextDir = personalityFn(
          snake.body,
          applesXY,
          snake.dir,
          [snake.body],
          gridSize
        );
        const [dx, dy] = nextDir;
        const [x, y] = [head[0] + dx, head[1] + dy];
        // Check for wall collision
        if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
          return {
            ...prev,
            snakes: [{ ...snake, alive: false }],
          };
        }
        // Check for self-collision
        const bodyCollision = snake.body.some(
          ([sx, sy], i) => i !== 0 && sx === x && sy === y
        );
        if (bodyCollision) {
          return {
            ...prev,
            snakes: [{ ...snake, alive: false }],
          };
        }
        // Apple eating
        let pointsGained = 0;
        const eatenAppleIdx = prev.apples.findIndex(
          ([ax, ay]) => ax === x && ay === y
        );
        let newGrowth = snake.growth || 0;
        let newApples = prev.apples;
        let newScore = snake.score || 0;
        if (eatenAppleIdx !== -1) {
          const eatenApple = prev.apples[eatenAppleIdx];
          const shape = eatenApple[4] || "circle";
          pointsGained = getApplePoints(shape);
          newScore += pointsGained;
          newGrowth += 1;
          newApples = prev.apples.filter((_, idx) => idx !== eatenAppleIdx);
        }
        let newBody: [number, number][];
        if (newGrowth > 0) {
          newBody = [[x, y], ...snake.body];
          newGrowth--;
        } else {
          newBody = [[x, y], ...snake.body].slice(0, -1) as [number, number][];
        }
        // Always maintain the initial apple count (e.g., 95)
        const APPLE_COUNT = 95;
        const applesToAdd = APPLE_COUNT - newApples.length;
        if (applesToAdd > 0) {
          const occupied = getOccupiedCells([{ body: newBody }]);
          for (let i = 0; i < applesToAdd; i++) {
            const colors = [
              "#FF4136",
              "#0074D9",
              "#2ECC40",
              "#B10DC9",
              "#FF851B",
              "#3D9970",
              "#F012BE",
              "#FFDC00",
            ];
            const shapes = [
              "circle",
              "x",
              "triangle",
              "pentagon",
              "hexagon",
              "square",
              "heptagon",
              "octagon",
            ];
            const randColor = colors[Math.floor(Math.random() * colors.length)];
            const randShape = shapes[Math.floor(Math.random() * shapes.length)];
            let tries = 0;
            while (tries < 1000) {
              const ax = Math.floor(Math.random() * gridSize);
              const ay = Math.floor(Math.random() * gridSize);
              if (
                ax >= 0 &&
                ax < gridSize &&
                ay >= 0 &&
                ay < gridSize &&
                !occupied.has(`${ax},${ay}`) &&
                !newApples.some(([ex, ey]) => ex === ax && ey === ay)
              ) {
                newApples.push([ax, ay, randColor, "", randShape]);
                break;
              }
              tries++;
            }
          }
        }
        // Longest snake logic
        const maxLength = newBody.length;
        let allTimeLongest = prev.allTimeLongest;
        if (maxLength > allTimeLongest) {
          allTimeLongest = maxLength;
          try {
            localStorage.setItem("longestSnakeLength", String(maxLength));
          } catch (e) {
            console.error(e);
          }
        }
        const bodyColor = player.color;
        const headColor = getHighContrastColor([bodyColor], 120);
        return {
          ...prev,
          snakes: [
            {
              ...snake,
              body: newBody,
              dir: nextDir,
              growth: newGrowth,
              score: newScore,
              bodyColor,
              headColor,
            },
          ],
          apples: newApples,
          longestSnakeLength: maxLength,
          allTimeLongest,
        };
      });
    }, speed); // use speed here
    intervalRef.current = interval;
    return () => clearInterval(interval);
  }, [
    isPlaying,
    runInProgress,
    setGameState,
    intervalRef,
    gridSize,
    speed,
    tournament.bracket,
    tournament.currentMatch,
    tournament.currentRun,
  ]);

  // Calculate free spaces remaining
  const occupiedCells = new Set([
    ...gameState.snakes.flatMap((s) => s.body.map(([x, y]) => `${x},${y}`)),
    ...gameState.apples.map(([x, y]) => `${x},${y}`),
  ]);
  const totalCells = gridSize * gridSize;
  const freeSpaces = totalCells - occupiedCells.size;

  // --- Tournament Logic ---
  // 1. On mount or after each match, set up the next run
  useEffect(() => {
    if (!tournamentStarted || tournament.isTournamentComplete) return;
    // Set up the snake for the current run
    const match = tournament.bracket[tournament.currentMatch];
    const player = match[tournament.currentRun];
    setRunScore(0);
    setGameState((prev) => {
      const body = Array.from(
        { length: 5 },
        (_, j) =>
          [Math.floor(gridSize / 2) - j, Math.floor(gridSize / 2)] as [
            number,
            number
          ]
      );
      const bodyColor = player.color;
      const headColor = getHighContrastColor([bodyColor], 120);
      return {
        ...prev,
        snakes: [
          {
            body,
            dir: [1, 0],
            alive: true,
            bodyColor,
            headColor,
            justSpawned: true,
            name: player.name,
            seed: player.seed,
          },
        ],
        longestSnakeLength: 5,
      };
    });
    setShowCountdownOverlay(true);
    setCountdownValue(3);
    setRunInProgress(false);
  }, [
    tournament.currentMatch,
    tournament.currentRun,
    gridSize,
    tournamentStarted,
    setGameState,
    tournament.bracket,
    tournament.isTournamentComplete,
  ]);

  // Countdown overlay effect
  useEffect(() => {
    if (!showCountdownOverlay) return;
    if (countdownValue === 0) {
      setShowCountdownOverlay(false);
      setRunInProgress(true); // Start the run after countdown
      return;
    }
    const timer = setTimeout(() => {
      setCountdownValue((c) => c - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [showCountdownOverlay, countdownValue]);

  // --- Snake death and run-over detection ---
  useEffect(() => {
    if (!runInProgress) return;
    const alive = gameState.snakes[0]?.alive ?? false;
    if (!alive) {
      setRunInProgress(false);
      const score = gameState.snakes[0]?.score || 0;
      setTournament((prev) => {
        const newScores = [...prev.scores] as [number | null, number | null];
        newScores[prev.currentRun] = score;
        return { ...prev, scores: newScores };
      });
      if (tournament.currentRun === 0) {
        setShowRunModal(true); // Show "Next Player"
      } else {
        setShowMatchModal(true); // Show "Match Result"
      }
    }
  }, [gameState.snakes, runInProgress, tournament.currentRun]);

  function handleNextPlayer() {
    setTournament((prev) => ({ ...prev, currentRun: 1 }));
    setShowRunModal(false);
    setShowCountdownOverlay(true);
    setCountdownValue(3);
  }

  function handleNextMatch() {
    // Determine winner and loser
    const [scoreA, scoreB] = tournament.scores;
    const match = tournament.bracket[tournament.currentMatch];
    const winner = scoreA! >= scoreB! ? match[0] : match[1];
    const loser = scoreA! < scoreB! ? match[0] : match[1];
    setTournament((prev) => {
      let nextMatch = prev.currentMatch + 1;
      let newBracket = prev.bracket;
      let newRound = prev.round;
      let isComplete = false;
      let newWinners = [...prev.winners, winner];
      let newLosers = [...prev.losers, loser];
      let grandFinal: Match | null = prev.grandFinal;
      let isGrandFinal = prev.isGrandFinal;

      // If first round complete, schedule losers bracket
      if (nextMatch === prev.bracket.length && prev.round === 1) {
        // Pair up losers for the losers bracket
        const losersBracket: Match[] = [];
        for (let i = 0; i < newLosers.length; i += 2) {
          losersBracket.push([newLosers[i], newLosers[i + 1]]);
        }
        newBracket = losersBracket;
        newRound = 2;
        nextMatch = 0;
        // If no losers bracket (shouldn't happen with 8 players), end tournament
        if (losersBracket.length === 0) isComplete = true;
      } else if (nextMatch === prev.bracket.length && prev.round === 2) {
        // Schedule grand final
        const winnersChampion = prev.winners[prev.winners.length - 1];
        const losersChampion = prev.losers[prev.losers.length - 1];
        grandFinal = [winnersChampion, losersChampion];
        newBracket = [grandFinal];
        newRound = 3;
        nextMatch = 0;
        isGrandFinal = true;
      } else if (nextMatch === prev.bracket.length && prev.round === 3) {
        isComplete = true;
      }

      return {
        ...prev,
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
      };
    });
    setShowMatchModal(false);
    if (!tournament.isTournamentComplete) {
      setShowCountdownOverlay(true);
      setCountdownValue(3);
    }
  }

  // --- UI for overlays ---
  const renderCountdownOverlay = () =>
    showCountdownOverlay ? (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
        <div className="bg-white p-8 rounded shadow-lg text-black text-5xl font-bold">
          {countdownValue > 0 ? countdownValue : "Go!"}
        </div>
      </div>
    ) : null;

  const renderStartTournament = () =>
    !tournamentStarted ? (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
        <div className="bg-white p-8 rounded shadow-lg text-black text-3xl font-bold flex flex-col items-center">
          <div className="mb-4">Snake AI Tournament</div>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded text-xl font-semibold shadow hover:bg-blue-700"
            onClick={() => setTournamentStarted(true)}
          >
            Start Tournament
          </button>
        </div>
      </div>
    ) : null;

  const renderTournamentModal = () => {
    if (showRunModal) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-6 rounded shadow-lg text-black">
            <h2 className="text-xl font-bold mb-2">First Run Complete</h2>
            <div>Score: {tournament.scores[0]}</div>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={handleNextPlayer}
            >
              Next Player
            </button>
          </div>
        </div>
      );
    }
    if (showMatchModal) {
      const [scoreA, scoreB] = tournament.scores;
      const match = tournament.bracket[tournament.currentMatch];
      if (!match) return null;
      const winner = scoreA! >= scoreB! ? match[0] : match[1];
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-6 rounded shadow-lg text-black">
            <h2 className="text-xl font-bold mb-2">Match Result</h2>
            <div>
              Score A: {scoreA} | Score B: {scoreB}
            </div>
            <div className="mt-2 font-bold text-green-400">
              Winner: {winner.name}
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={handleNextMatch}
            >
              Next Match
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  // 4. UI for tournament
  function renderBracket() {
    return (
      <div className="mb-4 p-2 bg-gray-800 rounded text-white">
        <div className="font-bold mb-2">
          {tournament.isGrandFinal
            ? "Grand Final"
            : tournament.round === 1
            ? "Tournament Bracket (Winners Bracket)"
            : tournament.round === 2
            ? "Tournament Bracket (Losers Bracket)"
            : "Tournament Bracket"}
        </div>
        {tournament.bracket.map((match, mIdx) => (
          <div key={mIdx} className="ml-4">
            {match.map((player, i) => (
              <span key={player.seed} style={{ color: player.color }}>
                {player.name} (Seed {player.seed}){i === 0 ? " vs " : ""}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // 5. UI for current run and match
  function renderCurrentRun() {
    if (!tournamentStarted || tournament.isTournamentComplete) return null;
    const match = tournament.bracket[tournament.currentMatch];
    if (!match) return null;
    const [playerA, playerB] = match;
    const currentPlayer = match[tournament.currentRun];
    return (
      <div className="mb-4 p-2 bg-gray-700 rounded text-white">
        <div className="font-bold mb-2">
          Match {tournament.currentMatch + 1} of {tournament.bracket.length}
        </div>
        <div className="flex items-center gap-4">
          <span
            style={{
              color: playerA.color,
              fontWeight: tournament.currentRun === 0 ? "bold" : "normal",
              border: `3px solid ${playerA.color}`,
              borderRadius: 8,
              padding: "4px 12px",
              background:
                tournament.currentRun === 0
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(255,255,255,0.04)",
              boxShadow:
                tournament.currentRun === 0
                  ? `0 0 8px 2px ${playerA.color}55`
                  : undefined,
              display: "inline-flex",
              alignItems: "center",
              opacity: tournament.currentRun === 0 ? 1 : 0.6,
            }}
          >
            {playerA.name} (Seed {playerA.seed})
            {tournament.currentRun === 0 && (
              <span
                style={{
                  background: playerA.color,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 12,
                  borderRadius: 6,
                  padding: "2px 8px",
                  marginLeft: 10,
                  marginRight: -6,
                  boxShadow: `0 1px 4px ${playerA.color}55`,
                  letterSpacing: 1,
                }}
              >
                Now Competing
              </span>
            )}
          </span>
          <span className="ml-4">vs</span>
          <span
            style={{
              color: playerB.color,
              fontWeight: tournament.currentRun === 1 ? "bold" : "normal",
              border: `3px solid ${playerB.color}`,
              borderRadius: 8,
              padding: "4px 12px",
              background:
                tournament.currentRun === 1
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(255,255,255,0.04)",
              boxShadow:
                tournament.currentRun === 1
                  ? `0 0 8px 2px ${playerB.color}55`
                  : undefined,
              display: "inline-flex",
              alignItems: "center",
              opacity: tournament.currentRun === 1 ? 1 : 0.6,
            }}
          >
            {playerB.name} (Seed {playerB.seed})
            {tournament.currentRun === 1 && (
              <span
                style={{
                  background: playerB.color,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 12,
                  borderRadius: 6,
                  padding: "2px 8px",
                  marginLeft: 10,
                  marginRight: -6,
                  boxShadow: `0 1px 4px ${playerB.color}55`,
                  letterSpacing: 1,
                }}
              >
                Now Competing
              </span>
            )}
          </span>
        </div>
        <div className="mt-2">
          Score: <span className="font-mono text-lg">{runScore}</span>
        </div>
        <div className="mt-2 text-sm text-blue-200">
          Playstyle: {currentPlayer.playstyle} <br />
          Preferred Shape: {currentPlayer.preferredShape}
        </div>
        {tournament.currentRun === 1 && tournament.scores[0] !== null && (
          <div className="mt-2 text-yellow-300 font-semibold">
            Score to Beat: {tournament.scores[0]}
          </div>
        )}
      </div>
    );
  }

  // 6. UI for navigation
  function renderNextButton() {
    if (tournament.isTournamentComplete) {
      const champ = tournament.winners[tournament.winners.length - 1];
      return (
        <div className="text-2xl text-yellow-400 font-bold">
          Champion: {champ.name} (Seed {champ.seed})
        </div>
      );
    }
    return null;
  }

  // 7. UI for apple shape legend
  function renderAppleShapeLegend() {
    const shapes = Object.keys(APPLE_SHAPE_POINTS);
    return (
      <div className="mb-4 p-2 bg-gray-800 rounded text-white">
        <div className="font-bold mb-2">Apple Shapes & Points</div>
        <div className="flex flex-wrap gap-4">
          {shapes.map((shape) => (
            <div
              key={shape}
              className="flex flex-col items-center bg-gray-900 rounded p-2 min-w-[90px]"
            >
              <div className="font-mono text-lg">{shape}</div>
              <div className="text-yellow-300 font-bold">
                {APPLE_SHAPE_POINTS[shape]} pts
              </div>
              <div className="text-xs text-blue-200 mt-1">
                Preferred by:{" "}
                {getShapePreferences(shape, initialPlayers).join(", ") ||
                  "None"}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Live update apples eaten and length during the run
  useEffect(() => {
    const snake = gameState.snakes[0];
    if (snake && runInProgress) {
      setRunScore(snake.score || 0);
    }
  }, [gameState.snakes, runInProgress]);

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-2 md:p-6">
      {renderStartTournament()}
      {tournamentStarted && renderBracket()}
      {tournamentStarted && renderAppleShapeLegend()}
      {tournamentStarted && renderCurrentRun()}
      <div className="relative w-full">
        {tournamentStarted && (
          <SnakeBoard
            snakes={gameState.snakes}
            apples={gameState.apples}
            cellSize={cellSize}
            gridSize={gridSize}
          />
        )}
        {renderCountdownOverlay()}
        {renderTournamentModal()}
      </div>
      {tournamentStarted && renderNextButton()}

      <style jsx global>{`
        @keyframes fade-scale {
          0% {
            opacity: 0;
            transform: scale(0.7);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-scale {
          animation: fade-scale 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .snake-fade-out {
          opacity: 0 !important;
          transition: opacity 0.7s;
        }
      `}</style>
    </div>
  );
}

// Helper: get apple shape points
function getApplePoints(shape: string) {
  return APPLE_SHAPE_POINTS[shape] || 1;
}
