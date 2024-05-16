import { atom } from "jotai";
import { Resistance } from "./calculationOfR";

export interface Coordinate {
  x: number;
  y: number;
}
export interface Wire {
  start: string;
  end: string;
}
export const ResistanceAllAtom = atom<Resistance[]>([]);
export const WiresAtom = atom<Wire[]>([]);

export const currentPointAtom = atom<{ x: number; y: number }>({
  x: -1,
  y: -1,
});

export const BreadboardInfoAtom = atom<Array<Array<"free" | "R" | "wire">>>(
  Array(20)
    .fill(null)
    .map(() => Array(12).fill("free"))
);

export const ComponentSelectedAtom = atom<"R" | "wire">("R");
