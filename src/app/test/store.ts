import { atom } from "jotai";
import { Resistance } from "./main";

export const ResistanceAllAtom = atom<Resistance[]>([]);

export const currentPointAtom = atom<{ x: number; y: number }>({
  x: -1,
  y: -1,
});
