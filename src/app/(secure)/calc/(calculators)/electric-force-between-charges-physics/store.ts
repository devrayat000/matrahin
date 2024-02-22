import { atom } from "jotai";

export const scaleAtom = atom(10);

export const dimensionsAtom = atom({
  canvasWidth: 350,
  canvasHeight: 350,
  yOriginOffset: 175,
});

export const MAX_ZOOM = 50;
export const MIN_ZOOM = 0.5;
