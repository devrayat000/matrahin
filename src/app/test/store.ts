import { PrimitiveAtom, atom } from "jotai";
import { Vector3 } from "three";
import { deepCopy } from "./utils";

export type vectorType = {
  x: number;
  y: number;
};

export type TwoDCollisionValueType = {
  M: number;
  V: {
    i: vectorType;
    f: vectorType;
  };
}[];

export type TwoDCollisionValueSingleAxisType = {
  m1: number;
  m2: number;
  u1: number;
  v1: number;
  u2: number;
  v2: number;
};

const vec = new Vector3();
const MINIMUMs = {
  m: 0.001,
  modV: -20,
  angle: -180,
};

const MAXIMUMs = {
  m: 100,
  modV: 20,
  angle: 180,
};

const DEFAULT_VALUES: TwoDCollisionValueType = [
  {
    M: 10,
    V: {
      i: { x: 10, y: 0 },
      f: { x: -10, y: 0 },
    },
  },
  {
    M: 10,
    V: {
      i: { x: -10, y: 0 },
      f: { x: 10, y: 0 },
    },
  },
];

/**
 * Atom representing the two-dimensional collision inputs.
 */
const twoDCollisionAtom: PrimitiveAtom<TwoDCollisionValueType> = atom(
  deepCopy(DEFAULT_VALUES)
);

/**
 * Atom representing the playing state of the animation.
 */

export const PLAYING_STATES = {
  PLAY: "play",
  PAUSE: "pause",
  RESET: "reset",
};
const playingAtom = atom(PLAYING_STATES.PAUSE);

/**
 * Atom representing the calculated values for the two-dimensional collision.
 * It calculates the momentum (P) and kinetic energy (K) for each collision.
 */
const calculatedValuesAtom = atom((get) => {
  const values = get(twoDCollisionAtom);
  return values.map((value) => {
    const { M, V } = value;
    const { i, f } = V;
    const P = {
      i: {
        x: M * i.x,
        y: M * i.y,
      },
      f: {
        x: M * f.x,
        y: M * f.y,
      },
    };
    const K = {
      i: 0.5 * M * (i.x * i.x + i.y * i.y),
      f: 0.5 * M * (f.x * f.x + f.y * f.y),
    };
    return {
      P,
      K,
    };
  });
});

/**
 * Atom representing the total values for the two-dimensional collision.
 * It calculates the total momentum (P) and total kinetic energy (K) for all collisions.
 */
const totalValuesAtom = atom((get) => {
  const values = get(calculatedValuesAtom);
  const total = values.reduce(
    (acc, value) => {
      const { P, K } = value;
      acc.P.i.x += P.i.x;
      acc.P.i.y += P.i.y;
      acc.K.i += K.i;
      acc.K.f += K.f;
      return acc;
    },
    {
      P: { i: { x: 0, y: 0 }, f: { x: 0, y: 0 } },
      K: { i: 0, f: 0 },
    }
  );
  return total;
});

export {
  DEFAULT_VALUES,
  MAXIMUMs,
  MINIMUMs,
  calculatedValuesAtom,
  playingAtom,
  totalValuesAtom,
  twoDCollisionAtom as twoDCollisionInputsAtom,
  vec,
};
