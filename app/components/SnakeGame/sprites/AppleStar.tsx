import React from "react";
export default function AppleStar({
  size = 32,
  color = "#e74c3c",
}: {
  size?: number;
  color?: string;
}) {
  // 5-pointed star for 16x16 viewBox
  const points =
    "8,2 9.9,6.5 15,6.5 11,10 12.5,15 8,12 3.5,15 5,10 1,6.5 6.1,6.5";
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
