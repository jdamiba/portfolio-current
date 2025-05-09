import { Direction, Apple } from "./types";

export function getRandomApple(
  forbidden: number[][], // all forbidden positions (snake bodies, apples, just-eaten apple)
  gridSize: number
): Apple {
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

function bfsPath(
  start: number[],
  goal: number[],
  forbidden: Set<string>,
  gridSize: number
): boolean {
  // Returns true if a path exists from start to goal
  const queue = [start];
  const visited = new Set<string>([`${start[0]},${start[1]}`]);
  const dirs = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];
  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    if (x === goal[0] && y === goal[1]) return true;
    for (const [dx, dy] of dirs) {
      const nx = x + dx,
        ny = y + dy;
      const key = `${nx},${ny}`;
      if (
        nx >= 0 &&
        nx < gridSize &&
        ny >= 0 &&
        ny < gridSize &&
        !forbidden.has(key) &&
        !visited.has(key)
      ) {
        visited.add(key);
        queue.push([nx, ny]);
      }
    }
  }
  return false;
}

function canReachTail(snake: number[][], gridSize: number): boolean {
  // Simulate the snake's body after moving (head is at index 0, tail is last)
  // The tail will move forward unless the snake eats an apple, so we allow the head to move into the current tail position
  const forbidden = new Set<string>(
    snake.slice(0, -1).map(([x, y]) => `${x},${y}`)
  );
  const head = snake[0];
  const tail = snake[snake.length - 1];
  return bfsPath(head, tail, forbidden, gridSize);
}

export function getNextDirection(
  snake: number[][],
  apple: Apple,
  currentDir: Direction,
  allSnakes: number[][][],
  walls: number[][],
  gridSize: number
): Direction {
  const head = snake[0];
  const [ax, ay] = apple;
  const [hx, hy] = head;
  const possibleDirs: Direction[] = [
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
  let foundPath: number[][] | null = null;
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
        const fullPath = path.map((p) => p.split(",").map(Number));
        foundPath = fullPath;
        break;
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

  // If a path to the apple was found, check if it's safe (can reach tail after eating)
  if (foundPath && foundPath.length > 1) {
    // Simulate the snake after following the first step toward the apple
    const [nx, ny] = foundPath[1];
    const newHead = [nx, ny];
    let newBody = [newHead, ...snake];
    // If the new head is on the apple, grow; otherwise, remove tail
    if (nx === ax && ny === ay) {
      // Grows, do not remove tail
    } else {
      newBody = newBody.slice(0, -1);
    }
    if (canReachTail(newBody, gridSize)) {
      // Safe to move toward apple
      return [nx - head[0], ny - head[1]] as Direction;
    }
    // Otherwise, fall through to safe move selection
  }

  // If no safe path to apple, follow the tail if possible
  const safeDirs = dirs.filter(([mx, my]) => {
    const [nx, ny] = [hx + mx, hy + my];
    if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize) return false;
    if (forbidden.has(`${nx},${ny}`)) return false;
    // Simulate move
    let newBody = [[nx, ny], ...snake];
    newBody = newBody.slice(0, -1);
    return canReachTail(newBody, gridSize);
  });
  if (safeDirs.length > 0) {
    // Pick randomly among safeDirs
    return safeDirs[Math.floor(Math.random() * safeDirs.length)];
  }

  // If no safe moves, fallback to any available move
  const fallbackDirs = dirs.filter(([mx, my]) => {
    const [nx, ny] = [hx + mx, hy + my];
    if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize) return false;
    return !forbidden.has(`${nx},${ny}`);
  });
  if (fallbackDirs.length > 0) {
    return fallbackDirs[Math.floor(Math.random() * fallbackDirs.length)];
  }
  // If no safe moves, keep going in the current direction
  return currentDir;
}
