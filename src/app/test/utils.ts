import { Coordinate } from "./store";

export const getCoordinatesById = (id: string): Coordinate => {
  const [x, y] = id
    .split("h")[0]
    .split("__")
    .map(Number)
    .map(getPointFromIndex);
  return { x, y };
};

export const offset = 20;

export const getPointFromIndex = (i: number) => i * 30 + offset;
export const getPositionFromIndex = (i: number, j: number) => {
  return {
    x: getPointFromIndex(i),
    y: getPointFromIndex(j),
  };
};
export const getIndexFromPosition = (x: number, y: number) => {
  return {
    i: Math.floor((x - offset) / 30),
    j: Math.floor((y - offset) / 30),
  };
};
