import { atom } from "jotai";

export interface moiCasesInputsType {
  mass: number;
  radius: number;
  innerRadius: number;
  height: number;
}

export interface moiBasicInputsType {
  mass: number;
  mass2: number;
  distance: number;
  radius: number;
}

export interface moiDifferentAxesInputsType {
  mass: number;
  length: number;
  height: number;
  width: number;
  depth: number;
}

export const moiBasicInputDefaults: moiBasicInputsType = {
  mass: 1,
  mass2: 1,
  distance: 2,
  radius: 1,
};

export const moiCasesInputDefaults: moiCasesInputsType = {
  mass: 1,
  radius: 3,
  innerRadius: 1.5,
  height: 5,
};

export const moiDifferentAxesInputDefaults: moiDifferentAxesInputsType = {
  mass: 1,
  length: 1,
  height: 1,
  width: 1,
  depth: 1,
};

export const moiCasesInputsAtom = atom(moiCasesInputDefaults);
export const moiDifferentAxesInputsAtom = atom(moiDifferentAxesInputDefaults);
export const moiBasicInputsAtom = atom(moiBasicInputDefaults);
