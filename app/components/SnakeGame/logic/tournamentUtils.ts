import {
  aggressivePathfinding,
  cautiousPathfinding,
  randomPathfinding,
  greedyPathfinding,
  edgeHuggerPathfinding,
  centerSeekerPathfinding,
  lazyPathfinding,
  zigzagPathfinding,
} from "../../SnakeGame/logic/snakeLogic";
import { Direction } from "./types";

export const APPLE_SHAPE_POINTS: Record<string, number> = {
  circle: 1,
  x: 2,
  triangle: 3,
  pentagon: 4,
  hexagon: 5,
  square: 6,
  heptagon: 7,
  octagon: 8,
};

export function getOccupiedCells(
  snakesArr: { body: [number, number][] }[]
): Set<string> {
  return new Set(
    snakesArr.flatMap((s) =>
      (s.body as [number, number][]).map(([x, y]) => `${x},${y}`)
    )
  );
}

// --- Snake Personalities ---
// Each function returns a direction for the snake
export const SNAKE_PERSONALITIES: Record<
  string,
  (
    snake: [number, number][],
    apples: [number, number][],
    currentDir: Direction,
    allSnakes: [number, number][][],
    gridSize: number
  ) => Direction
> = {
  Cobra: aggressivePathfinding,
  Viper: cautiousPathfinding,
  Python: randomPathfinding,
  Mamba: greedyPathfinding,
  Boa: edgeHuggerPathfinding,
  Adder: centerSeekerPathfinding,
  Taipan: lazyPathfinding,
  Krait: zigzagPathfinding,
};
