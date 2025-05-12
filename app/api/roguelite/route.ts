import { NextRequest, NextResponse } from "next/server";

// --- Types ---
type RoomType =
  | "standard"
  | "elite"
  | "treasure"
  | "shop"
  | "boss"
  | "event"
  | "rest";

interface MapNode {
  id: string;
  type: RoomType;
  next: string[];
  reward?: string;
}

interface Snake {
  body: [number, number][];
  dir: [number, number];
  alive: boolean;
  bodyColor: string;
  headColor: string;
  growth?: number;
  score?: number;
  bodyColors?: string[];
  seed?: number;
}

interface RogueliteState {
  map: MapNode[];
  currentNodeId: string;
  clearedNodes: string[];
  upgrades: string[];
  snake: Snake;
  apples: [number, number, string, string, string][];
  startTime: number;
  // ...future: currency, meta, etc
}

const SNAKE_PALETTES = [
  {
    name: "Garter Snake",
    head: "#3a5d23",
    body: ["#6fcf3a", "#3a5d23", "#e2c275"],
  },
  {
    name: "Corn Snake",
    head: "#b7410e",
    body: ["#e25822", "#f6e27a", "#b7410e"],
  },
  {
    name: "Ball Python",
    head: "#3b2f1c",
    body: ["#e2c275", "#3b2f1c", "#a67c52"],
  },
  { name: "King Snake", head: "#22223b", body: ["#fff", "#22223b", "#e63946"] },
  {
    name: "Green Tree Python",
    head: "#2e8b57",
    body: ["#a3e635", "#2e8b57", "#fff"],
  },
  { name: "Milk Snake", head: "#b22222", body: ["#fff", "#b22222", "#22223b"] },
  {
    name: "Boa Constrictor",
    head: "#8b5e3c",
    body: ["#e2c275", "#8b5e3c", "#fff"],
  },
  { name: "Black Mamba", head: "#222", body: ["#222", "#888", "#bbb"] },
];

const APPLE_SHAPE_POINTS: Record<string, number> = {
  circle: 1,
  x: 2,
  triangle: 3,
  pentagon: 4,
  hexagon: 5,
  square: 6,
  heptagon: 7,
  octagon: 8,
};

function getApplePoints(shape: string) {
  return APPLE_SHAPE_POINTS[shape] || 1;
}

function randomApples(
  count: number,
  gridSize: number,
  snakeBody: [number, number][]
) {
  const apples: [number, number, string, string, string][] = [];
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
  const occupied = new Set(snakeBody.map(([x, y]) => `${x},${y}`));
  while (apples.length < count) {
    const ax = Math.floor(Math.random() * gridSize);
    const ay = Math.floor(Math.random() * gridSize);
    if (
      !occupied.has(`${ax},${ay}`) &&
      !apples.some(([x, y]) => x === ax && y === ay)
    ) {
      apples.push([
        ax,
        ay,
        colors[Math.floor(Math.random() * colors.length)],
        "",
        shapes[Math.floor(Math.random() * shapes.length)],
      ]);
    }
  }
  return apples;
}

// --- In-memory state (for demo; replace with session/db for real use) ---
let gameState: RogueliteState | null = null;

function bfsPath(
  start: [number, number],
  goal: [number, number],
  occupied: Set<string>,
  gridSize: number
): [number, number][] | null {
  const queue: { pos: [number, number]; path: [number, number][] }[] = [
    { pos: start, path: [] },
  ];
  const visited = new Set<string>();
  visited.add(`${start[0]},${start[1]}`);
  const directions: [number, number][] = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  while (queue.length > 0) {
    const { pos, path } = queue.shift()!;
    if (pos[0] === goal[0] && pos[1] === goal[1]) {
      return path;
    }
    for (const [dx, dy] of directions) {
      const nx = pos[0] + dx;
      const ny = pos[1] + dy;
      if (
        nx < 0 ||
        nx >= gridSize ||
        ny < 0 ||
        ny >= gridSize ||
        occupied.has(`${nx},${ny}`) ||
        visited.has(`${nx},${ny}`)
      ) {
        continue;
      }
      visited.add(`${nx},${ny}`);
      queue.push({ pos: [nx, ny], path: [...path, [dx, dy]] });
    }
  }
  return null;
}

function getNextDirection(
  snake: Snake,
  apples: [number, number, string, string, string][],
  gridSize: number
): [number, number] {
  const head = snake.body[0];
  const tail = snake.body[snake.body.length - 1];
  const occupied = new Set(
    snake.body.slice(0, -1).map(([x, y]) => `${x},${y}`)
  );

  // 1. Try to go for the closest apple if safe
  let minDist = Infinity;
  let targetApple: [number, number] | null = null;
  for (const apple of apples) {
    const ax = apple[0];
    const ay = apple[1];
    const dist = Math.abs(ax - head[0]) + Math.abs(ay - head[1]);
    if (dist < minDist) {
      minDist = dist;
      targetApple = [ax, ay];
    }
  }
  if (targetApple) {
    // Path from head to apple
    const pathToApple = bfsPath(head, targetApple, occupied, gridSize);
    if (pathToApple && pathToApple.length > 0) {
      // Simulate eating the apple: new head at apple, body grows by 1
      const newBody = [targetApple, ...snake.body];
      // Remove tail for occupancy (simulate growth)
      // (if you want to simulate growth only when eating, you can adjust this logic)
      const newOccupied = new Set(
        newBody.slice(0, -1).map(([x, y]) => `${x},${y}`)
      );
      // After eating apple, can we reach the new tail?
      const newTail = newBody[newBody.length - 1];
      const pathAfterApple = bfsPath(
        targetApple,
        newTail,
        newOccupied,
        gridSize
      );
      if (pathAfterApple) {
        // Go for apple!
        const [dx, dy] = pathToApple[0];
        // Prevent reversing direction
        const currentDir = snake.dir;
        const oppositeDir: [number, number] = [-currentDir[0], -currentDir[1]];
        if (dx === oppositeDir[0] && dy === oppositeDir[1]) {
          return currentDir;
        }
        return [dx, dy];
      }
    }
  }

  // 2. Otherwise, follow the tail
  const pathToTail = bfsPath(head, tail, occupied, gridSize);
  if (pathToTail && pathToTail.length > 0) {
    const [dx, dy] = pathToTail[0];
    const currentDir = snake.dir;
    const oppositeDir: [number, number] = [-currentDir[0], -currentDir[1]];
    if (dx === oppositeDir[0] && dy === oppositeDir[1]) {
      return currentDir;
    }
    return [dx, dy];
  }
  // If no path found, keep going straight
  return snake.dir;
}

// --- API Handler ---
export async function POST(req: NextRequest) {
  const body = await req.json();
  const action = body.action;

  if (action === "start") {
    // Start a new game
    const gridSize = body.gridSize || 36;
    const palette = SNAKE_PALETTES[0];
    const bodyArr = Array.from(
      { length: 5 },
      (_, j) =>
        [Math.floor(gridSize / 2) - j, Math.floor(gridSize / 2)] as [
          number,
          number
        ]
    );
    const bodyColors = Array.from(
      { length: bodyArr.length },
      (_, i) => palette.body[i % palette.body.length]
    );
    const apples = randomApples(20, gridSize, bodyArr); // 20 apples per round
    gameState = {
      map: [], // not used in roguelite
      currentNodeId: "",
      clearedNodes: [],
      upgrades: [],
      snake: {
        body: bodyArr,
        dir: [1, 0],
        alive: true,
        bodyColor: palette.body[0],
        headColor: palette.head,
        growth: 0,
        score: 0,
        bodyColors,
        seed: 1,
      },
      apples,
      startTime: Date.now(), // Add start time for timer
    };
    return NextResponse.json(gameState);
  }

  if (!gameState) {
    return NextResponse.json({ error: "No game in progress" }, { status: 400 });
  }

  if (action === "choose-upgrade") {
    if (body.upgradeKey && !gameState.upgrades.includes(body.upgradeKey)) {
      gameState.upgrades.push(body.upgradeKey);
    }
    return NextResponse.json(gameState);
  }

  if (action === "choose-room") {
    // Advance to next room, reset snake/apples
    const gridSize = body.gridSize || 36;
    const palette = SNAKE_PALETTES[0];
    const bodyArr = Array.from(
      { length: 5 },
      (_, j) =>
        [Math.floor(gridSize / 2) - j, Math.floor(gridSize / 2)] as [
          number,
          number
        ]
    );
    const bodyColors = Array.from(
      { length: bodyArr.length },
      (_, i) => palette.body[i % palette.body.length]
    );
    let appleCount = 10;
    const nextNode = gameState.map.find((n) => n.id === body.nextRoomId);
    if (nextNode?.type === "treasure") appleCount = 20;
    if (nextNode?.type === "elite") appleCount = 15;
    if (nextNode?.type === "boss") appleCount = 5;
    const apples = randomApples(appleCount, gridSize, bodyArr);
    gameState.currentNodeId = body.nextRoomId;
    gameState.clearedNodes.push(body.prevRoomId);
    gameState.snake = {
      body: bodyArr,
      dir: [1, 0],
      alive: true,
      bodyColor: palette.body[0],
      headColor: palette.head,
      growth: 0,
      score: 0,
      bodyColors,
      seed: 1,
    };
    gameState.apples = apples;
    return NextResponse.json(gameState);
  }

  if (action === "tick") {
    const gridSize = body.gridSize || 36;
    // Always use backend pathfinding for autoplay
    const dir: [number, number] = getNextDirection(
      gameState.snake,
      gameState.apples,
      gridSize
    );
    const snake = { ...gameState.snake };
    // TIMER: End round after 30 seconds
    const now = Date.now();
    let timeLeft = 30;
    if (gameState.startTime) {
      timeLeft = Math.max(
        0,
        30 - Math.floor((now - gameState.startTime) / 1000)
      );
    }
    console.log("[TICK]", {
      now,
      startTime: gameState.startTime,
      timeLeft,
      snakeAlive: snake.alive,
      apples: gameState.apples.length,
    });
    if (timeLeft <= 0) {
      console.log("[END] Timer expired, ending round.");
      snake.alive = false;
      gameState.snake = snake;
      return NextResponse.json({ ...gameState, timeLeft });
    }
    if (!snake.alive) {
      console.log("[END] Snake already dead.");
      return NextResponse.json({ ...gameState, timeLeft });
    }
    const head = snake.body[0];
    const [dx, dy] = dir;
    const [x, y] = [head[0] + dx, head[1] + dy];
    // Wall collision
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
      console.log("[END] Wall collision", { x, y, gridSize });
      snake.alive = false;
      gameState.snake = snake;
      return NextResponse.json({ ...gameState, timeLeft });
    }
    // Correct self-collision check: ignore tail if not growing
    const bodyToCheck =
      (snake.growth ?? 0) > 0 ? snake.body : snake.body.slice(0, -1);
    if (bodyToCheck.some(([sx, sy]) => sx === x && sy === y)) {
      console.log("[END] Self-collision", { x, y });
      snake.alive = false;
      gameState.snake = snake;
      return NextResponse.json({ ...gameState, timeLeft });
    }
    // Apple eating
    let pointsGained = 0;
    const eatenAppleIdx = gameState.apples.findIndex(
      ([ax, ay]) => ax === x && ay === y
    );
    let newGrowth = snake.growth || 0;
    let newApples = gameState.apples;
    let newScore = snake.score || 0;
    let newBodyColors = snake.bodyColors
      ? [...snake.bodyColors]
      : Array(snake.body.length).fill(snake.bodyColor);
    let appleEaten = false;
    if (eatenAppleIdx !== -1) {
      const eatenApple = gameState.apples[eatenAppleIdx];
      const shape = eatenApple[4] || "circle";
      pointsGained = getApplePoints(shape);
      newScore += pointsGained;
      newGrowth += gameState.upgrades.includes("lengthPlusOne") ? 2 : 1;
      newApples = gameState.apples.filter((_, idx) => idx !== eatenAppleIdx);
      newBodyColors[newBodyColors.length - 1] =
        eatenApple[2] || snake.bodyColor;
      appleEaten = true;
    }
    let newBody: [number, number][];
    if (newGrowth > 0) {
      newBody = [[x, y], ...snake.body];
      newGrowth--;
      newBodyColors = [
        SNAKE_PALETTES[0].body[
          newBodyColors.length % SNAKE_PALETTES[0].body.length
        ],
        ...newBodyColors,
      ];
    } else {
      newBody = [[x, y], ...snake.body].slice(0, -1) as [number, number][];
      newBodyColors = [
        SNAKE_PALETTES[0].body[
          newBodyColors.length % SNAKE_PALETTES[0].body.length
        ],
        ...newBodyColors,
      ].slice(0, -1);
    }
    // If an apple was eaten, spawn a new one at a random empty location
    if (appleEaten && newApples.length < 20) {
      const occupied = new Set(newBody.map(([x, y]) => `${x},${y}`));
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
      let tries = 0;
      while (tries < 1000) {
        const ax = Math.floor(Math.random() * gridSize);
        const ay = Math.floor(Math.random() * gridSize);
        if (
          !occupied.has(`${ax},${ay}`) &&
          !newApples.some(([ex, ey]) => ex === ax && ey === ay)
        ) {
          newApples.push([
            ax,
            ay,
            colors[Math.floor(Math.random() * colors.length)],
            "",
            shapes[Math.floor(Math.random() * shapes.length)],
          ]);
          break;
        }
        tries++;
      }
    }
    gameState.snake = {
      ...snake,
      body: newBody,
      dir,
      growth: newGrowth,
      score: newScore,
      bodyColors: newBodyColors,
    };
    gameState.apples = newApples;
    return NextResponse.json({ ...gameState, timeLeft });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 404 });
}
