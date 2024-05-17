import { atom } from "jotai";
export interface Coordinate {
  x: number;
  y: number;
}
export interface Wire {
  start: string;
  end: string;
}

export interface Resistance {
  name: string;
  value: number;
  node1: string;
  node2: string;
}

export enum ACTION {
  SHORT_CIRCUIT_REMOVAL,
  OPEN_CIRCUIT_REMOVAL,
  SERIES,
  PARALLEL,
  WYE_DELTA,
  FALLBACK,
  EMPTY_CIRCUIT,
}

export interface StepsInfo {
  Circuit: Resistance[];
  Wires: Wire[];
  terminal1: string;
  terminal2: string;
  removedResistances: Resistance[];
  resultingResistances: Resistance[];
  message: string;
}
export const ResistanceAllAtom = atom<Resistance[]>([]);
export const WiresAtom = atom<Wire[]>([]);
export const TerminalsAtom = atom<string[]>(["-1__-1", "-1__-1"]);
export const PointUsedAtom = atom<Coordinate[]>([]);
export const currentPointAtom = atom<{ x: number; y: number }>({
  x: -1,
  y: -1,
});

// export const BreadboardInfoAtom = atom<Array<Array<"free" | "R" | "wire">>>(
//   Array(20)
//     .fill(null)
//     .map(() => Array(12).fill("free"))
// );

export const ComponentSelectedAtom = atom<"R" | "wire" | "t1" | "t2" | "none">(
  "none"
);

export const calculatingAtom = atom<boolean>(false);
export const SolvingStepsAtom = atom<StepsInfo[]>([]);
