import React from "react";
import { SnakeGame } from "@/app/components/SnakeGame";

export default function SnakePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
          Snake + Jazz Chords
        </h1>
        <p className="mb-6 text-center text-gray-600 max-w-xl">
          Play a unique version of Snake where every apple is a different jazz
          chord! Eat apples to grow your snake and trigger jazzy sounds. Each
          color represents a different chord quality—see the legend below the
          board.
        </p>
        <div className="w-full max-w-3xl">
          <SnakeGame />
        </div>
      </main>
    </div>
  );
}
