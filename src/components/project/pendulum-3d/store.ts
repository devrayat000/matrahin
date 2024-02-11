import { atom } from "jotai";

export const INITIAL_VALUES = {
  angle: 45,
  length: 2,
  mass: 1,
  gravity: 9.8,
};

const lengthAtom = atom(INITIAL_VALUES.length);
const massAtom = atom(INITIAL_VALUES.mass);
const gravityAtom = atom(INITIAL_VALUES.gravity);
const angleAtom = atom(INITIAL_VALUES.angle);
const isPlayingAtom = atom(true);
const resultShowingLiveAtom = atom(true);

export const pendulumStore = {
  lengthAtom,
  massAtom,
  gravityAtom,
  angleAtom,
  isPlayingAtom,
  resultShowingLiveAtom,
};

export const inputOptions: {
  id: number;
  label: string;
  helperText: string;
  min: number;
  max: number;
  valueText: "angle" | "length" | "mass" | "gravity";
}[] = [
  {
    id: 1,
    label: "Angle (°)",
    helperText: "Angle of Release from Vertical",
    min: -179.9,
    max: 179.9,
    valueText: "angle", //to change in Pendulum object
  },
  {
    id: 2,
    label: "Length",
    helperText: "Active length of the pendulum",
    min: 0.1,
    max: 25,
    valueText: "length", //to change in Pendulum object
  },
  {
    id: 3,
    label: "Mass",
    helperText: "Mass of Bob",
    min: 0.1,
    max: 200,
    valueText: "mass", //to change in Pendulum object
  },
];
