import { makeDegree, makeRadian } from "./utils";

class VectorMath extends Array<number> {
  static parseFloat(value: string | number): number {
    let r: number;

    const type = typeof value;
    switch (type) {
      case "number":
        r = value as number;
        break;

      case "string":
        if (/^(\\-|\+)?([0-9]+(\.[0-9]+)?)$/.test(value as string)) {
          r = parseFloat(value as string);
          if (!isFinite(r)) {
            throw new Error(`Invalid number ${value}`);
          }
        } else {
          throw new Error(`Invalid number ${value}`);
        }
        break;

      case "undefined":
        throw new Error("Missing argument");
        break;

      case "boolean":
      case "object":
      case "function":
      default:
        throw new Error(`Invalid data type ${type}`);
    }

    return r;
  }

  static getArray(value: Vector | number[], w: number): number[] {
    let args:
      | Vector
      | number[]
      | { x: number; y: number; z: number; w: number };
    if (value.length === 1) {
      args = value;
      if (!args || typeof args !== "object") {
        throw new Error("Invalid argument");
      }
    } else {
      args = value;
    }

    let x, y, z;
    if (args instanceof Vector) {
      x = args[0];
      y = args[1];
      z = args[2];
      w = 1;
    } else if (Array.isArray(args)) {
      z = 0;
      switch (args.length) {
        // @ts-ignore
        case 4:
          w = VectorMath.parseFloat(args[3]);
        // @ts-ignore
        case 3:
          z = VectorMath.parseFloat(args[2]);
        case 2:
          x = VectorMath.parseFloat(args[0]);
          y = VectorMath.parseFloat(args[1]);
          break;
        case 0:
          x = 0;
          y = 0;
          break;
        case 1:
        default:
          throw new Error("Invalid arguments");
      }
    } else {
      if (typeof args.x !== "undefined") {
        x = VectorMath.parseFloat(args.x);
      } else {
        x = 0;
      }

      if (typeof args.y !== "undefined") {
        y = VectorMath.parseFloat(args.y);
      } else {
        y = 0;
      }

      if (typeof args.z !== "undefined") {
        z = VectorMath.parseFloat(args.z);
      } else {
        z = 0;
      }

      if (typeof args.w !== "undefined") {
        w = VectorMath.parseFloat(args.w);
      }
    }

    return [x, y, z, w];
  }
}

export default class Vector extends VectorMath {
  constructor(args: number[]);
  constructor(args: Vector);
  constructor(args: number[] | Vector) {
    super(...args);
    const arr = VectorMath.getArray(args, 1);

    if (arr[3] === 1) {
      this[0] = arr[0];
      this[1] = arr[1];
      this[2] = arr[2];
      this[3] = 1;
    } else if (arr[3] > 1.0e-6) {
      const w = 1.0 / arr[3];
      this[0] = arr[0] * w;
      this[1] = arr[1] * w;
      this[2] = arr[2] * w;
      this[3] = 1;
    } else {
      this[0] = arr[0] * 1e12;
      this[1] = arr[1] * 1e12;
      this[2] = arr[2] * 1e12;
      this[3] = 1;
    }
  }

  get x() {
    return this[0];
  }

  get y() {
    return this[1];
  }

  get z() {
    return this[2];
  }

  get w() {
    return this[3];
  }

  get length() {
    return 4;
  }

  clone() {
    return new Vector(this);
  }

  static clone(v: Vector) {
    v = Vector.getInstance(v);
    return v.clone();
  }

  dup() {
    return this.clone();
  }

  static dup(v: Vector) {
    v = Vector.getInstance(v);
    return v.dup();
  }

  add(b: Vector | number[]) {
    const operand = Vector.getInstance(b);
    this[0] += operand[0];
    this[1] += operand[1];
    this[2] += operand[2];
    return this;
  }

  static add(a: Vector | number[], b: Vector | number[]) {
    const dup = new Vector(a);
    return dup.add(b);
  }

  sub(b: Vector | number[]) {
    b = Vector.getInstance(b);
    this[0] -= b[0];
    this[1] -= b[1];
    this[2] -= b[2];
    return this;
  }

  static sub(a: Vector | number[], b: Vector | number[]) {
    const dup = new Vector(a);
    return dup.sub(b);
  }

  mul(f: number) {
    const value = VectorMath.parseFloat(f);
    this[0] *= value;
    this[1] *= value;
    this[2] *= value;
    return this;
  }

  static mul(a: Vector | number[], f: number) {
    const dup = new Vector(a);
    return dup.mul(f);
  }

  div(f: number) {
    const value = VectorMath.parseFloat(f);
    if (Math.abs(value) > 1.0e-6) {
      this.mul(1.0 / value);
    } else {
      throw new Error("Division by zero");
    }
    return this;
  }

  static div(a: Vector | number[], f: number) {
    const dup = new Vector(a);
    return dup.div(f);
  }

  len() {
    const f = Math.sqrt(
      this[0] * this[0] + this[1] * this[1] + this[2] * this[2]
    );
    return f;
  }

  static len(a: Vector) {
    const v = Vector.getInstance(a);
    return v.len();
  }

  angle(b: Vector | number[]) {
    b = Vector.getInstance(b);
    const dot = Vector.dot(this, b);
    const lena = Vector.len(this);
    const lenb = Vector.len(b as Vector);
    const cos = dot / (lena * lenb);
    const rad = Math.acos(cos);
    return makeDegree(rad);
  }

  static angle(a: Vector, b: Vector) {
    const dot = Vector.dot(a, b);
    const lena = Vector.len(a);
    const lenb = Vector.len(b);
    const cos = dot / (lena * lenb);
    const rad = Math.acos(cos);
    return makeDegree(rad);
  }

  normalize() {
    const f = this.len();
    if (f > 1.0e-6) {
      this.mul(1.0 / f);
    } else {
      throw new Error("Zero-length vector");
    }
    return this;
  }

  static normalize(a: Vector) {
    const dup = new Vector(a);
    return dup.normalize();
  }

  neg() {
    this[0] = -this[0];
    this[1] = -this[1];
    this[2] = -this[2];
    return this;
  }

  static neg(a: Vector) {
    const dup = new Vector(a);
    return dup.neg();
  }

  cross(b: Vector | number[]) {
    b = Vector.getInstance(b);
    const rx = this[1] * b[2] - this[2] * b[1];
    const ry = this[2] * b[0] - this[0] * b[2];
    const rz = this[0] * b[1] - this[1] * b[0];
    this[0] = rx;
    this[1] = ry;
    this[2] = rz;
    return this;
  }

  static cross(a: Vector | number[], b: Vector | number[]) {
    const dup = new Vector(a);
    return dup.cross(b);
  }

  dot(b: Vector | number[]) {
    b = Vector.getInstance(b);
    this[0] *= b[0];
    this[1] *= b[1];
    this[2] *= b[2];
    return this[0] + this[1] + this[2];
  }

  static dot(a: Vector | number[], b: Vector | number[]) {
    const dup = new Vector(a);
    return dup.dot(b);
  }

  static getInstance(v: Vector | number[]) {
    let r: Vector;

    if (v) {
      if (typeof v == "object") {
        if (v instanceof Vector) {
          /* Argument is already vector, no conversion needed */
          r = v;
        } else {
          /* Try to convert the argument to a vector */
          r = new Vector(v);
        }
      } else {
        /* Non-zero scalar argument */
        throw new Error("Invalid argument");
      }
    } else {
      /* Null object or zero scalar argument */
      throw new Error("Invalid argument");
    }
    return r;
  }

  static fromLine(magnitude: number, angle: number): Vector;
  static fromLine(
    magnitude: number,
    ...angle: [number, number, number]
  ): Vector;
  static fromLine(magnitude: number, angle: number | [number, number, number]) {
    if (Array.isArray(angle)) {
      return new Vector([
        magnitude * Math.cos(makeRadian(angle[0])),
        magnitude * Math.cos(makeRadian(angle[1])),
        magnitude * Math.cos(makeRadian(angle[2])),
      ]);
    } else {
      return new Vector([
        magnitude * Math.cos(makeRadian(angle)),
        magnitude * Math.sin(makeRadian(angle)),
      ]);
    }
  }
}
