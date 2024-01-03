import { atom } from "jotai";
import { Boat_River_Output } from "~/services/Boat_River";
export const boatRiverAtom = atom<Boat_River_Output | undefined>(undefined);

export type boatSpeedType = {
  angle: number;
  dx: number;
  dy: number;
};

export type pointType = {
  x: number;
  y: number;
  t: number;
};

export type velocitiesType = {
  vx: number;
  vy: number;
  v: number;
};
