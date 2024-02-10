import { atom } from "jotai";

export interface moiCasesInputsType {
  mass: number;
  radius: number;
  innerRadius: number;
  height: number;
}

export const moiCasesInputDefaults: moiCasesInputsType = {
  mass: 1,
  radius: 3,
  innerRadius: 1.5,
  height: 5,
};
export const moiCasesInputsAtom = atom(moiCasesInputDefaults);
