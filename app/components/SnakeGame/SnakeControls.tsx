import React from "react";

interface SnakeControlsProps {
  autoplay: boolean;
  setAutoplay: (v: boolean) => void;
  spawnMode: "snake" | "apple";
  setSpawnMode: (v: "snake" | "apple") => void;
  onReset: () => void;
}

export const SnakeControls: React.FC<SnakeControlsProps> = ({
  autoplay,
  setAutoplay,
  spawnMode,
  setSpawnMode,
  onReset,
}) => (
  <div className="mb-4 flex gap-2 items-center">
    <label htmlFor="autoplay-toggle" className="font-medium">
      Mode:
    </label>
    <select
      id="autoplay-toggle"
      value={autoplay ? "autoplay" : "manual"}
      onChange={(e) => setAutoplay(e.target.value === "autoplay")}
      className="border rounded px-2 py-1 text-base text-black"
    >
      <option value="autoplay">Autoplay</option>
      <option value="manual">Manual</option>
    </select>
    <label htmlFor="spawn-mode" className="font-medium ml-4">
      Click mode:
    </label>
    <select
      id="spawn-mode"
      value={spawnMode}
      onChange={(e) => setSpawnMode(e.target.value as "snake" | "apple")}
      className="border rounded px-2 py-1 text-base text-black"
    >
      <option value="snake">Spawn Snake</option>
      <option value="apple">Spawn Apple</option>
    </select>
    <button
      className="ml-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      onClick={onReset}
    >
      Reset
    </button>
  </div>
);
