import { atom } from "jotai";
import atomWithDebounce from "~/hooks/atomWithDebounce";

const END_OF_ROAD = 50;

const DEFAULT_INPUTS = {
  m1: 10,
  m2: 20,
  v1: -10,
  v2: 5,
};

const valuesShowingAtom = atom(true);
const fullScreenOnAtom = atom(false);
const playingAtom = atom(false);
const BOX_SIZE = 2;

const { debouncedValueAtom } = atomWithDebounce(DEFAULT_INPUTS, 5);
// const collisionInputsAtom = atom((get) => get(debouncedValueAtom));

const collisionInputsAtom = atom(DEFAULT_INPUTS);
export {
  BOX_SIZE,
  DEFAULT_INPUTS,
  END_OF_ROAD,
  collisionInputsAtom,
  debouncedValueAtom,
  fullScreenOnAtom,
  playingAtom,
  valuesShowingAtom,
};
