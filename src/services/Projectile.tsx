export type ProjectileInput = { yi: number; g: number } & (
  | {
      vi: number;
      angle: number;
    }
  | {
      xm: number;
      ym: number;
    }
  | {
      vi: number;
      t: number;
    }
  | {
      vi: number;
      ym: number;
    }
  | {
      xm: number;
      t: number;
    }
  | {
      vi: number;
      xm: number;
    }
  | {
      angle: number;
      xm: number;
    }
  | {
      angle: number;
      t: number;
    }
  | {
      angle: number;
      ym: number;
    }
);

export interface ProjectileOutput {
  yi: number;
  g: number;
  vi: number;
  angle: number;
  xm: number;
  ym: number;
  t: number;
}

export default class Projectile<Input extends ProjectileInput>
  implements ProjectileOutput
{
  yi!: number;
  g!: number;
  vi!: number;
  angle!: number;
  xm!: number;
  ym!: number;
  t!: number;

  constructor(input: Input) {
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        const element = input[key];
        Object.defineProperty(this, key, { value: element });
      }
    }
    this.yi = input.yi || 0;
  }

  #makeRadian(degree: number) {
    return (degree * Math.PI) / 180;
  }

  #makeDegree(radian: number) {
    return (radian * 180) / Math.PI;
  }

  #solve_vi_angle() {
    const { g, vi, angle } = this;
    const vx = vi * Math.cos(this.#makeRadian(angle));
    const vy = vi * Math.sin(this.#makeRadian(angle));

    this.ym = vy ** 2 / (2 * g);
    this.t = (2 * vy) / g;
    this.xm = vx * this.t;
  }

  #solve_ym_xm() {
    const { g, yi, xm, ym } = this;
    const an = Math.atan((4 * (ym - yi)) / xm);
    this.angle = this.#makeDegree(an);
    this.vi = Math.sqrt(2 * g * (ym - yi)) / Math.sin(an);
    this.t = xm / (this.vi * Math.cos(an));
  }

  #solve_vi_t() {
    const { g, vi, t } = this;
    const an = Math.asin((t * g) / (2 * vi));
    this.angle = this.#makeDegree(an);
    this.#solve_vi_angle();
  }

  #solve_vi_ym() {
    const { g, vi, ym } = this;
    const an = Math.asin(Math.sqrt(2 * g * ym) / vi);
    this.angle = this.#makeDegree(an);
    this.#solve_vi_angle();
  }

  #solve_t_xm() {
    const { g, t, xm } = this;
    const an = Math.atan((t ** 2 * g) / (2 * xm));
    this.angle = this.#makeDegree(an);
    this.#solve_vi_angle();
  }

  #solve_vi_xm() {
    const { g, vi, xm } = this;
    const an = 0.5 * Math.asin((xm * g) / vi ** 2);
    this.angle = this.#makeDegree(an);
    this.#solve_vi_angle();
  }

  #solve_angle_xm() {
    const { g, angle, xm } = this;
    const vi = Math.sqrt((xm * g) / Math.sin(this.#makeRadian(2 * angle)));
    this.vi = vi;
    this.#solve_vi_angle();
  }

  #solve_angle_t() {
    const { g, angle, t } = this;
    const vi = (t * g) / (2 * Math.sin(this.#makeRadian(angle)));
    this.vi = vi;
    this.#solve_vi_angle();
  }

  #solve_angle_ym() {
    const { g, angle, ym } = this;
    const vi = Math.sqrt(2 * g * ym) / Math.sin(this.#makeRadian(angle));
    this.vi = vi;
    this.#solve_vi_angle();
  }

  solve() {
    if (!!this.vi && !!this.angle) {
      this.#solve_vi_angle();
    } else if (!!this.ym && !!this.xm) {
      this.#solve_ym_xm();
    } else if (!!this.vi && !!this.t) {
      this.#solve_vi_t();
    } else if (!!this.vi && !!this.ym) {
      this.#solve_vi_ym();
    } else if (!!this.t && !!this.xm) {
      this.#solve_t_xm();
    } else if (!!this.vi && !!this.xm) {
      this.#solve_vi_xm();
    } else if (!!this.angle && !!this.xm) {
      this.#solve_angle_xm();
    } else if (!!this.angle && !!this.t) {
      this.#solve_angle_t();
    } else if (!!this.angle && !!this.ym) {
      this.#solve_angle_ym();
    } else {
      // do nothing
    }
    return new Projectile(this);
  }
}
