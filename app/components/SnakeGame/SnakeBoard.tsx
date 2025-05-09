import React from "react";
import { Snake } from "./types";

interface SnakeBoardProps {
  snakes: Snake[];
  apples: [number, number, string][];
  cellSize: number;
  gridSize: number;
  fadingSnakes: number[];
  onCellClick: (x: number, y: number) => void;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
}

export const SnakeBoard: React.FC<SnakeBoardProps> = ({
  snakes,
  apples,
  cellSize,
  gridSize,
  fadingSnakes,
  onCellClick,
  onPointerDown,
  onPointerUp,
}) => {
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
          onClick={() => onCellClick(x, y)}
          style={{ cursor: "pointer" }}
        />
      );
    }
  }

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${cellSize * gridSize} ${cellSize * gridSize}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full mx-auto md:mx-0"
      preserveAspectRatio="xMidYMid meet"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
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
        {/* Apple gradient (not used for colored apples) */}
        <radialGradient id="apple3D" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#ef4444" stopOpacity="1" />
          <stop offset="100%" stopColor="#991b1b" stopOpacity="1" />
        </radialGradient>
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
      {/* Render apples with their color */}
      {apples.map(([ax, ay, color], i) => (
        <rect
          key={`apple-${i}`}
          x={ax * cellSize}
          y={ay * cellSize}
          width={cellSize}
          height={cellSize}
          fill={color}
          stroke="#b91c1c"
          strokeWidth={2}
          rx={cellSize / 3}
          opacity={0.9}
          filter="url(#shadow)"
        />
      ))}
      {/* Render snakes with 3D gradients and shadow */}
      {snakes.map((snake, sidx) =>
        snake.body.map(([x, y], i) => (
          <rect
            key={`snake-${sidx}-${i}`}
            x={x * cellSize}
            y={y * cellSize}
            width={cellSize}
            height={cellSize}
            fill={i === 0 ? snake.headColor : snake.bodyColor}
            stroke="#222"
            strokeWidth={2.5}
            rx={cellSize / 4}
            opacity={fadingSnakes.includes(sidx) ? 0 : 0.88}
            className={fadingSnakes.includes(sidx) ? "snake-fade-out" : ""}
            style={{ transition: "opacity 0.7s" }}
            filter="url(#shadow)"
          />
        ))
      )}
    </svg>
  );
};
