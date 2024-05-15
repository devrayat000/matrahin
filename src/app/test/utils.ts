import { Coordinate } from "./store";

export const getCoordinatesById = (id: string): Coordinate => {
  const [x, y] = id.split("__").map(Number);
  return { x, y };
};
