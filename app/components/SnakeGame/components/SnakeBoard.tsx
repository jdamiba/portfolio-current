import React from "react";
import { Snake } from "../logic/types";
import AppleTriangle from "../sprites/AppleTriangle";
import ApplePentagon from "../sprites/ApplePentagon";
import AppleHexagon from "../sprites/AppleHexagon";
import AppleHeptagon from "../sprites/AppleHeptagon";
import AppleOctagon from "../sprites/AppleOctagon";
import AppleStar from "../sprites/AppleStar";

interface SnakeBoardProps {
  snakes: Snake[];
  apples: [number, number, string, string, string][];
  cellSize: number;
  gridSize: number;
}

export const SnakeBoard: React.FC<SnakeBoardProps> = ({
  snakes,
  apples,
  cellSize,
  gridSize,
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
          style={{ cursor: "default" }}
        />
        // To use a background tile, replace the <rect> above with:
        // <foreignObject
        //   key={`tile-${x}-${y}`}
        //   x={x * cellSize}
        //   y={y * cellSize}
        //   width={cellSize}
        //   height={cellSize}
        // >
        //   <DirtTile size={cellSize} />
        // </foreignObject>
      );
    }
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: cellSize * gridSize,
        position: "relative",
      }}
    >
      <svg
        width="100%"
        height={cellSize * gridSize}
        viewBox={`0 0 ${cellSize * gridSize} ${cellSize * gridSize}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full mx-auto md:mx-0"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
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
        {/* Render apples as SVG pixel art */}
        {apples.map(([ax, ay, color, , shape], i) => {
          if (ax < 0 || ax >= gridSize || ay < 0 || ay >= gridSize) {
            console.warn("Apple out of bounds:", ax, ay, color, shape);
            return null;
          }
          return (
            <foreignObject
              key={`apple-${i}`}
              x={ax * cellSize}
              y={ay * cellSize}
              width={cellSize}
              height={cellSize}
              style={{ pointerEvents: "none" }}
            >
              {shape === "square" && (
                <AppleStar size={cellSize} color={color} />
              )}
              {shape === "triangle" && (
                <AppleTriangle size={cellSize} color={color} />
              )}
              {shape === "pentagon" && (
                <ApplePentagon size={cellSize} color={color} />
              )}
              {shape === "hexagon" && (
                <AppleHexagon size={cellSize} color={color} />
              )}
              {shape === "heptagon" && (
                <AppleHeptagon size={cellSize} color={color} />
              )}
              {shape === "octagon" && (
                <AppleOctagon size={cellSize} color={color} />
              )}
              {shape === "star" && <AppleStar size={cellSize} color={color} />}
            </foreignObject>
          );
        })}
        {/* Render snakes as SVG pixel art */}
        {snakes.map((snake, sidx) =>
          snake.body.map(([x, y], i) => (
            <rect
              key={`snake-${sidx}-${i}`}
              x={x * cellSize}
              y={y * cellSize}
              width={cellSize}
              height={cellSize}
              fill={i === 0 ? snake.headColor : snake.bodyColor}
              opacity={1}
              style={{ pointerEvents: "none" }}
            />
          ))
        )}
      </svg>
    </div>
  );
};
