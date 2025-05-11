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
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
  matchHistory: {
    a: Player;
    b: Player;
    scoreA: number;
    scoreB: number;
    winner: Player;
    round: number;
  }[];
}

// Match history entry type (should match backend)
type MatchHistoryEntry = {
  round: number;
  matchIndex: number;
  a: Player;
  b: Player;
  scoreA: number;
  scoreB: number;
  winner: Player;
};

// Helper: get apple shape points
function getApplePoints(shape: string) {
  return APPLE_SHAPE_POINTS[shape] || 1;
}

const SNAKE_PALETTES = [
  // Garter Snake
  {
    name: "Garter Snake",
    head: "#3a5d23",
    body: ["#6fcf3a", "#3a5d23", "#e2c275"],
  },
  // Corn Snake
  {
    name: "Corn Snake",
    head: "#b7410e",
    body: ["#e25822", "#f6e27a", "#b7410e"],
  },
  // Ball Python
  {
    name: "Ball Python",
    head: "#3b2f1c",
    body: ["#e2c275", "#3b2f1c", "#a67c52"],
  },
  // King Snake
  {
    name: "King Snake",
    head: "#22223b",
    body: ["#fff", "#22223b", "#e63946"],
  },
  // Green Tree Python
  {
    name: "Green Tree Python",
    head: "#2e8b57",
    body: ["#a3e635", "#2e8b57", "#fff"],
  },
  // Milk Snake
  {
    name: "Milk Snake",
    head: "#b22222",
    body: ["#fff", "#b22222", "#22223b"],
  },
  // Boa Constrictor
  {
    name: "Boa Constrictor",
    head: "#8b5e3c",
    body: ["#e2c275", "#8b5e3c", "#fff"],
  },
  // Black Mamba
  {
    name: "#222",
    head: "#222",
    body: ["#222", "#888", "#bbb"],
  },
];

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

  const { gameState, setGameState } = useSnakeGameState({
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

  const [speed] = useState(25); // default 100ms per tick
  const [isPlaying] = useState(true);
  const [showCountdownOverlay, setShowCountdownOverlay] = useState(false);
  const [countdownValue, setCountdownValue] = useState(3);
  const [runInProgress, setRunInProgress] = useState(false);

  const [tournamentStarted, setTournamentStarted] = useState(false);
  const [pendingRunSetup, setPendingRunSetup] = useState(true);

  const [tournament, setTournament] = useState<TournamentState | null>(null);
  const [loadingTournament, setLoadingTournament] = useState(true);

  // Fetch tournament state from API
  useEffect(() => {
    async function fetchTournament() {
      setLoadingTournament(true);
      const res = await fetch("/api/tournament");
      const data = await res.json();
      setTournament(data);
      setLoadingTournament(false);
    }
    fetchTournament();
  }, []);

  // Start/reset tournament
  async function handleStartTournament() {
    setLoadingTournament(true);
    const res = await fetch("/api/tournament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start" }),
    });
    const data = await res.json();
    setTournament(data);
    setTournamentStarted(true);
    setLoadingTournament(false);
  }

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
    if (!tournament) return;
    const interval = setInterval(() => {
      setGameState((prev) => {
        // Only one snake at a time
        const snake = prev.snakes[0];
        if (!snake || !snake.alive) return { ...prev };
        const head = snake.body[0] as [number, number];
        // Use the current player's playstyle for the personality function
        const match = tournament.bracket[tournament.currentMatch];
        if (!match) return prev;
        const player = match[tournament.currentRun];
        if (!player) return prev;
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
        const newPendingTailColors = snake.pendingTailColors
          ? [...snake.pendingTailColors]
          : [];
        let newBodyColors = snake.bodyColors
          ? [...snake.bodyColors]
          : Array(snake.body.length).fill(snake.bodyColor);
        // Find palette for this snake
        const snakePaletteIdx =
          (snake.seed ? snake.seed - 1 : 0) % SNAKE_PALETTES.length;
        const snakePalette = SNAKE_PALETTES[snakePaletteIdx];
        if (eatenAppleIdx !== -1) {
          const eatenApple = prev.apples[eatenAppleIdx];
          const shape = eatenApple[4] || "circle";
          pointsGained = getApplePoints(shape);
          newScore += pointsGained;
          newGrowth += 1;
          newApples = prev.apples.filter((_, idx) => idx !== eatenAppleIdx);
          const appleColor = eatenApple[2] || snake.bodyColor;
          newPendingTailColors.push(appleColor);
          newBodyColors[newBodyColors.length - 1] = appleColor;
        }
        let newBody: [number, number][];
        if (newGrowth > 0) {
          newBody = [[x, y], ...snake.body];
          newGrowth--;
          // Repeat the palette pattern for the new head
          newBodyColors = [
            snakePalette.body[newBodyColors.length % snakePalette.body.length],
            ...newBodyColors,
          ];
        } else {
          newBody = [[x, y], ...snake.body].slice(0, -1) as [number, number][];
          newBodyColors = [
            snakePalette.body[newBodyColors.length % snakePalette.body.length],
            ...newBodyColors,
          ].slice(0, -1);
        }
        // Always maintain the initial apple count (e.g., 800)
        const APPLE_COUNT = 800;
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
        return {
          ...prev,
          snakes: [
            {
              ...snake,
              body: newBody,
              dir: nextDir,
              growth: newGrowth,
              score: newScore,
              pendingTailColors: newPendingTailColors,
              bodyColors: newBodyColors,
            },
          ],
          apples: newApples,
          longestSnakeLength: maxLength,
          allTimeLongest,
        };
      });
    }, speed);
    intervalRef.current = interval;
    return () => clearInterval(interval);
  }, [
    isPlaying,
    runInProgress,
    setGameState,
    intervalRef,
    gridSize,
    speed,
    tournament,
  ]);

  // --- Tournament Logic ---
  // 1. On mount or after each match, set up the next run
  useEffect(() => {
    if (!pendingRunSetup) return;
    if (!tournamentStarted || !tournament || tournament.isTournamentComplete)
      return;
    // Set up the snake for the current run
    const match = tournament.bracket[tournament.currentMatch];
    if (!match) return;
    const player = match[tournament.currentRun];
    if (!player) return;
    console.debug("[Run Setup Effect] Setting up run:", {
      currentMatch: tournament.currentMatch,
      currentRun: tournament.currentRun,
      player: player.name,
      isTournamentComplete: tournament.isTournamentComplete,
    });
    // Pick a palette based on player.seed or index
    const paletteIdx =
      (player.seed ? player.seed - 1 : 0) % SNAKE_PALETTES.length;
    const palette = SNAKE_PALETTES[paletteIdx];
    const body = Array.from(
      { length: 5 },
      (_, j) =>
        [Math.floor(gridSize / 2) - j, Math.floor(gridSize / 2)] as [
          number,
          number
        ]
    );
    const bodyColors = Array.from(
      { length: body.length },
      (_, i) => palette.body[i % palette.body.length]
    );
    setGameState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        snakes: [
          {
            body,
            dir: [1, 0],
            alive: true,
            bodyColor: palette.body[0],
            headColor: palette.head,
            justSpawned: true,
            name: player.name || "AI",
            seed: player.seed || 0,
            bodyColors,
          },
        ],
        longestSnakeLength: 5,
      };
    });
    setShowCountdownOverlay(true);
    setCountdownValue(3);
    setRunInProgress(false);
    setPendingRunSetup(false);
  }, [pendingRunSetup, tournamentStarted, tournament, gridSize, setGameState]);

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

  // Auto-advance logic
  useEffect(() => {
    if (!runInProgress) {
      // If the run just ended, auto-advance after a short delay
      const alive = gameState.snakes[0]?.alive ?? false;
      if (!alive) {
        const score = gameState.snakes[0]?.score || 0;
        console.debug(
          "[Auto-Advance Effect] Run ended. Posting score:",
          score,
          "Tournament:",
          tournament
        );
        setTimeout(async () => {
          if (!tournament) return;
          // POST to API to advance tournament
          const res = await fetch("/api/tournament", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "advance", score }),
          });
          const data = await res.json();
          console.debug(
            "[Auto-Advance Effect] Tournament state after API response:",
            data
          );
          setTournament(data);
        }, 1000); // 1 second delay
        // Always trigger the next run setup after the API response
        setPendingRunSetup(true);
      }
    }
  }, [runInProgress, gameState.snakes, tournament]);

  // Watch for snake death and end the run
  useEffect(() => {
    if (!runInProgress) return;
    const alive = gameState.snakes[0]?.alive ?? false;
    if (!alive) {
      setRunInProgress(false);
    }
  }, [gameState.snakes, runInProgress]);

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
            onClick={handleStartTournament}
            disabled={loadingTournament}
          >
            {loadingTournament ? "Loading..." : "Start Tournament"}
          </button>
        </div>
      </div>
    ) : null;

  // 4. UI for tournament
  function renderBracket() {
    if (!tournament) return null;
    return (
      <Card className="mb-4 p-4 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-bold text-lg">
            {tournament.isGrandFinal
              ? "Grand Final"
              : tournament.round === 1
              ? "Winners Bracket"
              : "Losers Bracket"}
          </h3>
        </div>
        <Separator className="mb-3" />
        <div className="grid gap-2">
          {tournament.bracket.map((match, mIdx) => (
            <div
              key={mIdx}
              className={`p-2 rounded-lg ${
                mIdx === tournament.currentMatch
                  ? "bg-primary/10 border border-primary/30"
                  : "bg-muted/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: match[0].color }}
                  />
                  <span className="font-medium">{match[0].name}</span>
                  <Badge variant="outline" className="text-xs">
                    Seed {match[0].seed}
                  </Badge>
                </div>
                <span className="text-muted-foreground">vs</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Seed {match[1].seed}
                  </Badge>
                  <span className="font-medium">{match[1].name}</span>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: match[1].color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // 4b. UI for previous match results
  function renderMatchResults() {
    if (
      !tournament ||
      !tournament.matchHistory ||
      tournament.matchHistory.length === 0
    )
      return null;
    // Group matchHistory by round
    const grouped: { [round: number]: MatchHistoryEntry[] } = {};
    for (const res of tournament.matchHistory as MatchHistoryEntry[]) {
      if (!grouped[res.round]) grouped[res.round] = [];
      grouped[res.round].push(res);
    }
    return (
      <Card className="mb-4 p-4 shadow-md">
        <div className="font-bold text-lg mb-2">Match Results</div>
        <Separator className="mb-3" />
        <div className="flex flex-col gap-4">
          {Object.keys(grouped)
            .sort((a, b) => Number(a) - Number(b))
            .map((round) => (
              <div key={round}>
                <div className="font-semibold text-blue-700 mb-1">
                  Round {round}
                </div>
                <div className="flex flex-col gap-2">
                  {grouped[Number(round)].map((res, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <span
                        style={{
                          color: res.a.color,
                          fontWeight:
                            res.winner.name === res.a.name ? "bold" : "normal",
                        }}
                      >
                        {res.a.name} ({res.scoreA})
                      </span>
                      <span className="mx-2">vs</span>
                      <span
                        style={{
                          color: res.b.color,
                          fontWeight:
                            res.winner.name === res.b.name ? "bold" : "normal",
                        }}
                      >
                        {res.b.name} ({res.scoreB})
                      </span>
                      <span className="ml-4 text-green-600 font-semibold">
                        Winner: {res.winner.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </Card>
    );
  }

  // 5. UI for current run and match
  function renderCurrentRun() {
    if (!tournamentStarted || !tournament) return null;
    const match = tournament?.bracket[tournament.currentMatch];
    if (!match) return null;
    const [playerA, playerB] = match;
    const currentPlayer = match[tournament.currentRun];
    const currentScore = gameState.snakes[0]?.score || 0;
    // Find score to beat for second run
    let scoreToBeat: number | null = null;
    if (tournament.currentRun === 1) {
      // Try to find the first run's score in matchHistory
      const prevMatch = (tournament.matchHistory as MatchHistoryEntry[]).find(
        (m) =>
          m.round === tournament.round &&
          m.matchIndex === tournament.currentMatch
      );
      if (prevMatch) {
        scoreToBeat = prevMatch.scoreA;
      } else if (typeof tournament.scores[0] === "number") {
        scoreToBeat = tournament.scores[0];
      }
    }
    return (
      <div className="mb-4 p-2 bg-gray-700 rounded text-white">
        {/* CURRENT PLAYER BANNER */}
        <div
          className="flex items-center justify-center mb-4 p-4 rounded-lg shadow-lg"
          style={{
            background: currentPlayer.color,
            color: "#fff",
            fontWeight: 900,
            fontSize: 28,
            letterSpacing: 1,
            border: `3px solid #fff`,
            boxShadow: `0 2px 16px 2px ${currentPlayer.color}99`,
            textShadow: "0 2px 8px #0008",
            minHeight: 64,
          }}
        >
          <span style={{ fontSize: 36, marginRight: 18 }}>🏁</span>
          <span>
            {currentPlayer.name}
            <span
              style={{
                display: "inline-block",
                background: "#fff3",
                color: "#fff",
                fontWeight: 700,
                fontSize: 18,
                borderRadius: 8,
                padding: "4px 16px",
                marginLeft: 18,
                letterSpacing: 2,
                textTransform: "uppercase",
                boxShadow: `0 1px 8px ${currentPlayer.color}55`,
              }}
            >
              CURRENTLY COMPETING
            </span>
          </span>
        </div>
        <div className="font-bold mb-2">
          Match {tournament.currentMatch + 1} of {tournament.bracket.length}
        </div>
        <div className="flex items-center gap-4">
          <span
            style={{
              color: playerA.color,
              fontWeight: tournament.currentRun === 0 ? "bold" : "normal",
              background:
                tournament.currentRun === 0 ? playerA.color + "22" : undefined,
              border:
                tournament.currentRun === 0
                  ? `2px solid ${playerA.color}`
                  : undefined,
              borderRadius: tournament.currentRun === 0 ? 8 : undefined,
              padding: tournament.currentRun === 0 ? "4px 12px" : undefined,
              boxShadow:
                tournament.currentRun === 0
                  ? `0 0 8px 2px ${playerA.color}55`
                  : undefined,
              opacity: tournament.currentRun === 0 ? 1 : 0.7,
              transition: "all 0.2s",
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
          <span className="mx-2">vs</span>
          <span
            style={{
              color: playerB.color,
              fontWeight: tournament.currentRun === 1 ? "bold" : "normal",
              background:
                tournament.currentRun === 1 ? playerB.color + "22" : undefined,
              border:
                tournament.currentRun === 1
                  ? `2px solid ${playerB.color}`
                  : undefined,
              borderRadius: tournament.currentRun === 1 ? 8 : undefined,
              padding: tournament.currentRun === 1 ? "4px 12px" : undefined,
              boxShadow:
                tournament.currentRun === 1
                  ? `0 0 8px 2px ${playerB.color}55`
                  : undefined,
              opacity: tournament.currentRun === 1 ? 1 : 0.7,
              transition: "all 0.2s",
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
          <div className="mt-2 text-lg font-mono text-yellow-300">
            Score: {currentScore}
          </div>
          {scoreToBeat !== null && (
            <div className="mt-2 text-md font-semibold text-yellow-400 bg-gray-800 rounded px-3 py-1 inline-block">
              Score to Beat: {scoreToBeat}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Tournament Explanation */}
      <Card className="max-w-3xl mx-auto mt-6 mb-6 p-6 shadow-md bg-gradient-to-br from-blue-50 to-purple-50">
        <h1 className="text-3xl font-bold mb-2 text-center">
          Snake AI Tournament
        </h1>
        <p className="text-lg text-gray-700 mb-2 text-center">
          Welcome to the Snake AI Tournament! Eight unique AI snakes compete in
          a bracketed tournament. Each snake has its own name, color, playstyle,
          and preferred apple shape. The tournament is structured as a series of
          1v1 matches, with each player taking a turn. The winner is the snake
          with the highest score in each match, and the bracket advances until a
          champion is crowned.
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-2">
          <li>
            <b>Bracket System:</b> 8 players, 4 matches in the first round, then
            semifinals and finals.
          </li>
          <li>
            <b>Match Flow:</b> Each match consists of two runs (one per player),
            with a clear `&quot;score to beat`&quot; for the second player.
          </li>
          <li>
            <b>Unique Playstyles:</b> Each AI uses a different pathfinding
            algorithm and has a preferred apple shape for bonus points.
          </li>
          <li>
            <b>UI Features:</b> Tournament bracket, countdown overlays, and
            clear winner announcements.
          </li>
        </ul>
        <p className="text-md text-gray-600 text-center mt-2">
          Can your favorite snake become the champion?
        </p>
      </Card>
      {renderCountdownOverlay()}
      {renderStartTournament()}
      {/* Move bracket, current run, and legend above the game board */}
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
        {renderBracket()}
        {renderMatchResults()}
        {renderCurrentRun()}
      </div>
      <div className="flex-grow p-4">
        <SnakeBoard
          snakes={gameState.snakes}
          apples={gameState.apples}
          cellSize={cellSize}
          gridSize={gridSize}
        />
      </div>
    </div>
  );
}

export default SnakeGame;
