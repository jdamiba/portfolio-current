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
}

export type Apple = [number, number];
