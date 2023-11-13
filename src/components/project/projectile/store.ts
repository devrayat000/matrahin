import { atom } from "jotai";
import { ProjectileOutput } from "~/services/Projectile";

export interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  t: number;
}

export const pointsAtom = atom<Point[]>([]);

export const projectileAtom = atom<ProjectileOutput | undefined>(undefined);
