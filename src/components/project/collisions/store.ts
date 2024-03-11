import { atom } from "jotai";
import atomWithDebounce from "~/hooks/atomWithDebounce";

const END_OF_ROAD = 50;
const TIME_STEP = 1 / 60; // normal animation frame 60fps

const DEFAULT_INPUTS = {
  m1: 1,
  m2: 1,
  v1: -1,
  v2: 1,
};
const massOneAtom = atom(DEFAULT_INPUTS.m1);
// const massOneAtom = atomWithDebounce(DEFAULT_INPUTS.m1);

const massTwoAtom = atom(DEFAULT_INPUTS.m2);

const velocityOneAtom = atom(DEFAULT_INPUTS.v1);

const velocityTwoAtom = atom(DEFAULT_INPUTS.v2);

const valuesShowingAtom = atom(true);
const fullScreenOnAtom = atom(false);
const BOX_SIZE = 2;

const boxSizeOneAtom = atom((get) => 1 + get(massOneAtom) / 10);
const boxSizeTwoAtom = atom((get) => 1 + get(massTwoAtom) / 10);

const { debouncedValueAtom } = atomWithDebounce(
  {
    massOne: DEFAULT_INPUTS.m1,
    massTwo: DEFAULT_INPUTS.m2,
    velocityOne: DEFAULT_INPUTS.v1,
    velocityTwo: DEFAULT_INPUTS.v2,
  },
  10
);
const collisionInputsAtom = atom((get) => get(debouncedValueAtom));

export {
  BOX_SIZE,
  DEFAULT_INPUTS,
  END_OF_ROAD,
  TIME_STEP,
  boxSizeOneAtom,
  boxSizeTwoAtom,
  collisionInputsAtom,
  debouncedValueAtom,
  fullScreenOnAtom,
  massOneAtom,
  massTwoAtom,
  valuesShowingAtom,
  velocityOneAtom,
  velocityTwoAtom,
};
