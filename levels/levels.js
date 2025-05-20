// Each level: { name, width, height, start: {x, z}, grid: [row arrays of 0 (floor) or 1 (wall)] }

export const LEVELS = [
  {
    name: "Tutorial",
    width: 7,
    height: 7,
    start: { x: 1, z: 1 },
    grid: [
      [1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1],
      [1,0,1,0,1,0,1],
      [1,0,1,0,1,0,1],
      [1,0,0,0,1,0,1],
      [1,0,1,0,0,0,1],
      [1,1,1,1,1,1,1],
    ]
  },
  {
    name: "Maze",
    width: 9,
    height: 9,
    start: { x: 1, z: 1 },
    grid: [
      [1,1,1,1,1,1,1,1,1],
      [1,0,0,1,0,0,0,0,1],
      [1,1,0,1,0,1,1,0,1],
      [1,0,0,0,0,1,0,0,1],
      [1,0,1,1,0,1,0,1,1],
      [1,0,0,1,0,0,0,0,1],
      [1,1,0,1,1,1,0,1,1],
      [1,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1],
    ]
  }
];

// Helper for chaining/progression
export function getLevelData(idx) {
  return LEVELS[Math.max(0, Math.min(LEVELS.length - 1, idx))];
}