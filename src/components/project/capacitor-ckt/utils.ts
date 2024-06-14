export const getCoordinatesById = (id: string): { x: number; y: number } => {
  const [x, y] = id
    .split("h")[0]
    .split("__")
    .map(Number)
    .map(getPointFromIndex);
  return { x, y };
};

export const getPointFromIndex = (i: number) => i * 30 + offset;

export const offset = 20;
