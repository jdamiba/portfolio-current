// Type definitions for the Snake game

export type Direction = [number, number];

export interface Snake {
  body: [number, number][];
  dir: Direction;
  alive: boolean;
  bodyColor: string;
  headColor: string;
}

export type Apple = [number, number];
