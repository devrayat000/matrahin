import { atom } from "jotai";
export interface Coordinate {
  x: number;
  y: number;
}
export interface Wire {
  start: string;
  end: string;
}

<<<<<<< HEAD
export interface VoltageSource {
  value: number;
  node1: string;
  node2: string;
}

=======
>>>>>>> dffe9c0 (Equivalent Capacitor done)
export interface Capacitance {
  name: string;
  value: number;
  node1: string;
  node2: string;
<<<<<<< HEAD
  charge?: number;
  voltage?: number;
=======
>>>>>>> dffe9c0 (Equivalent Capacitor done)
}

export enum ACTION {
  SHORT_CIRCUIT_REMOVAL,
  OPEN_CIRCUIT_REMOVAL,
  SERIES,
  PARALLEL,
  WYE_DELTA,
  FALLBACK,
  EMPTY_CIRCUIT,
<<<<<<< HEAD
  FINISH,
=======
>>>>>>> dffe9c0 (Equivalent Capacitor done)
}

export enum USER_ACTION {
  ADD_RESISTANCE, // R , name is not available, on redo: set name as length +  1
  ADD_WIRE, // W
  REMOVE_RESISTANCE, // R
  REMOVE_WIRE, // W
  CLEAR_CKT, // full R[] and W[]
<<<<<<< HEAD
  ADD_VOLTAGE_SOURCE, // V
  REMOVE_VOLTAGE_SOURCE, // V
=======
>>>>>>> dffe9c0 (Equivalent Capacitor done)
  // nothing for 'convert R to W' as it is removing R and adding W ,
}

export interface Circuit {
  resistances: Capacitance[];
  wires: Wire[];
}

interface HistoryType {
  action: USER_ACTION;
<<<<<<< HEAD
  params: Capacitance | Wire | Circuit | VoltageSource;
=======
  params: Capacitance | Wire | Circuit;
>>>>>>> dffe9c0 (Equivalent Capacitor done)
}

// history of user actions
export const CapacitorHistoryAtom = atom<HistoryType[]>([]);
export const CapacitorRedoListAtom = atom<HistoryType[]>([]);

export interface StepsInfo {
  Circuit: Capacitance[];
  Wires: Wire[];
<<<<<<< HEAD
  VoltageSource: VoltageSource;
  removedCapacitances: Capacitance[];
  resultingCapacitances: Capacitance[];
  message: string;
  action?: ACTION;
=======
  terminal1: string;
  terminal2: string;
  removedCapacitances: Capacitance[];
  resultingCapacitances: Capacitance[];
  message: string;
>>>>>>> dffe9c0 (Equivalent Capacitor done)
}

export interface UsedPointsType {
  point: Coordinate;
  count: number;
}
export const CapacitanceAllAtom = atom<Capacitance[]>([]);
export const WiresCapacitorAtom = atom<Wire[]>([]);
export const TerminalsCapacitorAtom = atom<string[]>(["-1__-1", "-1__-1"]);
<<<<<<< HEAD
export const VoltageSourceCapacitorAtom = atom<VoltageSource>({
  value: -1,
  node1: "-1__-1",
  node2: "-1__-1",
});
=======

>>>>>>> dffe9c0 (Equivalent Capacitor done)
// contains the  indices of  the points used in the circuit
export const PointsUsedCapacitorAtom = atom<Set<Coordinate>>((get) => {
  const uniquePoints: Set<Coordinate> = new Set();
  get(CapacitanceAllAtom).forEach((resistor) => {
    const start = resistor.node1.split("__").map((point) => parseInt(point));
    const end = resistor.node2.split("__").map((point) => parseInt(point));
    uniquePoints.add({ x: start[0], y: start[1] });
    uniquePoints.add({ x: end[0], y: end[1] });
  });

  get(WiresCapacitorAtom).forEach((wire) => {
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

<<<<<<< HEAD
  const v = get(VoltageSourceCapacitorAtom);
  const start = v.node1.split("__").map((point) => parseInt(point));
  const end = v.node2.split("__").map((point) => parseInt(point));
  uniquePoints.add({ x: start[0], y: start[1] });
  uniquePoints.add({ x: end[0], y: end[1] });
=======
>>>>>>> dffe9c0 (Equivalent Capacitor done)
  return uniquePoints;
});
export const currentPointCapacitorAtom = atom<{ x: number; y: number }>({
  x: -1,
  y: -1,
});

<<<<<<< HEAD
export const CapacitorComponentSelectedAtom = atom<"C" | "wire" | "v" | "none">(
  "none"
);
=======
export const CapacitorComponentSelectedAtom = atom<
  "C" | "wire" | "t1" | "t2" | "none"
>("none");
>>>>>>> dffe9c0 (Equivalent Capacitor done)

export const SolvingStepscapacitorAtom = atom<StepsInfo[]>([]);
export const FinalResultCapacitorAtom = atom<Capacitance>({
  name: "R0",
  value: -1,
  node1: "-1__-1",
  node2: "-1__-1",
});
