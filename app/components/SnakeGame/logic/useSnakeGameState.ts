import { useState, useEffect, useCallback } from "react";
import type { Snake } from "./types";
import { Direction } from "./types";
import { getHighContrastColor } from "./colorUtils";

const BACKGROUND_COLOR = "#f3f4f6";

interface UseSnakeGameStateArgs {
  gridSize: number;
  cellSize: number;
  autoplay: boolean;
  manualDir?: [number, number];
  spawnMode: "snake" | "apple";
  setManualDir?: React.Dispatch<React.SetStateAction<[number, number]>>;
  setAutoplay: React.Dispatch<React.SetStateAction<boolean>>;
  setSpawnMode: React.Dispatch<React.SetStateAction<"snake" | "apple">>;
  intervalRef: React.MutableRefObject<NodeJS.Timeout | null>;
  lastTouchRef: React.MutableRefObject<{ x: number; y: number } | null>;
  snakesRef: React.MutableRefObject<Snake[]>;
  showCountdown: boolean;
  setShowCountdown: React.Dispatch<React.SetStateAction<boolean>>;
  countdown: number;
  setCountdown: React.Dispatch<React.SetStateAction<number>>;
  initialSnakes?: { instrument: string }[];
}

export function useSnakeGameState({
  gridSize,
  initialSnakes,
}: UseSnakeGameStateArgs) {
  // Unified game state
  const [gameState, setGameState] = useState<{
    snakes: Snake[];
    apples: [number, number, string, string, string][];
    longestSnakeLength: number;
    allTimeLongest: number;
  }>(() => {
    let snakes: Snake[] = [];
    if (initialSnakes && initialSnakes.length > 0) {
      // Place the initial snakes at different y positions
      snakes = initialSnakes.map((s, i) => {
        const bodyColor = getHighContrastColor([BACKGROUND_COLOR], 120);
        const headColor = getHighContrastColor(
          [BACKGROUND_COLOR, bodyColor],
          120
        );
        return {
          body: Array.from(
            { length: 5 },
            (_, j) =>
              [
                Math.floor(gridSize / 2) - j,
                Math.floor(gridSize / 2) + (i === 0 ? -2 : 2),
              ] as [number, number]
          ),
          dir: [1, 0] as Direction,
          alive: true,
          bodyColor,
          headColor,
          justSpawned: true,
        };
      });
    }
    return {
      snakes,
      apples: [],
      longestSnakeLength: 0,
      allTimeLongest: 0,
    };
  });
  const [hasMounted, setHasMounted] = useState(false);

  // Helper to create a single snake with unique colors
  const createSingleSnake = useCallback(() => {
    const bodyColor = getHighContrastColor([BACKGROUND_COLOR], 120);
    let headColor = getHighContrastColor([BACKGROUND_COLOR, bodyColor], 120);
    while (headColor === bodyColor) {
      headColor = getHighContrastColor([BACKGROUND_COLOR, bodyColor], 120);
    }
    return [
      {
        body: Array.from(
          { length: 5 },
          (_, j) =>
            [Math.floor(gridSize / 2) - j, Math.floor(gridSize / 2)] as [
              number,
              number
            ]
        ),
        dir: [1, 0] as Direction,
        alive: true,
        bodyColor,
        headColor,
        justSpawned: true,
      },
    ];
  }, [gridSize]);

  // Helper to get all occupied cells
  const getOccupiedCells = (
    snakesArr: { body: [number, number][] }[]
  ): Set<string> =>
    new Set(
      snakesArr.flatMap((s) =>
        (s.body as [number, number][]).map(([x, y]) => `${x},${y}`)
      )
    );

  // Helper to spawn apples with unique chord qualities and shapes
  const spawnUniqueApples = useCallback(
    (
      count: number,
      snakesArr: { body: [number, number][] }[]
    ): [number, number, string, string, string][] => {
      const occupied = getOccupiedCells(snakesArr);
      const apples: [number, number, string, string, string][] = [];
      let tries = 0;
      // Generate random apple properties
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
      // Gather all snake heads
      const snakeHeads = snakesArr.map((s) => s.body[0] as [number, number]);
      for (let i = 0; i < count; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        while (tries < 1000) {
          const x = Math.floor(Math.random() * gridSize);
          const y = Math.floor(Math.random() * gridSize);
          // New rule: apple cannot spawn within 10 cells (Manhattan distance) of any snake head
          const tooCloseToHead = snakeHeads.some(
            ([hx, hy]) => Math.abs(hx - x) + Math.abs(hy - y) < 10
          );
          if (
            x >= 0 &&
            x < gridSize &&
            y >= 0 &&
            y < gridSize &&
            !occupied.has(`${x},${y}`) &&
            !apples.some(([ax, ay]) => ax === x && ay === y) &&
            !tooCloseToHead
          ) {
            apples.push([x, y, color, "", shape]);
            break;
          }
          tries++;
        }
      }
      return apples;
    },
    [gridSize]
  );

  const handleCellClick = (x: number, y: number) => {
    setGameState((prev) => {
      // Don't spawn if cell is occupied by any snake
      const occupied = prev.snakes.some((s) =>
        s.body.some(([sx, sy]) => sx === x && sy === y)
      );
      if (occupied) return prev;

      const usedColors = prev.snakes.flatMap((s) => [s.bodyColor, s.headColor]);
      const bodyColor = getHighContrastColor(
        [BACKGROUND_COLOR, ...usedColors],
        120
      );
      let headColor = getHighContrastColor(
        [BACKGROUND_COLOR, ...usedColors, bodyColor],
        120
      );
      while (headColor === bodyColor) {
        headColor = getHighContrastColor(
          [BACKGROUND_COLOR, ...usedColors, bodyColor],
          120
        );
      }
      // Default direction: right
      const dir: [number, number] = [1, 0];
      // Default length: 5
      const body: [number, number][] = Array.from({ length: 5 }, (_, j) => [
        x - j,
        y,
      ]);
      // Don't spawn if any part of the new snake would be out of bounds or overlap another snake
      if (
        body.some(
          ([bx, by]) =>
            bx < 0 ||
            bx >= gridSize ||
            by < 0 ||
            by >= gridSize ||
            prev.snakes.some((s) =>
              s.body.some(([sx, sy]) => sx === bx && sy === by)
            )
        )
      ) {
        return prev;
      }
      const newSnake = {
        body,
        dir,
        alive: true,
        bodyColor,
        headColor,
        justSpawned: true,
      };
      return { ...prev, snakes: [...prev.snakes, newSnake] };
    });
  };

  // On mount and reset, use spawnUniqueApples
  useEffect(() => {
    setHasMounted(true);
    let allTimeLongest = 0;
    try {
      const stored = localStorage.getItem("longestSnakeLength");
      if (stored) allTimeLongest = Number(stored);
    } catch (e) {
      console.error(e);
    }
    const newSnakes = createSingleSnake();
    setGameState((prev) => ({
      ...prev,
      snakes: newSnakes,
      apples: spawnUniqueApples(800, newSnakes),
      longestSnakeLength: 5,
      allTimeLongest,
    }));
  }, [createSingleSnake, spawnUniqueApples]);

  const handleReset = async () => {
    const newSnakes = createSingleSnake();
    setGameState((prev) => ({
      ...prev,
      snakes: newSnakes,
      apples: spawnUniqueApples(95, newSnakes),
      longestSnakeLength: 5,
    }));
  };

  return {
    gameState,
    setGameState,
    hasMounted,
    setHasMounted,
    createSingleSnake,
    spawnUniqueApples,
    handleReset,
    handleCellClick,
  };
}
