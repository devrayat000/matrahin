import { atom } from "jotai";
import atomWithDebounce from "~/hooks/atomWithDebounce";

const END_OF_ROAD = 50;
const TIME_STEP = 1 / 60; // normal animation frame 60fps

const DEFAULT_INPUTS = {
  m1: 10,
  m2: 10,
  v1: -10,
  v2: 10,
};

const valuesShowingAtom = atom(true);
const fullScreenOnAtom = atom(false);
const playingAtom = atom(false);
const BOX_SIZE = 2;

const { debouncedValueAtom } = atomWithDebounce(
  {
    massOne: DEFAULT_INPUTS.m1,
    massTwo: DEFAULT_INPUTS.m2,
    velocityOne: DEFAULT_INPUTS.v1,
    velocityTwo: DEFAULT_INPUTS.v2,
  },
  5
);
// const collisionInputsAtom = atom((get) => get(debouncedValueAtom));

const collisionInputsAtom = atom({
  massOne: DEFAULT_INPUTS.m1,
  massTwo: DEFAULT_INPUTS.m2,
  velocityOne: DEFAULT_INPUTS.v1,
  velocityTwo: DEFAULT_INPUTS.v2,
});
export {
  BOX_SIZE,
  DEFAULT_INPUTS,
  END_OF_ROAD,
  TIME_STEP,
  collisionInputsAtom,
  debouncedValueAtom,
  fullScreenOnAtom,
  playingAtom,
  valuesShowingAtom,
};
