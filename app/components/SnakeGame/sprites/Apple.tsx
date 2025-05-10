import React from "react";
export default function Apple({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 8 8"
      style={{ imageRendering: "pixelated" }}
    >
      <rect width="8" height="8" fill="#7c2f2f" />
      <rect x="2" y="2" width="4" height="4" fill="#e74c3c" />
      <rect x="3" y="1" width="2" height="1" fill="#2ecc40" />
    </svg>
  );
}
