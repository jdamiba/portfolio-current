// Type definitions for the Snake game

export type Direction = [number, number];

export interface Snake {
  body: [number, number][];
  dir: Direction;
  alive: boolean;
  bodyColor: string;
  headColor: string;
  justSpawned?: boolean;
  name?: string;
  seed?: number;
  growth?: number;
  score?: number;
  pendingTailColors?: string[]; // Colors for new tail segments (from apples eaten)
  bodyColors?: string[]; // Color for each body segment (matches body array)
  rainbowColorIndex?: number; // Index for the next rainbow color to use
}

export type Apple = [number, number];
