"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

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

  // --- A* Pathfinding ---
  const gridSize = 24;
  function neighbors([x, y]: number[]): number[][] {
    return possibleDirs
      .map(([dx, dy]) => [x + dx, y + dy])
      .filter(
        ([nx, ny]) =>
          nx >= 0 &&
          nx < gridSize &&
          ny >= 0 &&
          ny < gridSize &&
          !forbidden.has(`${nx},${ny}`)
      );
  }
  function heuristic([x, y]: number[]): number {
    return Math.abs(ax - x) + Math.abs(ay - y);
  }
  const start = head;
  const goal = apple;
  const openSet = [start];
  const cameFrom = new Map<string, string>();
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  gScore.set(`${start[0]},${start[1]}`, 0);
  fScore.set(`${start[0]},${start[1]}`, heuristic(start));
  while (openSet.length > 0) {
    // Get node in openSet with lowest fScore
    let currentIdx = 0;
    let minF = fScore.get(`${openSet[0][0]},${openSet[0][1]}`) ?? Infinity;
    for (let i = 1; i < openSet.length; i++) {
      const f = fScore.get(`${openSet[i][0]},${openSet[i][1]}`) ?? Infinity;
      if (f < minF) {
        minF = f;
        currentIdx = i;
      }
    }
    const current = openSet.splice(currentIdx, 1)[0];
    if (current[0] === goal[0] && current[1] === goal[1]) {
      // Reconstruct path
      const path = [`${current[0]},${current[1]}`];
      while (cameFrom.has(path[0])) {
        path.unshift(cameFrom.get(path[0])!);
      }
      // The first move is from head to path[1]
      if (path.length > 1) {
        const [nx, ny] = path[1].split(",").map(Number);
        return [nx - head[0], ny - head[1]];
      }
    }
    for (const neighbor of neighbors(current)) {
      const key = `${neighbor[0]},${neighbor[1]}`;
      const tentativeG =
        (gScore.get(`${current[0]},${current[1]}`) ?? Infinity) + 1;
      if (tentativeG < (gScore.get(key) ?? Infinity)) {
        cameFrom.set(key, `${current[0]},${current[1]}`);
        gScore.set(key, tentativeG);
        fScore.set(key, tentativeG + heuristic(neighbor));
        if (!openSet.some(([x, y]) => x === neighbor[0] && y === neighbor[1])) {
          openSet.push(neighbor);
        }
      }
    }
  }
  // --- End A* ---

  // If no path found, fallback to old logic
  const safeDirs = dirs.filter(([mx, my]) => {
    const [nx, ny] = [hx + mx, hy + my];
    if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize) return false;
    return !forbidden.has(`${nx},${ny}`);
  });
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

// Tetromino shapes (relative coordinates)
const TETROMINOES = [
  // I
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  // O
  [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ],
  // T
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [1, 1],
  ],
  // S
  [
    [1, 0],
    [2, 0],
    [0, 1],
    [1, 1],
  ],
  // Z
  [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
  ],
  // J
  [
    [0, 0],
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  // L
  [
    [2, 0],
    [0, 1],
    [1, 1],
    [2, 1],
  ],
];

// Helper to get all forbidden positions for apple spawning
function getForbiddenForApple({
  snakes,
  apples,
  walls,
  skipAppleIndex,
}: {
  snakes: number[][][];
  apples: number[][];
  walls: number[][];
  skipAppleIndex?: number;
}) {
  const forbidden = [
    ...snakes.flat(),
    ...walls,
    ...apples.filter((_, i) => i !== skipAppleIndex),
  ];
  return forbidden;
}

// Each wall is now a tetromino: { shapeIndex, x, y, color }
type TetrominoWall = {
  shapeIndex: number;
  x: number;
  y: number;
  color: string;
};

const TETROMINO_COLORS = [
  "#e34c26", // I
  "#f7df1e", // O
  "#264de4", // T
  "#68a063", // S
  "#336791", // Z
  "#61dafb", // J
  "#ff9800", // L
];

// Helper to generate a tetromino at the top (no rotation)
function generateTetrominoWall(
  gridSize: number,
  existingWalls: TetrominoWall[]
): TetrominoWall | null {
  // Try up to 10 times to find a non-overlapping spawn
  for (let attempt = 0; attempt < 10; attempt++) {
    const shapeIndex = Math.floor(Math.random() * TETROMINOES.length);
    const shape = TETROMINOES[shapeIndex];
    const maxX = Math.max(...shape.map(([x]) => x));
    const minX = Math.min(...shape.map(([x]) => x));
    // Only allow x so that all blocks are within [0, gridSize-1]
    const x = Math.floor(Math.random() * (gridSize - maxX + minX));
    const y = 0;
    const color = TETROMINO_COLORS[shapeIndex % TETROMINO_COLORS.length];
    // Check for overlap with existing walls and border
    const newCoords = shape.map(([dx, dy]) => [x + dx, y + dy]);
    // Ensure all blocks are within grid
    if (
      newCoords.some(
        ([nx, ny]) => nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize
      )
    )
      continue;
    const allExistingCoords = existingWalls.flatMap((wall) =>
      TETROMINOES[wall.shapeIndex].map(([dx, dy]) => [wall.x + dx, wall.y + dy])
    );
    if (
      !newCoords.some(([nx, ny]) =>
        allExistingCoords.some(([ex, ey]) => ex === nx && ey === ny)
      )
    ) {
      return { shapeIndex, x, y, color };
    }
  }
  return null; // Could not find a non-overlapping spawn
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
      const snake = Array.from({ length: 5 }, (_, j) => [
        Math.floor(gridSize / 2) - j + i,
        Math.floor(gridSize / 2),
      ]);
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
  const [walls, setWalls] = useState<TetrominoWall[]>([]);
  // Track time for falling walls
  const [wallTick, setWallTick] = useState(0);

  // Add mode state for cell click action
  const [spawnMode, setSpawnMode] = useState<"snake" | "apple">("snake");

  // Track which snakes are fading out
  const [fadingSnakes, setFadingSnakes] = useState<number[]>([]);

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

  // Only generate walls on mount and on reset
  useEffect(() => {
    const initialWalls: TetrominoWall[] = [];
    for (let i = 0; i < 3; i++) {
      const wall = generateTetrominoWall(gridSize, initialWalls);
      if (wall) initialWalls.push(wall);
    }
    setWalls(initialWalls);
  }, []);

  // Falling wall effect
  useEffect(() => {
    const interval = setInterval(() => {
      setWalls((prevWalls) => {
        // Move all tetrominoes down by 1 (no rotation)
        return prevWalls
          .map((wall) => ({
            ...wall,
            y: wall.y + 1,
          }))
          .filter((wall) => {
            // Remove if any block is out of bounds (bottom)
            const shape = TETROMINOES[wall.shapeIndex];
            return shape.every(([, dy]) => wall.y + dy < gridSize);
          });
      });
      setWallTick((tick) => tick + 1);
    }, 1200);
    return () => clearInterval(interval);
  }, [gridSize]);

  // Spawn new tetromino at the top every N ticks
  useEffect(() => {
    if (wallTick === 0) return;
    if (wallTick % 4 === 0) {
      setWalls((prevWalls) => {
        const newWall = generateTetrominoWall(gridSize, prevWalls);
        if (!newWall) return prevWalls; // skip if overlap
        return [...prevWalls, newWall];
      });
    }
  }, [wallTick, gridSize]);

  function isCellOccupied(x: number, y: number) {
    for (const state of gameStates) {
      for (const [sx, sy] of state.snake) {
        if (sx === x && sy === y) return true;
      }
      for (const [ax, ay] of state.apples) {
        if (ax === x && ay === y) return true;
      }
    }
    for (const wall of walls) {
      const coords = TETROMINOES[wall.shapeIndex];
      if (coords.some(([dx, dy]) => x === wall.x + dx && y === wall.y + dy)) {
        return true;
      }
    }
    return false;
  }

  function handleCellClick(x: number, y: number) {
    if (spawnMode === "snake") {
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
        // Spawn apples immediately in valid positions
        const apples: number[][] = [];
        for (let i = 0; i < 5; i++) {
          let tries = 0;
          let apple: number[] = [-1, -1];
          do {
            // Don't allow apples to spawn on any snake or wall
            const forbidden = [
              ...body,
              ...prev.flatMap((state) => state.snake),
              ...prev.flatMap((state) => state.apples),
              ...walls.flatMap((wall) =>
                TETROMINOES[wall.shapeIndex].map(([dx, dy]) => [
                  wall.x + dx,
                  wall.y + dy,
                ])
              ),
            ];
            apple = getRandomApple(forbidden, gridSize);
            tries++;
          } while (
            (apple[0] === -1 ||
              apples.some(([ax, ay]) => ax === apple[0] && ay === apple[1])) &&
            tries < 100
          );
          apples.push(apple);
        }
        return [
          ...prev,
          {
            snake: body,
            apples,
            dir: [1, 0],
            isFirstApple: false,
            alive: true,
          },
        ];
      });
    } else if (spawnMode === "apple") {
      setGameStates((prev) => {
        // Only add an apple if the cell is not occupied
        const occupied = new Set<string>();
        for (const state of prev) {
          for (const [sx, sy] of state.snake) {
            occupied.add(`${sx},${sy}`);
          }
          for (const [ax, ay] of state.apples) {
            occupied.add(`${ax},${ay}`);
          }
        }
        for (const wall of walls) {
          const coords = TETROMINOES[wall.shapeIndex];
          if (
            coords.some(([dx, dy]) => x === wall.x + dx && y === wall.y + dy)
          ) {
            return prev;
          }
        }
        if (occupied.has(`${x},${y}`)) {
          return prev;
        }
        // Add the apple to the first snake's apples array (or create a new snake if none)
        const newStates = prev.length > 0 ? [...prev] : [];
        if (newStates.length === 0) {
          // If no snake exists, spawn a new snake and apples together
          const body: number[][] = [[x, y]];
          // Try to spawn apples in valid positions
          const apples: number[][] = [];
          for (let i = 0; i < 5; i++) {
            let tries = 0;
            let apple: number[] = [-1, -1];
            do {
              const forbidden = [
                ...body,
                ...apples,
                ...walls.flatMap((wall) =>
                  TETROMINOES[wall.shapeIndex].map(([dx, dy]) => [
                    wall.x + dx,
                    wall.y + dy,
                  ])
                ),
              ];
              apple = getRandomApple(forbidden, gridSize);
              tries++;
            } while (
              (apple[0] === -1 ||
                apples.some(
                  ([ax, ay]) => ax === apple[0] && ay === apple[1]
                )) &&
              tries < 100
            );
            apples.push(apple);
          }
          newStates.push({
            snake: body,
            apples,
            dir: [1, 0],
            isFirstApple: false,
            alive: true,
          });
        } else {
          // Add the apple to the first snake's apples array
          newStates[0].apples = [...newStates[0].apples, [x, y]];
        }
        return newStates;
      });
    }
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
            walls.flatMap((wall) => TETROMINOES[wall.shapeIndex])
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
          if (
            walls.some((wall) =>
              TETROMINOES[wall.shapeIndex].some(
                ([dx, dy]) => x === wall.x + dx && y === wall.y + dy
              )
            )
          ) {
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
              const forbidden = getForbiddenForApple({
                snakes: states.map((s) => s.snake),
                apples: newApples,
                walls: walls.flatMap((wall) => TETROMINOES[wall.shapeIndex]),
                skipAppleIndex: i,
              });
              let newApple: number[] = [-1, -1];
              let tries = 0;
              do {
                newApple = getRandomApple(forbidden, gridSize);
                tries++;
              } while (
                newApple[0] !== -1 &&
                newApples.some(
                  (a, j) =>
                    j !== i && a[0] === newApple[0] && a[1] === newApple[1]
                ) &&
                tries < 100
              );
              // Only set if valid
              if (
                newApple[0] !== -1 &&
                !walls.some((wall) =>
                  TETROMINOES[wall.shapeIndex].some(
                    ([dx, dy]) => dx === newApple[0] && dy === newApple[1]
                  )
                )
              ) {
                newApples[i] = newApple;
              } else {
                newApples[i] = [-1, -1];
              }
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

  const resetGame = useCallback(() => {
    setShowCountdown(true);
    setCountdown(3);
    // Regenerate walls on reset
    const initialWalls: TetrominoWall[] = [];
    for (let i = 0; i < 3; i++) {
      const wall = generateTetrominoWall(gridSize, initialWalls);
      if (wall) initialWalls.push(wall);
    }
    setWalls(initialWalls);
    setGameStates(
      Array.from({ length: numSnakes }, (_, i) => {
        const snake = Array.from({ length: 5 }, (_, j) => [
          Math.floor(gridSize / 2) - j + i,
          Math.floor(gridSize / 2),
        ]);
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
  }, [gridSize, numSnakes]);

  useEffect(() => {
    if (gameOver) {
      resetGame();
      setGameOver(false);
    }
  }, [gameOver, resetGame]);

  useEffect(() => {
    setGameStates((prevStates) => {
      if (numSnakes > prevStates.length) {
        const newSnakes = Array.from(
          { length: numSnakes - prevStates.length },
          (_, i) => {
            const snake = Array.from({ length: 5 }, (_, j) => [
              Math.floor(gridSize / 2) - j + prevStates.length + i,
              Math.floor(gridSize / 2),
            ]);
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
              const forbidden = getForbiddenForApple({
                snakes: [state.snake],
                apples,
                walls: walls.flatMap((wall) => TETROMINOES[wall.shapeIndex]),
                skipAppleIndex: i,
              });
              let newApple: number[] = [-1, -1];
              let tries = 0;
              do {
                newApple = getRandomApple(forbidden, gridSize);
                tries++;
              } while (
                newApple[0] !== -1 &&
                apples.some(
                  (a, j) =>
                    j !== i && a[0] === newApple[0] && a[1] === newApple[1]
                ) &&
                tries < 100
              );
              // Only set if valid
              if (
                newApple[0] !== -1 &&
                !walls.some((wall) =>
                  TETROMINOES[wall.shapeIndex].some(
                    ([dx, dy]) => dx === newApple[0] && dy === newApple[1]
                  )
                )
              ) {
                apples[i] = newApple;
              } else {
                apples[i] = [-1, -1];
              }
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

  // When a snake dies, add its index to fadingSnakes
  useEffect(() => {
    setFadingSnakes((prev) => {
      const dead = gameStates
        .map((state, idx) => (!state.alive && !prev.includes(idx) ? idx : null))
        .filter((idx) => idx !== null) as number[];
      if (dead.length === 0) return prev;
      return [...prev, ...dead];
    });
  }, [gameStates]);

  // Remove faded snakes after animation
  useEffect(() => {
    if (fadingSnakes.length === 0) return;
    const timeout = setTimeout(() => {
      setGameStates((prev) =>
        prev.filter((_, idx) => !fadingSnakes.includes(idx))
      );
      setFadingSnakes([]);
    }, 700); // match fade duration
    return () => clearTimeout(timeout);
  }, [fadingSnakes]);

  // If there are no snakes, spawn a new one automatically
  useEffect(() => {
    if (gameStates.length === 0) {
      setGameStates([
        {
          snake: Array.from({ length: 5 }, (_, j) => [
            Math.floor(gridSize / 2) - j,
            Math.floor(gridSize / 2),
          ]),
          apples: Array.from({ length: 5 }, () => [-1, -1]),
          dir: [1, 0],
          isFirstApple: true,
          alive: true,
        },
      ]);
    }
  }, [gameStates.length, gridSize]);

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

  return (
    <div className="flex flex-col items-center w-full">
      <div className="mb-4 flex gap-2 items-center">
        <label htmlFor="spawn-mode" className="font-medium">
          Click mode:
        </label>
        <select
          id="spawn-mode"
          value={spawnMode}
          onChange={(e) => setSpawnMode(e.target.value as "snake" | "apple")}
          className="border rounded px-2 py-1 text-base text-black"
        >
          <option value="snake">Spawn Snake</option>
          <option value="apple">Spawn Apple</option>
        </select>
      </div>
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
          <defs>
            {/* Snake body gradient */}
            <linearGradient id="snakeBody3D" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="1" />
            </linearGradient>
            {/* Snake head gradient */}
            <radialGradient id="snakeHead3D" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#fffbe9" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#f59e42" stopOpacity="1" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="1" />
            </radialGradient>
            {/* Apple gradient */}
            <radialGradient id="apple3D" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#ef4444" stopOpacity="1" />
              <stop offset="100%" stopColor="#991b1b" stopOpacity="1" />
            </radialGradient>
            {/* Wall gradient */}
            <linearGradient id="wall3D" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#22223b" stopOpacity="0.7" />
            </linearGradient>
            {/* Drop shadow filter */}
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="2"
                dy="2"
                stdDeviation="2"
                floodColor="#22223b"
                floodOpacity="0.4"
              />
            </filter>
          </defs>
          {gridRects}
          {/* Render walls with 3D gradient and shadow */}
          {walls.flatMap((wall, i) => {
            const coords = TETROMINOES[wall.shapeIndex];
            return coords.map(([dx, dy], j) => (
              <rect
                key={`wall-${i}-${j}`}
                x={(wall.x + dx) * cellSize}
                y={(wall.y + dy) * cellSize}
                width={cellSize}
                height={cellSize}
                fill={`url(#wall3D)`}
                stroke={wall.color}
                strokeWidth={2}
                rx={cellSize / 6}
                opacity={0.92}
                filter="url(#shadow)"
              />
            ));
          })}
          {/* Render apples with 3D gradient and shadow */}
          {gameStates.map((state, sidx) =>
            state.apples.map(([ax, ay], i) => (
              <rect
                key={`apple-${sidx}-${i}`}
                x={ax * cellSize}
                y={ay * cellSize}
                width={cellSize}
                height={cellSize}
                fill="url(#apple3D)"
                stroke="#b91c1c"
                strokeWidth={2}
                rx={cellSize / 3}
                opacity={0.9}
                filter="url(#shadow)"
              />
            ))
          )}
          {/* Render snakes with 3D gradients and shadow */}
          {gameStates.map((state, sidx) =>
            state.snake.map(([x, y], i) => (
              <rect
                key={`snake-${sidx}-${i}`}
                x={x * cellSize}
                y={y * cellSize}
                width={cellSize}
                height={cellSize}
                fill={i === 0 ? "url(#snakeHead3D)" : "url(#snakeBody3D)"}
                stroke="#22223b"
                strokeWidth={2}
                rx={cellSize / 4}
                opacity={fadingSnakes.includes(sidx) ? 0 : 0.88}
                className={fadingSnakes.includes(sidx) ? "snake-fade-out" : ""}
                style={{ transition: "opacity 0.7s" }}
                filter="url(#shadow)"
              />
            ))
          )}
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
        .snake-fade-out {
          opacity: 0 !important;
          transition: opacity 0.7s;
        }
      `}</style>
    </div>
  );
}
