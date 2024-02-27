import { atom } from "jotai";

const END_OF_ROAD = 20;
const TIME_STEP = 1 / 60; // normal animation frame 60fps

const defaultValues = {
  m1: 1,
  m2: 1,
  v1: 1,
  v2: 1,
};
const massOneAtom = atom(0.001);

const massTwoAtom = atom(0.001);

const velocityOneAtom = atom(1);

const velocityTwoAtom = atom(1);

const valuesShowingAtom = atom(false);

const BOX_SIZE = 2;
export {
  BOX_SIZE,
  END_OF_ROAD,
  TIME_STEP,
  massOneAtom,
  massTwoAtom,
  valuesShowingAtom,
  velocityOneAtom,
  velocityTwoAtom,
};
