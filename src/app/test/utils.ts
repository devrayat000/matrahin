import { Coordinate } from "./store";

export const getCoordinatesById = (id: string): Coordinate => {
  const [x, y] = id.split("h")[0].split("__").map(Number);
  return { x, y };
};

export const offset = 20;
export const getIndexFromPosition = (x: number, y: number) => {
  return {
    i: Math.floor((x - offset) / 30),
    j: Math.floor((y - offset) / 30),
  };
};
