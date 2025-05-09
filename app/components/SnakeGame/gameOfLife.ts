// Game of Life logic and pattern helpers for SnakeGame

import { getRandomPatternColor } from "./colorUtils";

export function getAliveCells(
  grid: (string | null)[][]
): [number, number, string][] {
  const cells: [number, number, string][] = [];
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      if (grid[x][y]) cells.push([x, y, grid[x][y] as string]);
    }
  }
  return cells;
}

export function nextLifeGrid(
  grid: (string | null)[][],
  forbidden: Set<string>
): (string | null)[][] {
  const size = grid.length;
  const next: (string | null)[][] = Array.from({ length: size }, () =>
    Array(size).fill(null)
  );
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      if (forbidden.has(`${x},${y}`)) {
        next[x][y] = null;
        continue;
      }
      let neighbors = 0;
      const neighborColors: string[] = [];
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx,
            ny = y + dy;
          if (nx >= 0 && nx < size && ny >= 0 && ny < size && grid[nx][ny]) {
            neighbors++;
            neighborColors.push(grid[nx][ny] as string);
          }
        }
      }
      if (grid[x][y]) {
        if (neighbors === 2 || neighbors === 3) {
          next[x][y] = grid[x][y];
        } else {
          next[x][y] = null;
        }
      } else {
        if (neighbors === 3) {
          const colorCounts: Record<string, number> = {};
          for (const c of neighborColors)
            colorCounts[c] = (colorCounts[c] || 0) + 1;
          let maxColor = neighborColors[0];
          let maxCount = 0;
          for (const c in colorCounts) {
            if (colorCounts[c] > maxCount) {
              maxColor = c;
              maxCount = colorCounts[c];
            }
          }
          next[x][y] = maxColor;
        } else {
          next[x][y] = null;
        }
      }
    }
  }
  return next;
}

export function placeGliderColored(
  grid: (string | null)[][],
  x: number,
  y: number,
  color: string
) {
  if (x + 2 < grid.length && y + 2 < grid[0].length) {
    grid[x][y + 1] = color;
    grid[x + 1][y + 2] = color;
    grid[x + 2][y] = color;
    grid[x + 2][y + 1] = color;
    grid[x + 2][y + 2] = color;
  }
}

export function placeLWSSColored(
  grid: (string | null)[][],
  x: number,
  y: number,
  color: string
) {
  if (x + 3 < grid.length && y + 4 < grid[0].length) {
    grid[x][y + 1] = color;
    grid[x][y + 2] = color;
    grid[x][y + 3] = color;
    grid[x][y + 4] = color;
    grid[x + 1][y] = color;
    grid[x + 1][y + 4] = color;
    grid[x + 2][y + 4] = color;
    grid[x + 3][y] = color;
    grid[x + 3][y + 3] = color;
  }
}

export function placeMWSSColored(
  grid: (string | null)[][],
  x: number,
  y: number,
  color: string
) {
  if (x + 3 < grid.length && y + 5 < grid[0].length) {
    grid[x][y + 1] = color;
    grid[x][y + 2] = color;
    grid[x][y + 3] = color;
    grid[x][y + 4] = color;
    grid[x][y + 5] = color;
    grid[x + 1][y] = color;
    grid[x + 1][y + 5] = color;
    grid[x + 2][y + 5] = color;
    grid[x + 3][y] = color;
    grid[x + 3][y + 4] = color;
  }
}

export function placeHWSSColored(
  grid: (string | null)[][],
  x: number,
  y: number,
  color: string
) {
  if (x + 3 < grid.length && y + 6 < grid[0].length) {
    grid[x][y + 1] = color;
    grid[x][y + 2] = color;
    grid[x][y + 3] = color;
    grid[x][y + 4] = color;
    grid[x][y + 5] = color;
    grid[x][y + 6] = color;
    grid[x + 1][y] = color;
    grid[x + 1][y + 6] = color;
    grid[x + 2][y + 6] = color;
    grid[x + 3][y] = color;
    grid[x + 3][y + 5] = color;
  }
}

export function placeGliderGunColored(
  grid: (string | null)[][],
  x: number,
  y: number,
  color: string
) {
  const gun = [
    [0, 24],
    [1, 22],
    [1, 24],
    [2, 12],
    [2, 13],
    [2, 20],
    [2, 21],
    [2, 34],
    [2, 35],
    [3, 11],
    [3, 15],
    [3, 20],
    [3, 21],
    [3, 34],
    [3, 35],
    [4, 0],
    [4, 1],
    [4, 10],
    [4, 16],
    [4, 20],
    [4, 21],
    [5, 0],
    [5, 1],
    [5, 10],
    [5, 14],
    [5, 16],
    [5, 17],
    [5, 22],
    [5, 24],
    [6, 10],
    [6, 16],
    [6, 24],
    [7, 11],
    [7, 15],
    [8, 12],
    [8, 13],
  ];
  if (x + 8 < grid.length && y + 35 < grid[0].length) {
    for (const [dx, dy] of gun) {
      grid[x + dx][y + dy] = color;
    }
  }
}

export function createRandomPatternGrid(
  size: number,
  gliderCount: number,
  lwssCount: number,
  mwssCount: number = 2,
  hwssCount: number = 2,
  gunCount: number = 1
): (string | null)[][] {
  const grid = Array.from({ length: size }, () => Array(size).fill(null));
  const usedColors: string[] = [];
  const gliderSize = 3;
  const lwssSize = [4, 5];
  const mwssSize = [4, 6];
  const hwssSize = [4, 7];
  const gunSize = [9, 36];
  const positions: { x: number; y: number; type: string; color: string }[] = [];
  let tries = 0;
  // Place gliders
  while (
    positions.filter((p) => p.type === "glider").length < gliderCount &&
    tries < 1000
  ) {
    const x = Math.floor(Math.random() * (size - gliderSize + 1));
    const y = Math.floor(Math.random() * (size - gliderSize + 1));
    let overlap = false;
    for (const p of positions) {
      if (Math.abs(x - p.x) < gliderSize && Math.abs(y - p.y) < gliderSize) {
        overlap = true;
        break;
      }
    }
    if (!overlap) {
      const color = getRandomPatternColor(usedColors);
      usedColors.push(color);
      positions.push({ x, y, type: "glider", color });
      placeGliderColored(grid, x, y, color);
    }
    tries++;
  }
  // Place LWSS
  tries = 0;
  while (
    positions.filter((p) => p.type === "lwss").length < lwssCount &&
    tries < 1000
  ) {
    const x = Math.floor(Math.random() * (size - lwssSize[0] + 1));
    const y = Math.floor(Math.random() * (size - lwssSize[1] + 1));
    let overlap = false;
    for (const p of positions) {
      if (Math.abs(x - p.x) < lwssSize[0] && Math.abs(y - p.y) < lwssSize[1]) {
        overlap = true;
        break;
      }
    }
    if (!overlap) {
      const color = getRandomPatternColor(usedColors);
      usedColors.push(color);
      positions.push({ x, y, type: "lwss", color });
      placeLWSSColored(grid, x, y, color);
    }
    tries++;
  }
  // Place MWSS
  tries = 0;
  while (
    positions.filter((p) => p.type === "mwss").length < mwssCount &&
    tries < 1000
  ) {
    const x = Math.floor(Math.random() * (size - mwssSize[0] + 1));
    const y = Math.floor(Math.random() * (size - mwssSize[1] + 1));
    let overlap = false;
    for (const p of positions) {
      if (Math.abs(x - p.x) < mwssSize[0] && Math.abs(y - p.y) < mwssSize[1]) {
        overlap = true;
        break;
      }
    }
    if (!overlap) {
      const color = getRandomPatternColor(usedColors);
      usedColors.push(color);
      positions.push({ x, y, type: "mwss", color });
      placeMWSSColored(grid, x, y, color);
    }
    tries++;
  }
  // Place HWSS
  tries = 0;
  while (
    positions.filter((p) => p.type === "hwss").length < hwssCount &&
    tries < 1000
  ) {
    const x = Math.floor(Math.random() * (size - hwssSize[0] + 1));
    const y = Math.floor(Math.random() * (size - hwssSize[1] + 1));
    let overlap = false;
    for (const p of positions) {
      if (Math.abs(x - p.x) < hwssSize[0] && Math.abs(y - p.y) < hwssSize[1]) {
        overlap = true;
        break;
      }
    }
    if (!overlap) {
      const color = getRandomPatternColor(usedColors);
      usedColors.push(color);
      positions.push({ x, y, type: "hwss", color });
      placeHWSSColored(grid, x, y, color);
    }
    tries++;
  }
  // Place Glider Guns
  tries = 0;
  while (
    positions.filter((p) => p.type === "gun").length < gunCount &&
    tries < 1000
  ) {
    const x = Math.floor(Math.random() * (size - gunSize[0] + 1));
    const y = Math.floor(Math.random() * (size - gunSize[1] + 1));
    let overlap = false;
    for (const p of positions) {
      if (Math.abs(x - p.x) < gunSize[0] && Math.abs(y - p.y) < gunSize[1]) {
        overlap = true;
        break;
      }
    }
    if (!overlap) {
      const color = getRandomPatternColor(usedColors);
      usedColors.push(color);
      positions.push({ x, y, type: "gun", color });
      placeGliderGunColored(grid, x, y, color);
    }
    tries++;
  }
  return grid;
}
