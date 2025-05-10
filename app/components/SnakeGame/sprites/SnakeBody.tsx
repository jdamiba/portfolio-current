import React from "react";
export default function SnakeBody({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 8 8"
      style={{ imageRendering: "pixelated" }}
    >
      <rect width="8" height="8" fill="#3a5d23" />
      <rect x="1" y="1" width="6" height="6" fill="#6fcf3a" />
    </svg>
  );
}
