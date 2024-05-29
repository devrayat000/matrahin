import { atom } from "jotai";

export const RiverWidthAtom = atom(200);

export const VelocityAtom = atom({
  river: 10,
  boatValue: 10,
  boatAngle: 90,
});
