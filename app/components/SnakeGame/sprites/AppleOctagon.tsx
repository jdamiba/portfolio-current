import React from "react";
export default function AppleOctagon({
  size = 32,
  color = "#e74c3c",
}: {
  size?: number;
  color?: string;
}) {
  // Approximate octagon points for 16x16 viewBox
  const points = "5,2 11,2 14,5 14,11 11,14 5,14 2,11 2,5";
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
