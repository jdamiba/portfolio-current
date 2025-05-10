import React from "react";
export default function AppleHeptagon({
  size = 32,
  color = "#e74c3c",
}: {
  size?: number;
  color?: string;
}) {
  // Approximate heptagon points for 16x16 viewBox
  const points = "8,2 3,4 1,9 4,14 8,15 12,14 15,9 13,4";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      style={{ imageRendering: "pixelated" }}
    >
      <polygon
        points={points}
        fill={color}
        stroke="#2d2d2d"
        strokeWidth={1.5}
      />
    </svg>
  );
}
