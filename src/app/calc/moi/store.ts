import { atom } from "jotai";
import { CaseOfInertia } from "~/services/Moment_of_inertia";

export const caseTypeAtom = atom<CaseOfInertia>(CaseOfInertia.Solid);

export const rotationSpeed = 0.01;
