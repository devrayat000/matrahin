import { atom } from "jotai";
import { Boat_River_Output } from "~/services/Boat_River";
import { boatRiverAtom, boatSpeedType, pointType } from "./store";

const CONFIG = {
  canvasWidth: 400,
  canvasHeight: 300,
  boatWidth: 60,
  boatHeight: 60,
  timeStep: 0.01,
  animationDuration: 10,
};

export const INITIAL = {
  canvasDimension: {
    x: CONFIG.canvasWidth,
    y: CONFIG.canvasHeight,
  },
  boatSize: {
    x: CONFIG.boatWidth,
    y: CONFIG.boatHeight,
  },
  boatPosition: {
    x: CONFIG.canvasWidth / 2,
    y: CONFIG.canvasHeight - CONFIG.boatHeight / 2,
  },
  bankSize: {
    x: CONFIG.canvasWidth,
    y: CONFIG.boatHeight / 2,
  },
};

export const scaleAtom = atom<number>((get) => {
  const result: Boat_River_Output | undefined = get(boatRiverAtom);
  return result
    ? (INITIAL.canvasDimension.y - INITIAL.bankSize.y * 2) / result.dy
    : 1;
});

export const boatSpeedAtom = atom<boatSpeedType>((get) => {
  const result: Boat_River_Output | undefined = get(boatRiverAtom);
  const scale = get(scaleAtom);
  return {
    angle: result.angle_r,
    dx: result.v * scale * Math.cos((result.angle_r * Math.PI) / 180),
    dy: result.v * scale * Math.sin((result.angle_r * Math.PI) / 180),
  };
});

export const pointsAtom = atom<pointType[]>((get) => {
  const result: Boat_River_Output | undefined = get(boatRiverAtom);

  if (!result) return [];

  return calculatePoints(result);
});

export const animatingPointsAtom = atom<pointType[]>((get) => {
  const scale = get(scaleAtom);
  return get(pointsAtom).map((p) => ({
    t: p.t,
    x: INITIAL.boatPosition.x + p.x * scale,
    y: INITIAL.boatPosition.y - p.y * scale,
  }));
});

const calculatePoints = (result: Boat_River_Output): pointType[] => {
  const { angle_i, t, vb, vs } = result;

  let x = 0,
    y = 0,
    time = 0;
  const timeStep = CONFIG.timeStep;
  const vx = vs + vb * Math.cos((angle_i * Math.PI) / 180);
  const vy = vb * Math.sin((angle_i * Math.PI) / 180);

  const points: pointType[] = [];
  for (; time < t; time += timeStep) {
    x = vx * time;
    y = vy * time;
    points.push({ x, y, t: time });
  }
  console.log(points);
  return points;
};

export const animationSpeedAtom = atom<number>(
  (get) =>
    // total 5 seconds to finish the animation
    get(boatRiverAtom).t / CONFIG.animationDuration
);

// an utility function to modify the points to show in the canvas
// export const modifyPoints = (
//   x: number,
//   y: number,
//   scale: number
// ): { x: number; y: number } => {
//   const offset: number = objectSize + GROUND_LEVEL_IN_CANVAS;
//   x = x * scale + MARGIN_X;
//   y = INITIAL.canvasDimension.y - y * scale - offset;
//   return { x, y };
// };
