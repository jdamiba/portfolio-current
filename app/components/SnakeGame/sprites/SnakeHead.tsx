import React from "react";
export default function SnakeHead({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 8 8"
      style={{ imageRendering: "pixelated" }}
    >
      <rect width="8" height="8" fill="#3a5d23" />
      <rect x="1" y="1" width="6" height="6" fill="#6fcf3a" />
      <rect x="6" y="3" width="1" height="2" fill="#fff" />
      <rect x="7" y="4" width="1" height="1" fill="#000" />
    </svg>
  );
}
