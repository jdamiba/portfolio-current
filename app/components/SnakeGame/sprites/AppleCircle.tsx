import React from "react";
export default function AppleCircle({
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
      <circle cx="8" cy="8" r="7" fill="#2d2d2d" />
      <circle cx="8" cy="8" r="5" fill={color} />
      <rect x="7" y="2" width="2" height="2" fill="#2ecc40" />
      <rect x="8" y="3" width="1" height="2" fill="#7c4a03" />
    </svg>
  );
}
