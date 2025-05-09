// Handler functions for SnakeGame
import { Snake, Direction } from "./types";
import React from "react";

interface HandleCellClickArgs {
  snakes: Snake[];
  setSnakes: React.Dispatch<React.SetStateAction<Snake[]>>;
  spawnMode: string;
  gridSize: number;
  getRandomApple: (
    forbidden: [number, number][],
    gridSize: number
  ) => [number, number];
  getHighContrastColor: (exclude: string[], minDistance: number) => string;
  BACKGROUND_COLOR: string;
}

interface HandleGridPointerDownArgs {
  autoplay: boolean;
  showCountdown: boolean;
  lastTouchRef: React.MutableRefObject<{ x: number; y: number } | null>;
}

interface HandleGridPointerUpArgs {
  autoplay: boolean;
  showCountdown: boolean;
  lastTouchRef: React.MutableRefObject<{ x: number; y: number } | null>;
  setManualDir: React.Dispatch<React.SetStateAction<Direction>>;
}

interface KeyboardHandlerArgs {
  setManualDir: React.Dispatch<React.SetStateAction<Direction>>;
}

export function createHandleCellClick({
  setSnakes,
  spawnMode,
  getHighContrastColor,
  BACKGROUND_COLOR,
}: HandleCellClickArgs) {
  return function handleCellClick(x: number, y: number) {
    if (spawnMode === "snake") {
      setSnakes((prev: Snake[]) => {
        // Build the intended new snake body
        const body: [number, number][] = [[x, y]];
        if (
          x > 0 &&
          !prev.some((snake) =>
            snake.body.some(([sx, sy]) => sx === x - 1 && sy === y)
          )
        ) {
          body.push([x - 1, y]);
        }
        // Check against the latest state for any overlap
        const occupied = new Set<string>();
        for (const snake of prev) {
          for (const [sx, sy] of snake.body) {
            occupied.add(`${sx},${sy}`);
          }
        }
        if (body.some(([bx, by]) => occupied.has(`${bx},${by}`))) {
          return prev; // Do not spawn if any segment is occupied
        }
        return [
          ...prev,
          (() => {
            const bodyColor = getHighContrastColor([BACKGROUND_COLOR], 120);
            const headColor = getHighContrastColor(
              [BACKGROUND_COLOR, bodyColor],
              120
            );
            return {
              body,
              dir: [1, 0] as Direction,
              alive: true,
              bodyColor,
              headColor,
            };
          })(),
        ];
      });
    }
    // ...apple spawn mode logic can be added here if needed...
  };
}

export function createHandleGridPointerDown({
  autoplay,
  showCountdown,
  lastTouchRef,
}: HandleGridPointerDownArgs) {
  return function handleGridPointerDown(e: React.PointerEvent) {
    if (autoplay || showCountdown) return;
    const rect = (e.target as SVGElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    lastTouchRef.current = { x, y };
  };
}

export function createHandleGridPointerUp({
  autoplay,
  showCountdown,
  lastTouchRef,
  setManualDir,
}: HandleGridPointerUpArgs) {
  return function handleGridPointerUp(e: React.PointerEvent) {
    if (autoplay || showCountdown || !lastTouchRef.current) return;
    const rect = (e.target as SVGElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = x - lastTouchRef.current.x;
    const dy = y - lastTouchRef.current.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      setManualDir(dx > 0 ? [1, 0] : [-1, 0]);
    } else if (Math.abs(dy) > 0) {
      setManualDir(dy > 0 ? [0, 1] : [0, -1]);
    }
    lastTouchRef.current = null;
  };
}

export function createKeyboardHandler({ setManualDir }: KeyboardHandlerArgs) {
  return function handleKeyDown(e: KeyboardEvent) {
    let dir: [number, number] | null = null;
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") dir = [0, -1];
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") dir = [0, 1];
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") dir = [-1, 0];
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") dir = [1, 0];
    if (dir) setManualDir(dir);
  };
}
