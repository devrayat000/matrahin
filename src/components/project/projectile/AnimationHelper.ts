import { atom } from "jotai";
import { ProjectileOutput } from "~/services/Projectile";
import { INITIAL_CONSTANTS, Point, projectileAtom } from "./store";

export const INITIAL: INITIAL_CONSTANTS = {
  canvasDimension: {
    x: 700,
    y: 400,
  },
};
export const objectSize = 5; //radius

export const scaleAtom = atom<number>(1);
// export const scaleAtom = atom(
//   (get) => {
//     const result: ProjectileOutput | undefined = get(projectileAtom);
//     return result ? (INITIAL.canvasDimension.x - 50) / result.xm : 1;
//   },
//   (_get, set, newScale: number) => {
//     set(scale, newScale);
//   }
// );

export const pointsAtom = atom<Point[]>((get) => {
  const result: ProjectileOutput | undefined = get(projectileAtom);
  const scale = get(scaleAtom);

  if (!result) return [];

  return calculatePoints(result, scale);
});

export const animatingPointsAtom = atom<Point[]>((get) => {
  return get(pointsAtom).map((p) => {
    const point = modifyPoints(p.x, p.y, get(scaleAtom));
    return {
      ...p,
      x: point.x,
      y: point.y,
    };
  });
});
const calculatePoints = (result: ProjectileOutput, scale: number) => {
  const initialVelocity = result.vi;
  const initialHeight = result.yi / scale; // in meters
  const timeStep = 0.05 / (10 * scale); // in seconds

  const g = result.g; // Acceleration due to gravity (m/s^2)
  const radians = (result.angle * Math.PI) / 180; // in radians;
  const cosTheta = Math.cos(radians);
  const tanTheta = Math.tan(radians);
  const sinTheta = Math.sin(radians);
  const v0squared = Math.pow(initialVelocity, 2);

  let x = 0,
    y = 0,
    vx = 0,
    vy = 0;

  const points = [];

  for (let t = 0; y >= 0; t += timeStep) {
    x = initialVelocity * cosTheta * t;
    y =
      x * tanTheta -
      (g * Math.pow(x, 2)) / (2 * v0squared * Math.pow(cosTheta, 2)) +
      initialHeight;
    vx = initialVelocity * cosTheta;
    vy = initialVelocity * sinTheta - g * t;
    points.push({ x, y, vx, vy, t });
  }
  return points;
};

// an utility function to modify the points to show in the canvas
export const modifyPoints = (
  x: number,
  y: number,
  scale: number
): { x: number; y: number } => {
  x = x * scale + objectSize;
  y = INITIAL.canvasDimension.y - y * scale - objectSize;
  return { x, y };
};
