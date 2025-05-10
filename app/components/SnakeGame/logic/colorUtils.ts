// Color utility functions for SnakeGame

export function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(hex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function colorDistance(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

export function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function getHighContrastColor(
  exclude: string[] = [],
  minDist = 100
): string {
  let color: string;
  let tries = 0;
  do {
    color = getRandomColor();
    tries++;
  } while (
    (exclude.some((ex) => colorDistance(color, ex) < minDist) ||
      color === "#FFFFFF" ||
      color === "#fff" ||
      color === "#000000" ||
      color === "#000") &&
    tries < 100
  );
  return color;
}

export function getRandomPatternColor(existing: string[]): string {
  let color: string;
  let tries = 0;
  do {
    color = getRandomColor();
    tries++;
  } while (
    (existing.includes(color) || colorDistance(color, "#f3f4f6") < 100) &&
    tries < 100
  );
  return color;
}
