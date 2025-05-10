import React from "react";
export default function AppleX({
  size = 32,
  color = "#0074D9",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      style={{ imageRendering: "pixelated" }}
    >
      <g transform="rotate(45 8 8)">
        <rect
          x="7"
          y="2"
          width="2"
          height="12"
          fill={color}
          stroke="#2d2d2d"
          strokeWidth={1.1}
        />
        <rect
          x="2"
          y="7"
          width="12"
          height="2"
          fill={color}
          stroke="#2d2d2d"
          strokeWidth={1.1}
        />
      </g>
    </svg>
  );
}
