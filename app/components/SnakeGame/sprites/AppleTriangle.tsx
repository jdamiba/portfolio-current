import React from "react";
export default function AppleTriangle({
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
        points="8,2 2,14 14,14"
        fill={color}
        stroke="#2d2d2d"
        strokeWidth={1.5}
      />
    </svg>
  );
}
