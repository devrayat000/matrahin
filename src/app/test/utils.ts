import { useAtom } from "jotai";
import {
  TwoDCollisionValueSingleAxisType,
  TwoDCollisionValueType,
  twoDCollisionInputsAtom,
  vectorType,
} from "./store";

type FinalVelocitiesType = {
  v1: vectorType;
  v2: vectorType;
};
const getUpdatedV = (values: TwoDCollisionValueType): FinalVelocitiesType => {
  let { m1, m2, u1, v1, u2, v2 } = destructureToSingleAxis(values, "x");
  const v1x = (u1 * (m1 - m2) + 2 * m2 * u2) / (m1 + m2);
  const v2x = (u2 * (m2 - m1) + 2 * m1 * u1) / (m1 + m2);

  ({ m1, m2, u1, v1, u2, v2 } = destructureToSingleAxis(values, "y"));
  const v1y = (u1 * (m1 - m2) + 2 * m2 * u2) / (m1 + m2);
  const v2y = (u2 * (m2 - m1) + 2 * m1 * u1) / (m1 + m2);

  return {
    v1: { x: v1x, y: v1y },
    v2: { x: v2x, y: v2y },
  };
};
const calculateInitialVelocity = (
  { m1, m2, u1, v1, u2, v2 }: TwoDCollisionValueSingleAxisType,
  count: number
): number => {
  if (count === 0) {
    return ((m1 + m2) * v1 - 2 * m2 * u2) / (m1 - m2);
  } else {
    return ((m1 + m2) * v2 - 2 * m1 * u1) / (m2 - m1);
  }
};

const getUpdatedU = (
  values: TwoDCollisionValueType,
  count: 0 | 1
): vectorType => {
  const ux = calculateInitialVelocity(
    destructureToSingleAxis({ ...values }, "x"),
    count
  );
  const uy = calculateInitialVelocity(
    destructureToSingleAxis({ ...values }, "y"),
    count
  );
  return { x: ux, y: uy };
};

const destructureToSingleAxis = (
  values: TwoDCollisionValueType,
  axis: "x" | "y"
): TwoDCollisionValueSingleAxisType => {
  const { M: m1, V: V1 } = values[0];
  const { M: m2, V: V2 } = values[1];

  const { i: u1, f: v1 } = V1;
  const { i: u2, f: v2 } = V2;

  return {
    m1,
    m2,
    u1: u1[axis],
    v1: v1[axis],
    u2: u2[axis],
    v2: v2[axis],
  };
};

/**
 * Update the input values for the two-dimensional collision.
 *
 * @param param m | v
 * @param count 0 | 1
 * @param value number
 * @param initOrFinal i | f
 * @returns
 */
export const updateInputValues = (
  param: "m" | "v",
  count: 0 | 1,
  value: number,
  axis: "x" | "y",
  initOrFinal: "i" | "f" = "i"
) => {
  const [values, setVaues] = useAtom(twoDCollisionInputsAtom);

  const newValues = [...values];

  if (param === "m") {
    newValues[count].M = value;

    const { v1, v2 } = getUpdatedV({ ...newValues });
    newValues[0].V.f = v1;
    newValues[1].V.f = v2;
  } else if (param === "v" && initOrFinal === "i") {
    newValues[count].V.i[axis] = value;

    const { v1, v2 } = getUpdatedV({ ...newValues });
    newValues[0].V.f = v1;
    newValues[1].V.f = v2;
  } else if (param === "v" && initOrFinal === "f") {
    newValues[count].V.f[axis] = value;

    const { x: ux, y: uy } = getUpdatedU({ ...newValues }, count);
    newValues[count].V.i = { x: ux, y: uy };
  }

  setVaues({ ...newValues });
};
