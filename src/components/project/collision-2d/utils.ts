import { useSetAtom } from "jotai";
import { TIME_STEP } from "~/components/common/CanvasTHREE/store";
import {
  COLLISION_TYPES,
  TwoDCollisionValueSingleAxisType,
  TwoDCollisionValueType,
  twoDCollisionInputsAtom,
  vec,
  vectorType,
} from "./store";
import { Box3 } from "three";

type FinalVelocitiesType = {
  v1: vectorType;
  v2: vectorType;
};

const checkTendsToZero = (value: number) => {
  const temp = value;
  return Math.abs(temp) < 0.0001 ? 0 : Number(value.toFixed(4));
};

// function deepCopy(o) {
//   var output, v, key;
//   output = Array.isArray(o) ? [] : {};
//   for (key in o) {
//     v = o[key];
//     output[key] = typeof v === "object" ? deepCopy(v) : v;
//   }
//   return output;
// }

type DeepCopyable = { [key: string]: any } | any[];

function deepCopy<T extends DeepCopyable>(o: T): T {
  let output: T;
  if (Array.isArray(o)) {
    output = [] as any;
  } else {
    output = {} as any;
  }
  for (const key in o) {
    if (o.hasOwnProperty(key)) {
      const v = o[key];
      output[key] = typeof v === "object" ? deepCopy(v) : v;
    }
  }
  return output;
}

const getUpdatedV = (
  m1: number,
  m2: number,
  u1: vectorType,
  u2: vectorType,
  collisionType: "elastic" | "inelastic"
): FinalVelocitiesType => {
  if (collisionType == COLLISION_TYPES.INELASTIC) {
    const v1 = {
      x: (m1 * u1.x + m2 * u2.x) / (m1 + m2),
      y: (m1 * u1.y + m2 * u2.y) / (m1 + m2),
    };
    return { v1, v2: v1 };
  }

  const v1 = {
    x: (u1.x * (m1 - m2) + 2 * m2 * u2.x) / (m1 + m2),
    y: (u1.y * (m1 - m2) + 2 * m2 * u2.y) / (m1 + m2),
  };
  const v2 = {
    x: (u2.x * (m2 - m1) + 2 * m1 * u1.x) / (m1 + m2),
    y: (u2.y * (m2 - m1) + 2 * m1 * u1.y) / (m1 + m2),
  };
  return { v1, v2 };
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

const getUpdatedUSelf = (
  m1: number,
  m2: number, //mOther
  vSelf: vectorType,
  uOther: vectorType,
  collisionType: "elastic" | "inelastic" = COLLISION_TYPES.ELASTIC
): vectorType => {
  if (collisionType === COLLISION_TYPES.ELASTIC)
    return {
      x: ((m1 + m2) * vSelf.x - 2 * m2 * uOther.x) / (m1 - m2),
      y: ((m1 + m2) * vSelf.y - 2 * m2 * uOther.y) / (m1 - m2),
    };
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
 * @param values The current values from atom
 * @param param m | v
 * @param count 0 | 1
 * @param value number
 * @param initOrFinal i | f
 * @returns
 */
export const updateInputValues = (
  values: TwoDCollisionValueType,
  param: "m" | "v",
  count: 0 | 1,
  value: number,
  axis: "x" | "y" = "x",
  initOrFinal: "i" | "f" = "i"
) => {
  const setVaues = useSetAtom(twoDCollisionInputsAtom);
  const newValues = [...values];

  if (param === "m") {
    newValues[count].M = value;
    //@ts-ignore
    const { v1, v2 } = getUpdatedV(
      newValues[0].M,
      newValues[1].M,
      newValues[0].V.i,
      newValues[1].V.i
    );
    newValues[0].V.f = v1;
    newValues[1].V.f = v2;
  } else if (param === "v" && initOrFinal === "i") {
    newValues[count].V.i[axis] = value;

    //@ts-ignore
    const { v1, v2 } = getUpdatedV(
      newValues[0].M,
      newValues[1].M,
      newValues[0].V.i,
      newValues[1].V.i
    );
    newValues[0].V.f = v1;
    newValues[1].V.f = v2;
  } else if (param === "v" && initOrFinal === "f") {
    newValues[count].V.f[axis] = value;

    const { x: ux, y: uy } = getUpdatedUSelf(
      newValues[count].M,
      newValues[1 - count].M,
      newValues[count].V.f,
      newValues[1 - count].V.i
    );
    newValues[count].V.i = { x: ux, y: uy };
  }

  setVaues({ ...newValues });
};

const updateArrows = (
  mesh: THREE.Mesh,
  arrow: THREE.ArrowHelper,
  velocity: vectorType
) => {
  if (!arrow) return;
  arrow.position.copy(mesh.position);
  arrow.setDirection(
    vec
      .clone()
      .set(velocity.y / TIME_STEP, 0, velocity.x / TIME_STEP)
      .normalize()
  );
  arrow.setLength(Math.sqrt(velocity.x ** 2 + velocity.y ** 2) / TIME_STEP);
};

const checkOutOfField = (obj: THREE.Mesh) =>
  obj.position.z > 100 ||
  obj.position.z < -100 ||
  obj.position.x > 100 ||
  obj.position.x < -100;

const BoundingBox = new Box3();
/**
 * Checks if two objects collide with each other. It uses the bounding boxes of the objects to check for collision.
 * @param object1 The first object to check for collision.
 * @param object2 The second object to check for collision.
 * @returns True if the objects collide, false otherwise.
 */
const checkCollision = (
  object1: THREE.Object3D<THREE.Object3DEventMap>,
  object2: THREE.Object3D<THREE.Object3DEventMap>
) => {
  const box1 = BoundingBox.clone();
  const box2 = BoundingBox.clone();
  box2.setFromObject(object1);
  box1.setFromObject(object2);
  return box1.intersectsBox(box2);
};
export {
  checkCollision,
  calculateInitialVelocity,
  checkOutOfField,
  checkTendsToZero,
  deepCopy,
  destructureToSingleAxis,
  getUpdatedUSelf,
  getUpdatedV,
  updateArrows,
};
