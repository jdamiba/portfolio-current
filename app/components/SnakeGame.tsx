"use client";

import React, { useEffect, useRef, useState } from "react";

function getRandomApple(
  forbidden: number[][], // all forbidden positions (snake bodies, apples, just-eaten apple)
  gridSize: number
): number[] {
  const forbiddenSet = new Set(forbidden.map(([x, y]) => `${x},${y}`));
  const available: [number, number][] = [];
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (!forbiddenSet.has(`${x},${y}`)) available.push([x, y]);
    }
  }
  if (available.length === 0) return [-1, -1];
  return available[Math.floor(Math.random() * available.length)];
}

function getNextDirection(
  snake: number[][],
  apple: number[],
  currentDir: number[],
  allSnakes: number[][][],
  walls: number[][]
): number[] {
  const head = snake[0];
  const [ax, ay] = apple;
  const [hx, hy] = head;
  const possibleDirs = [
    [1, 0], // right
    [0, 1], // down
    [-1, 0], // left
    [0, -1], // up
  ];
  // Don't reverse
  const [dx, dy] = currentDir;
  const reverse = [-dx, -dy];
  // Filter out reverse direction
  const dirs = possibleDirs.filter(
    ([x, y]) => x !== reverse[0] || y !== reverse[1]
  );

  // Build forbidden set: all snakes' bodies except the current head, plus walls
  const forbidden = new Set<string>();
  for (const s of allSnakes) {
    for (const [i, [sx, sy]] of s.entries()) {
      // Allow the current snake's head to move
      if (s === snake && i === 0) continue;
      forbidden.add(`${sx},${sy}`);
    }
  }
  for (const [wx, wy] of walls) {
    forbidden.add(`${wx},${wy}`);
  }

  // Only consider moves that do not immediately collide with any snake, wall, or go out of bounds
  const gridSize = 24;
  const safeDirs = dirs.filter(([mx, my]) => {
    const [nx, ny] = [hx + mx, hy + my];
    if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize) return false;
    return !forbidden.has(`${nx},${ny}`);
  });

  // If there are safe moves, pick the one that gets closest to the apple
  if (safeDirs.length > 0) {
    let minDist = Infinity;
    let bestDirs: number[][] = [];
    for (const dir of safeDirs) {
      const [mx, my] = dir;
      const [nx, ny] = [hx + mx, hy + my];
      const dist = Math.abs(ax - nx) + Math.abs(ay - ny);
      if (dist < minDist) {
        minDist = dist;
        bestDirs = [dir];
      } else if (dist === minDist) {
        bestDirs.push(dir);
      }
    }
    // Pick randomly among bestDirs
    return bestDirs[Math.floor(Math.random() * bestDirs.length)];
  }

  // If no safe moves, keep going in the current direction
  return currentDir;
}

function generateWalls(
  gridSize: number,
  segmentCount: number,
  forbidden: number[][]
): number[][] {
  const walls: number[][] = [];
  const forbiddenSet = new Set(forbidden.map(([x, y]) => `${x},${y}`));
  let tries = 0;
  const length = 5; // exactly 5 cells per wall
  while (walls.length < segmentCount * length && tries < 1000) {
    if (walls.length / length >= segmentCount) break;
    // Random orientation
    const horizontal = Math.random() < 0.5;
    let x, y;
    if (horizontal) {
      x = Math.floor(Math.random() * (gridSize - length));
      y = Math.floor(Math.random() * gridSize);
    } else {
      x = Math.floor(Math.random() * gridSize);
      y = Math.floor(Math.random() * (gridSize - length));
    }
    // Build segment
    const segment: number[][] = [];
    for (let i = 0; i < length; i++) {
      const cx = horizontal ? x + i : x;
      const cy = horizontal ? y : y + i;
      segment.push([cx, cy]);
    }
    // Check for overlap
    if (
      segment.some(
        ([cx, cy]) =>
          forbiddenSet.has(`${cx},${cy}`) ||
          walls.some(([wx, wy]) => wx === cx && wy === cy)
      )
    ) {
      tries++;
      continue;
    }
    // Add segment
    for (const pos of segment) {
      walls.push(pos);
      forbiddenSet.add(`${pos[0]},${pos[1]}`);
    }
    tries = 0; // reset tries after a successful segment
  }
  return walls;
}

export function SnakeGame() {
  const gridSize = 24;
  const containerPx = 500;
  const cellSize = Math.floor(containerPx / gridSize);

  const [sliderValue] = useState(450); // left = slowest, fixed
  const [numSnakes] = useState(1); // fixed to 3 snakes

  // Countdown state
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(true);

  // Each snake has its own state
  const [gameStates, setGameStates] = useState(() =>
    Array.from({ length: numSnakes }, (_, i) => {
      const snake = [
        [Math.floor(gridSize / 2) + i, Math.floor(gridSize / 2)],
        [Math.floor(gridSize / 2) - 1 + i, Math.floor(gridSize / 2)],
      ];
      return {
        snake,
        apples: Array.from({ length: 5 }, () => [-1, -1]),
        dir: [1, 0],
        isFirstApple: true,
        alive: true,
      };
    })
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const ateAppleRefs = useRef<boolean[]>(Array(numSnakes).fill(false));
  const [gameOver, setGameOver] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // Wall state
  const [walls, setWalls] = useState<number[][]>([]);

  // Countdown effect
  useEffect(() => {
    if (!showCountdown) return;
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c > 1) return c - 1;
        clearInterval(timer);
        setTimeout(() => setShowCountdown(false), 700); // show "Go!" for a bit
        return 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resetCount, showCountdown]);

  // On mount/reset, generate walls
  useEffect(() => {
    // Don't put walls on initial snake or apples
    const forbidden: number[][] = [];
    for (let i = 0; i < numSnakes; i++) {
      forbidden.push([Math.floor(gridSize / 2) + i, Math.floor(gridSize / 2)]);
      forbidden.push([
        Math.floor(gridSize / 2) - 1 + i,
        Math.floor(gridSize / 2),
      ]);
    }
    setWalls(generateWalls(gridSize, 6, forbidden));
  }, [resetCount, numSnakes, gridSize]);

  function isCellOccupied(x: number, y: number) {
    for (const state of gameStates) {
      for (const [sx, sy] of state.snake) {
        if (sx === x && sy === y) return true;
      }
      for (const [ax, ay] of state.apples) {
        if (ax === x && ay === y) return true;
      }
    }
    for (const [wx, wy] of walls) {
      if (wx === x && wy === y) return true;
    }
    return false;
  }

  function handleCellClick(x: number, y: number) {
    setGameStates((prev) => {
      // Build the intended new snake body
      const body: number[][] = [[x, y]];
      if (
        x > 0 &&
        !prev.some(
          (state) =>
            state.snake.some(([sx, sy]) => sx === x - 1 && sy === y) ||
            state.apples.some(([ax, ay]) => ax === x - 1 && ay === y)
        )
      ) {
        body.push([x - 1, y]);
      }
      // Check against the latest state for any overlap
      const occupied = new Set<string>();
      for (const state of prev) {
        for (const [sx, sy] of state.snake) {
          occupied.add(`${sx},${sy}`);
        }
        for (const [ax, ay] of state.apples) {
          occupied.add(`${ax},${ay}`);
        }
      }
      if (body.some(([bx, by]) => occupied.has(`${bx},${by}`))) {
        return prev; // Do not spawn if any segment is occupied
      }
      setResetCount((c) => c + 1);
      return [
        ...prev,
        {
          snake: body,
          apples: Array.from({ length: 5 }, () => [-1, -1]),
          dir: [1, 0],
          isFirstApple: true,
          alive: true,
        },
      ];
    });
  }

  useEffect(() => {
    if (showCountdown) return; // Pause game logic during countdown
    let isMounted = true;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isMounted) return;
      const shouldGameOver = false;
      setGameStates((states) => {
        // 1. Compute all new head positions and next directions
        const allSnakes = states.map((s) => s.snake);
        const newHeads = states.map((state, idx) => {
          if (!state.alive) return null;
          const { snake, dir } = state;
          // Find the nearest apple to this snake's head
          const head = snake[0];
          let nearestApple = state.apples[0];
          let minDist =
            Math.abs(head[0] - nearestApple[0]) +
            Math.abs(head[1] - nearestApple[1]);
          for (const a of state.apples) {
            const dist = Math.abs(head[0] - a[0]) + Math.abs(head[1] - a[1]);
            if (dist < minDist) {
              minDist = dist;
              nearestApple = a;
            }
          }
          const nextDir = getNextDirection(
            snake,
            nearestApple,
            dir,
            allSnakes,
            walls
          );
          const [dx, dy] = nextDir;
          const [x, y] = [snake[0][0] + dx, snake[0][1] + dy];
          return { idx, pos: [x, y], nextDir };
        });

        // 2. Build a map of all new head positions
        const headMap = new Map();
        for (const h of newHeads) {
          if (!h) continue;
          const key = `${h.pos[0]},${h.pos[1]}`;
          if (!headMap.has(key)) headMap.set(key, []);
          headMap.get(key).push(h.idx);
        }

        // 3. Update each snake, checking for collisions
        return states.map((state, idx) => {
          if (!state.alive) return state;
          const h = newHeads[idx];
          if (!h) return state;
          const [x, y] = h.pos;
          // Out of bounds
          if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
            return { ...state, alive: false };
          }
          // Wall collision
          if (walls.some(([wx, wy]) => wx === x && wy === y)) {
            return { ...state, alive: false };
          }
          // Head-to-head collision
          if (headMap.get(`${x},${y}`).length > 1) {
            return { ...state, alive: false };
          }
          // Head-to-body collision (including own body, excluding own head)
          const allBodies = states
            .flatMap((s, sidx) =>
              s.snake.map(([sx, sy], i) =>
                sidx === idx && i === 0 ? null : `${sx},${sy}`
              )
            )
            .filter(Boolean);
          if (allBodies.includes(`${x},${y}`)) {
            return { ...state, alive: false };
          }
          // Apple eating and movement logic
          let newSnake = [[x, y], ...state.snake];
          const newApples = [...state.apples];
          let ate = false;
          for (let i = 0; i < newApples.length; i++) {
            if (x === newApples[i][0] && y === newApples[i][1]) {
              // Respawn only this apple
              const forbidden = [
                ...states.flatMap((s) => s.snake),
                ...newApples,
                ...walls,
              ];
              let newApple: number[];
              let tries = 0;
              do {
                newApple = getRandomApple(forbidden, gridSize);
                tries++;
              } while (
                newApples.some(
                  (a, j) =>
                    j !== i && a[0] === newApple[0] && a[1] === newApple[1]
                ) &&
                tries < 100
              );
              newApples[i] = newApple;
              ate = true;
              break;
            }
          }
          if (!ate) {
            newSnake = newSnake.slice(0, -1);
          }
          return {
            ...state,
            snake: newSnake,
            apples: newApples,
            dir: h.nextDir,
            isFirstApple: false,
            alive: true,
          };
        });
      });
      if (shouldGameOver) setGameOver(true);
    }, 550 - sliderValue);
    return () => {
      isMounted = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sliderValue, numSnakes, gridSize, showCountdown, walls]);

  useEffect(() => {
    if (gameOver) {
      resetGame();
      setGameOver(false);
    }
  }, [gameOver, resetGame]);

  function resetGame() {
    setShowCountdown(true);
    setCountdown(3);
    setGameStates(
      Array.from({ length: numSnakes }, (_, i) => {
        const snake = [
          [Math.floor(gridSize / 2) + i, Math.floor(gridSize / 2)],
          [Math.floor(gridSize / 2) - 1 + i, Math.floor(gridSize / 2)],
        ];
        return {
          snake,
          apples: Array.from({ length: 5 }, () => [-1, -1]),
          dir: [1, 0],
          isFirstApple: true,
          alive: true,
        };
      })
    );
    ateAppleRefs.current = Array(numSnakes).fill(false);
    setResetCount((c) => c + 1);
  }

  useEffect(() => {
    setGameStates((prevStates) => {
      if (numSnakes > prevStates.length) {
        const newSnakes = Array.from(
          { length: numSnakes - prevStates.length },
          (_, i) => {
            const snake = [
              [
                Math.floor(gridSize / 2) + prevStates.length + i,
                Math.floor(gridSize / 2),
              ],
              [
                Math.floor(gridSize / 2) - 1 + prevStates.length + i,
                Math.floor(gridSize / 2),
              ],
            ];
            return {
              snake,
              apples: Array.from({ length: 5 }, () => [-1, -1]),
              dir: [1, 0],
              isFirstApple: true,
              alive: true,
            };
          }
        );
        ateAppleRefs.current = [
          ...ateAppleRefs.current,
          ...Array(numSnakes - prevStates.length).fill(false),
        ];
        return [...prevStates, ...newSnakes];
      } else if (numSnakes < prevStates.length) {
        ateAppleRefs.current = ateAppleRefs.current.slice(0, numSnakes);
        return prevStates.slice(0, numSnakes);
      }
      return prevStates;
    });
  }, [numSnakes]);

  useEffect(() => {
    setGameStates((prevStates) =>
      prevStates.map((state) => {
        if (state.apples.some(([ax, ay]) => ax === -1 && ay === -1)) {
          // Spawn apples so there are always 5
          const apples = [...state.apples];
          for (let i = 0; i < apples.length; i++) {
            if (apples[i][0] === -1 && apples[i][1] === -1) {
              const forbidden = [
                ...state.snake,
                ...apples.filter((_, j) => j !== i),
                ...walls,
              ];
              let newApple: number[];
              let tries = 0;
              do {
                newApple = getRandomApple(forbidden, gridSize);
                tries++;
              } while (
                apples.some(
                  (a, j) =>
                    j !== i && a[0] === newApple[0] && a[1] === newApple[1]
                ) &&
                tries < 100
              );
              apples[i] = newApple;
            }
          }
          return {
            ...state,
            apples,
            alive: state.alive,
          };
        }
        return state;
      })
    );
  }, [numSnakes, gridSize, resetCount, walls]);

  const snakeHeadColors = [
    "#f59e42",
    "#a3e635",
    "#f472b6",
    "#818cf8",
    "#facc15",
  ];
  const snakeBodyColors = [
    "#38bdf8",
    "#4ade80",
    "#fbbf24",
    "#f87171",
    "#a78bfa",
  ];

  const gridRects = [];
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      gridRects.push(
        <rect
          key={`cell-${x}-${y}`}
          x={x * cellSize}
          y={y * cellSize}
          width={cellSize}
          height={cellSize}
          fill="#f3f4f6"
          stroke="#22223b"
          strokeWidth={1.1}
          opacity={0.3}
          onClick={() => handleCellClick(x, y)}
          style={{ cursor: isCellOccupied(x, y) ? "not-allowed" : "pointer" }}
        />
      );
    }
  }

  const allSnakes = gameStates.map((state, sidx) =>
    state.snake.map(([x, y], i) => (
      <rect
        key={`snake-${sidx}-${i}`}
        x={x * cellSize}
        y={y * cellSize}
        width={cellSize}
        height={cellSize}
        fill={
          i === 0
            ? snakeHeadColors[sidx % snakeHeadColors.length]
            : snakeBodyColors[sidx % snakeBodyColors.length]
        }
        stroke="#22223b"
        strokeWidth={2}
        rx={cellSize / 4}
        opacity={0.8}
      />
    ))
  );
  const allApples = gameStates.map((state, sidx) =>
    state.apples.map(([ax, ay], i) => (
      <rect
        key={`apple-${sidx}-${i}`}
        x={ax * cellSize}
        y={ay * cellSize}
        width={cellSize}
        height={cellSize}
        fill="#ef4444"
        stroke="#b91c1c"
        strokeWidth={2}
        rx={cellSize / 3}
        opacity={0.8}
      />
    ))
  );

  // Render walls
  const allWalls = walls.map(([wx, wy], i) => (
    <rect
      key={`wall-${i}`}
      x={wx * cellSize}
      y={wy * cellSize}
      width={cellSize}
      height={cellSize}
      fill="#22223b"
      stroke="#000"
      strokeWidth={2}
      rx={cellSize / 6}
      opacity={0.85}
    />
  ));

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${containerPx} ${containerPx}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full mx-auto md:mx-0"
          preserveAspectRatio="xMidYMid meet"
        >
          {gridRects}
          {allWalls}
          {allApples}
          {allSnakes}
        </svg>
        {showCountdown && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div
              className="text-7xl md:text-8xl font-extrabold text-primary-foreground bg-black/60 rounded-2xl px-12 py-8 animate-fade-scale"
              style={{
                transition: "opacity 0.3s, transform 0.3s",
                opacity: 1,
                transform: "scale(1)",
              }}
            >
              {countdown > 0 ? countdown : "Go!"}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 w-full max-w-[500px] mt-4">
        <button
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          onClick={resetGame}
        >
          Reset
        </button>
      </div>
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
      `}</style>
    </div>
  );
}
