import React from "react";
export default function AppleHexagon({
  size = 32,
  color = "#e74c3c",
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
      <polygon
        points="4,2 12,2 16,8 12,14 4,14 0,8"
        fill={color}
        stroke="#2d2d2d"
        strokeWidth={1.5}
      />
    </svg>
  );
}
