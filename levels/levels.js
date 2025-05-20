// Each level: { name, width, height, start: {x, z}, grid: [row arrays of 0 (floor) or 1 (wall)] }
// This file is kept for backwards compatibility
import { LEVELS as LevelData } from '../src/levels/LevelData.js';

export const LEVELS = LevelData;

// Helper for chaining/progression
export function getLevelData(idx) {
  return LEVELS[Math.max(0, Math.min(LEVELS.length - 1, idx))];
}