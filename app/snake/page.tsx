import React from "react";
import { SnakeGame } from "@/app/components/SnakeGame";

export default function SnakePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="w-full max-w-3xl">
          <SnakeGame />
        </div>
      </main>
    </div>
  );
}
