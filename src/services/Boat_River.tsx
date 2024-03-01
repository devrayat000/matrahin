import { THRESHOLD } from "~/lib/utils/constants";

export type Boat_RiverInput =
  | { vb: number; vs: number; width: number }
  | { vb: number; vs: number; width: number; angle: number };

export interface Boat_River_Output {
  vb: number; //boat velocity
  vs: number; //stream velocity
  angle_i: number; //angle of boat (initial)
  angle_r: number; //angle of boat (resultant)
  v: number; //resultant velocity
  t: number; //time
  dd: number; //distance diagonally
  dx: number; //distance horizontally
  dy: number; //distance vertically
}

export class Boat_River_General<Input extends Boat_RiverInput>
  implements Boat_River_Output
{
  vb!: number;
  vs!: number;
  width!: number;
  angle_i!: number;
  angle_r!: number;
  v!: number;
  t!: number;
  dd!: number;
  dx!: number;
  dy!: number;
  type: "min_path" | "general" = "general";

  constructor(input: Input, type: "min_path" | "general" = "general") {
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        const element = input[key];
        Object.defineProperty(this, key, {
          value: element,
          writable: true,
          configurable: true,
        });
      }
    }
    this.type = type;
    // modify initial angle
    this.modifyInitialAngle();
  }

  private modifyInitialAngle() {
    if (this.type === "min_path") {
      this.angle_i = Math.acos(-this.vs / this.vb);
    } else {
      this.angle_i = this.makeRadian(this.angle_i ?? 90);
    }
  }

  makeRadian(degree: number) {
    return (degree * Math.PI) / 180;
  }

  makeDegree(radian: number) {
    return (radian * 180) / Math.PI;
  }

  private checkPossible = (): boolean => this.vb > this.vs;

  /**
   * @description solve the resultant angle of boat
   */
  private solve_angle = (): void => {
    this.angle_r = Math.atan(
      (this.vb * Math.sin(this.angle_i)) /
        (this.vb * Math.cos(this.angle_i) + this.vs)
    );
  };

  private solve_v = (): void => {
    this.v = Math.sqrt(
      Math.pow(this.vb, 2) +
        Math.pow(this.vs, 2) +
        2 * this.vb * this.vs * Math.cos(this.angle_i)
    );
  };

  private solve_t = (): void => {
    this.t = this.width / (this.vb * Math.sin(this.angle_i));
  };

  private solve_dd = (): void => {
    this.dd = Math.sqrt(
      this.dx ** 2 +
        this.dy ** 2 +
        2 * this.dx * this.dy * Math.cos(this.angle_i)
    );
  };

  private solve_dx = (): void => {
    this.dx = this.v * Math.cos(this.angle_r) * this.t;
  };

  private solve_dy = (): void => {
    this.dy = this.v * Math.sin(this.angle_r) * this.t;
  };

  private modifyResults = (): void => {
    this.angle_i = this.makeDegree(this.angle_i);
    this.angle_r = Math.abs(this.makeDegree(this.angle_r));
    this.dd = Math.abs(this.dd);
    this.dx = Math.abs(this.dx) < THRESHOLD ? 0 : Math.abs(this.dx);
    this.dy = Math.abs(this.dy);
  };
  solve = (): void => {
    if (!this.checkPossible()) {
      throw new Error("Impossible to solve");
    }
    this.solve_angle();
    this.solve_v();
    this.solve_t();
    this.solve_dx();
    this.solve_dy();
    this.solve_dd();
    this.modifyResults();
  };
}
