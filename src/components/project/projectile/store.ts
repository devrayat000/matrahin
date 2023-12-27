import { atom } from "jotai";
import { ProjectileOutput } from "~/services/Projectile";

export interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  t: number;
}
export type modifiedValues = {
  objectPosition: {
    x: number;
    y: number;
  };
  objectSpeed: {
    magnitude: number;
    angle: number;
  };
  height: number;
};

export type LegendsType = {
  text: string;
  value: number;
  unit?: string;
}[];

export type INITIAL_CONSTANTS = {
  canvasDimension: {
    x: number;
    y: number;
  };
};
export const projectileAtom = atom<ProjectileOutput | undefined>(undefined);
