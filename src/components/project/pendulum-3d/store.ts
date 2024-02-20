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

const inputChangedAtom = atom(false);

const submittedInputsAtom = atom({
  angle: INITIAL_VALUES.angle,
  length: INITIAL_VALUES.length,
  mass: INITIAL_VALUES.mass,
  gravity: INITIAL_VALUES.gravity,
});

export const pendulumStore = {
  lengthAtom,
  massAtom,
  gravityAtom,
  angleAtom,
  isPlayingAtom,
  resultShowingLiveAtom,
  submittedInputsAtom,
  inputChangedAtom,
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

export const timePeriodAtom = atom((get) => {
  const { length, gravity, angle } = get(submittedInputsAtom);

  const radian = (angle * Math.PI) / 180;
  return (
    2 *
    Math.PI *
    Math.sqrt(length / gravity) *
    (1 +
      (1 / 16) * radian ** 2 +
      (11 / 3072) * radian ** 4 +
      (173 / 737280) * radian ** 6)
  );
});
