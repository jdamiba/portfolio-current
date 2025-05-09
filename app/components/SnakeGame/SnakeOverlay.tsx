import React from "react";

interface SnakeOverlayProps {
  showCountdown: boolean;
  countdown: number;
}

export const SnakeOverlay: React.FC<SnakeOverlayProps> = ({
  showCountdown,
  countdown,
}) => {
  if (!showCountdown) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
      <div
        className="text-7xl md:text-8xl font-extrabold text-primary-foreground bg-black/60 rounded-2xl px-12 py-8 animate-fade-scale"
        style={{
          transition: "opacity 0.3s, transform 0.3s",
          opacity: 1,
          transform: "scale(1)",
        }}
      >
        {countdown > 0 ? countdown : "Go!"}
      </div>
    </div>
  );
};
