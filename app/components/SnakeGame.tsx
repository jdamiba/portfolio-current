"use client";

import React, { useEffect, useState, useCallback } from "react";
import { SnakeBoard } from "./SnakeGame/components/SnakeBoard";
import { Card } from "@/components/ui/card";

interface Snake {
  body: [number, number][];
  dir: [number, number];
  alive: boolean;
  bodyColor: string;
  headColor: string;
  growth?: number;
  score?: number;
  bodyColors?: string[];
  seed?: number;
}

interface RogueliteState {
  upgrades: string[];
  snake: Snake;
  apples: [number, number, string, string, string][];
  startTime?: number;
  timeLeft?: number;
  speed?: number;
  obstacles?: [number, number][];
  map?: { id: string; type: string }[];
  currentNodeId?: string;
}

type RoomType =
  | "standard"
  | "obstacle"
  | "speed"
  | "elite"
  | "treasure"
  | "shop"
  | "boss"
  | "event"
  | "rest";
interface MapNode {
  id: string;
  type: RoomType;
  next?: string[];
}

const UPGRADE_POOL = [
  { key: "lengthPlusOne", label: "+1 max length per apple", effect: "length" },
  { key: "speedBoost", label: "Speed boost", effect: "speed" },
  { key: "magnet", label: "Magnet: attract apples", effect: "magnet" },
  { key: "shield", label: "Shield: survive one crash", effect: "shield" },
];

const gridSize = 36;
const cellSize = 18;

export function SnakeGame() {
  const [rogueliteState, setRogueliteState] = useState<RogueliteState | null>(
    null
  );
  const [upgradeChoices, setUpgradeChoices] = useState<typeof UPGRADE_POOL>([]);
  const [pendingUpgrade, setPendingUpgrade] = useState<string | null>(null);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [showUpgradeScreen, setShowUpgradeScreen] = useState(false);

  // Main game loop: send tick to server
  useEffect(() => {
    if (
      !gameInProgress ||
      !rogueliteState ||
      !rogueliteState.snake ||
      !rogueliteState.snake.alive
    )
      return;
    const intervalMs = rogueliteState.speed || 100;
    const interval = setInterval(() => {
      fetch("/api/roguelite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "tick", gridSize }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error === "No game in progress") {
            setGameInProgress(false);
            setRogueliteState(null);
          } else {
            setRogueliteState(data);
            if (data.snake && data.snake.alive === false) {
              setGameInProgress(false);
              setShowUpgradeScreen(true);
              // Pick 2-3 random upgrades
              const shuffled = [...UPGRADE_POOL].sort(
                () => Math.random() - 0.5
              );
              setUpgradeChoices(shuffled.slice(0, Math.random() < 0.5 ? 2 : 3));
            }
          }
        });
    }, intervalMs);
    return () => clearInterval(interval);
  }, [gameInProgress, rogueliteState]);

  // Start game handler
  const handleStartGame = useCallback(() => {
    fetch("/api/roguelite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start", gridSize }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRogueliteState(data);
        setGameInProgress(true);
        setShowUpgradeScreen(false);
      });
  }, []);

  // Handle upgrade selection
  const handleUpgradeSelect = useCallback((upgradeKey: string) => {
    setPendingUpgrade(upgradeKey);
    fetch("/api/roguelite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "choose-upgrade", upgradeKey }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRogueliteState(data);
        setPendingUpgrade(null);
        setShowUpgradeScreen(false);
        // Automatically advance to the next room after upgrade
        if (data.map && data.currentNodeId) {
          const currentNode = data.map.find(
            (n: MapNode) => n.id === data.currentNodeId
          );
          if (currentNode && currentNode.next && currentNode.next.length > 0) {
            const nextRoomId = currentNode.next[0];
            fetch("/api/roguelite", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "choose-room",
                nextRoomId,
                prevRoomId: currentNode.id,
                gridSize,
              }),
            })
              .then((res) => res.json())
              .then((roomData) => {
                setRogueliteState(roomData);
                setGameInProgress(true);
                setShowUpgradeScreen(false);
              });
          }
        }
      });
  }, []);

  // UI: Start button
  if (
    !gameInProgress &&
    (!rogueliteState ||
      !rogueliteState.snake ||
      rogueliteState.snake.alive === false) &&
    !showUpgradeScreen
  ) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <button
          className="px-8 py-4 rounded bg-green-600 text-white text-2xl font-bold hover:bg-green-700 transition"
          onClick={handleStartGame}
        >
          Start Game
        </button>
      </div>
    );
  }

  // UI: Upgrade selection
  if (showUpgradeScreen && upgradeChoices.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Card className="mb-4 p-4 shadow-md">
          <div className="font-bold text-lg mb-2">Choose an Upgrade!</div>
          <div className="flex gap-4">
            {upgradeChoices.map((upg) => (
              <button
                key={upg.key}
                className="px-4 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
                onClick={() => handleUpgradeSelect(upg.key)}
                disabled={!!pendingUpgrade}
              >
                {upg.label}
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // UI: Game board
  if (!rogueliteState || !rogueliteState.snake || !rogueliteState.apples) {
    return <div>Loading...</div>;
  }

  // Calculate and display the timer (30 seconds per round)
  let timeLeft = 5;
  if (typeof rogueliteState.timeLeft === "number") {
    timeLeft = rogueliteState.timeLeft;
  } else if (rogueliteState.startTime) {
    timeLeft = Math.max(
      0,
      5 - Math.floor((Date.now() - rogueliteState.startTime) / 1000)
    );
  }

  // Find current room type
  let roomTypeLabel = null;
  if (rogueliteState.map && rogueliteState.currentNodeId) {
    const currentNode = rogueliteState.map.find(
      (n) => n.id === rogueliteState.currentNodeId
    );
    if (currentNode) {
      roomTypeLabel =
        currentNode.type.charAt(0).toUpperCase() +
        currentNode.type.slice(1) +
        " Room";
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Room type display */}
      {roomTypeLabel && (
        <div className="flex justify-center mt-4">
          <span className="px-4 py-1 rounded-full bg-gray-200 text-gray-800 text-lg font-semibold shadow">
            {roomTypeLabel}
          </span>
        </div>
      )}
      {/* Timer and score display */}
      {gameInProgress && (
        <div className="text-center text-3xl font-bold text-blue-700 dark:text-blue-300 mt-4 mb-2 flex flex-col items-center gap-2">
          <span>Time Left: {timeLeft}s</span>
          <span className="text-2xl text-green-700 dark:text-green-300 font-semibold">
            Score: {rogueliteState.snake.score ?? 0}
          </span>
        </div>
      )}
      <div className="flex-grow p-4">
        <SnakeBoard
          snakes={[rogueliteState.snake]}
          apples={rogueliteState.apples}
          cellSize={cellSize}
          gridSize={gridSize}
          obstacles={rogueliteState.obstacles || []}
        />
      </div>
    </div>
  );
}

export default SnakeGame;
