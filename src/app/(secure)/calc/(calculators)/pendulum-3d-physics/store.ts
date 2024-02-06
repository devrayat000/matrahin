import { atom } from "jotai";
import Pendulum from "./Pendulum";

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

export interface PendulumResultRefs {
  angleResultRef: React.RefObject<HTMLParagraphElement>;
  velocityResultRef: React.RefObject<HTMLParagraphElement>;
  accelarationResultRef: React.RefObject<HTMLParagraphElement>;
  heightResultRef: React.RefObject<HTMLParagraphElement>;
  potentialEnergyResultRef: React.RefObject<HTMLParagraphElement>;
  kineticEnergyResultRef: React.RefObject<HTMLParagraphElement>;
  totalEnergyResultRef: React.RefObject<HTMLParagraphElement>;
}

export interface PendulumAnimationRefs extends PendulumResultRefs {
  pendulumRef: React.RefObject<Pendulum>;
}

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
    helperText: "Initial angle of the pendulum",
    min: -180,
    max: 180,
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
    helperText: "Mass of the pendulum",
    min: 0.1,
    max: 250,
    valueText: "mass", //to change in Pendulum object
  },
  {
    id: 4,
    label: "Gravity",
    helperText: "Gravity",
    min: 1,
    max: 100,
    valueText: "gravity", //to change in Pendulum object
  },
];
