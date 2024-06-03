import { atom } from "jotai";

const PlusLeftAtom = atom(false);
const VoltageAtom = atom(0);
const CurrentAtom = atom(0);
const LightInputAtom = atom({
  intensity: 0,
  wavelength: 270,
});

export { CurrentAtom, LightInputAtom, PlusLeftAtom, VoltageAtom };
