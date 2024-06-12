import { atom } from "jotai";

const PlusLeftAtom = atom(false);
const VoltageAtom = atom(0);
const CurrentAtom = atom(0);
const LightInputAtom = atom({
  intensity: 0.6,
  wavelength: 270,
});
const WorkFunctionAtom = atom(2.7);

const PLANCKS_CONSTANT = 6.626 * 10 ** -34;
const SPEED_OF_LIGHT = 3 * 10 ** 8;
const ELECTRON_MASS = 9.11 * 10 ** -31;
const ELECTRON_CHARGE = 1.6 * 10 ** -19;
const hc = PLANCKS_CONSTANT * SPEED_OF_LIGHT;
const DISTANCE_BETWEEN_PLATES = 1000;
const AccelerationFactor =
  ELECTRON_CHARGE / ELECTRON_MASS / DISTANCE_BETWEEN_PLATES;

export {
  AccelerationFactor,
  CurrentAtom,
  ELECTRON_CHARGE,
  ELECTRON_MASS,
  LightInputAtom,
  PLANCKS_CONSTANT,
  PlusLeftAtom,
  SPEED_OF_LIGHT,
  VoltageAtom,
  WorkFunctionAtom,
  hc,
};
