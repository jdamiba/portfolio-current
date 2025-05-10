import React from "react";
export default function AppleClassic({
  size = 32,
  color = "#e74c3c",
  shape = "square",
}: {
  size?: number;
  color?: string;
  shape?: string;
}) {
  if (shape !== "square") return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="1" y="1" width="14" height="14" fill="#2d2d2d" />
      <rect x="4" y="4" width="8" height="8" fill={color} />
      <rect x="4" y="4" width="8" height="2" fill="#ffb4b4" />
      <rect x="4" y="10" width="8" height="2" fill="#b71c1c" />
      <rect x="7" y="2" width="2" height="2" fill="#2ecc40" />
      <rect x="8" y="3" width="1" height="2" fill="#7c4a03" />
    </svg>
  );
}
