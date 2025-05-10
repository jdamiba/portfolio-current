import React from "react";
export default function SnakeBodyClassic({
  size = 32,
  color = "#6fcf3a",
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
      <rect x="1" y="1" width="14" height="14" fill="#2d2d2d" />
      <rect x="2" y="2" width="12" height="12" fill={color} />
      <rect x="2" y="2" width="12" height="3" fill="#a3e635" />
      <rect x="2" y="11" width="12" height="3" fill="#3a5d23" />
      <rect x="7" y="7" width="2" height="4" fill="#a3e635" />
    </svg>
  );
}
