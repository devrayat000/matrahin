import {
  atom,
  useSetAtom,
  useAtomValue,
  type PrimitiveAtom,
  type WritableAtom,
  type Atom,
} from "jotai";
import { atomWithReset, RESET } from "jotai/utils";

import { a, s, t, u, v } from "~/components/project/dynamics/formulae";

const displacementPrimitiveAtom = atomWithReset<number | "">("");
const initialVelocityPrimitiveAtom = atomWithReset<number | "">("");
const finalVelocityPrimitiveAtom = atomWithReset<number | "">("");
const accelerationPrimitiveAtom = atomWithReset<number | "">("");
const timePrimitiveAtom = atomWithReset<number | "">("");

const propsAtom = atom((get) => {
  return {
    s: get(displacementPrimitiveAtom),
    u: get(initialVelocityPrimitiveAtom),
    v: get(finalVelocityPrimitiveAtom),
    a: get(accelerationPrimitiveAtom),
    t: get(timePrimitiveAtom),
  };
});

// const dpChange = atomEffect(get => {})

export const displacementAtom = atom(
  (get) => {
    const { s: displacement, ...props } = get(propsAtom);
    if (displacement !== "") return displacement;
    return s(props);
  },
  (_, set, val: number | "" | typeof RESET) =>
    set(displacementPrimitiveAtom, val)
);

export const initialVelocityAtom = atom(
  (get) => {
    const { u: initialVelocity, ...props } = get(propsAtom);
    if (initialVelocity !== "") return initialVelocity;
    return u(props);
  },
  (_, set, val: number | "" | typeof RESET) =>
    set(initialVelocityPrimitiveAtom, val)
);

export const finalVelocityAtom = atom(
  (get) => {
    const { v: finalVelocity, ...props } = get(propsAtom);
    if (finalVelocity !== "") return finalVelocity;
    return v(props);
  },
  (_, set, val: number | "" | typeof RESET) =>
    set(finalVelocityPrimitiveAtom, val)
);

export const accelerationAtom = atom(
  (get) => {
    const { a: acceleration, ...props } = get(propsAtom);
    if (acceleration !== "") return acceleration;
    return a(props);
  },
  (_, set, val: number | "" | typeof RESET) =>
    set(accelerationPrimitiveAtom, val)
);

export const timeAtom = atom(
  (get) => {
    const { t: time, ...props } = get(propsAtom);
    if (time !== "") return time;
    return t(props);
  },
  (_, set, val: number | "" | typeof RESET) => set(timePrimitiveAtom, val)
);

export const completedAtom = atom((get) => {
  return (
    !!get(displacementAtom) &&
    !!get(initialVelocityAtom) &&
    !!get(finalVelocityAtom) &&
    !!get(accelerationAtom) &&
    !!get(timeAtom)
  );
});

export function useAtomChanger(
  atom:
    | PrimitiveAtom<number | "">
    | WritableAtom<number | "", [val: number | "" | typeof RESET], void>
) {
  const setAtom = useSetAtom(atom);

  return (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "") return setAtom("");
    setAtom(event.target.valueAsNumber);
  };
}

export function useRoundedAtomValue(atom: Atom<number | "">) {
  const val = useAtomValue(atom);

  return val === ""
    ? ""
    : val.toLocaleString(undefined, { maximumFractionDigits: 2 });
}
