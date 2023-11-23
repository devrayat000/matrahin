import { atom } from "jotai";
import { Boat_River_Output } from "~/services/Boat_River";
export const boatRiverAtom = atom<Boat_River_Output | undefined>(undefined);
