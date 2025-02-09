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

export enum USER_ACTION {
  ADD_RESISTANCE, // R , name is not available, on redo: set name as length +  1
  ADD_WIRE, // W
  REMOVE_RESISTANCE, // R
  REMOVE_WIRE, // W
  CLEAR_CKT, // full R[] and W[]
  // nothing for 'convert R to W' as it is removing R and adding W ,
}

export interface Circuit {
  resistances: Resistance[];
  wires: Wire[];
}

interface HistoryType {
  action: USER_ACTION;
  params: Resistance | Wire | Circuit;
}

// history of user actions
export const HistoryAtom = atom<HistoryType[]>([]);
export const RedoListAtom = atom<HistoryType[]>([]);

export interface StepsInfo {
  Circuit: Resistance[];
  Wires: Wire[];
  terminal1: string;
  terminal2: string;
  removedResistances: Resistance[];
  resultingResistances: Resistance[];
  message: string;
}

export interface UsedPointsType {
  point: Coordinate;
  count: number;
}
export const ResistanceAllAtom = atom<Resistance[]>([]);
export const WiresAtom = atom<Wire[]>([]);
export const TerminalsAtom = atom<string[]>(["-1__-1", "-1__-1"]);

// contains the  indices of  the points used in the circuit
export const PointsUsedAtom = atom<Set<Coordinate>>((get) => {
  const uniquePoints: Set<Coordinate> = new Set();
  get(ResistanceAllAtom).forEach((resistor) => {
    const start = resistor.node1.split("__").map((point) => parseInt(point));
    const end = resistor.node2.split("__").map((point) => parseInt(point));
    uniquePoints.add({ x: start[0], y: start[1] });
    uniquePoints.add({ x: end[0], y: end[1] });
  });

  get(WiresAtom).forEach((wire) => {
    const start = wire.start.split("__").map((point) => parseInt(point));
    const end = wire.end.split("__").map((point) => parseInt(point));
    uniquePoints.add({
      x: start[0],
      y: start[1],
    });
    uniquePoints.add({
      x: end[0],
      y: end[1],
    });
  });

  return uniquePoints;
});
export const currentPointAtom = atom<{ x: number; y: number }>({
  x: -1,
  y: -1,
});

export const ComponentSelectedAtom = atom<"R" | "wire" | "t1" | "t2" | "none">(
  "none"
);

export const SolvingStepsAtom = atom<StepsInfo[]>([]);
export const FinalResultAtom = atom<Resistance>({
  name: "R0",
  value: -1,
  node1: "-1__-1",
  node2: "-1__-1",
});
