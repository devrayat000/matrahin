export enum ShapesOfInertia {
  PointMass,
  TwoMass,
  Rod,
  Cylinder,
  Sphere,
  Disk,
  Plate,
  Cuboid,
}

export enum CaseOfInertia {
  None,
  Hollow,
  Solid,
  Thin,
}

export type momentOfInertiaInput = {
  mass: number;
} & (
  | { radius: number }
  | { length: number }
  | { height: number; width: number }
  | { height: number; width: number; depth: number }
  | { radius: number; innerRadius: number }
  | { radius: number; innerRadius: number; height: number }
  | { radius: number; height: number }
  | { mass2: number; distance: number }
);
export type momentOfInertiaResult = {
  inertiaMainAxis: number;
  inertiaSecondAxis?: number;
  inertiaEndAxis?: number;
};
export class MomentOfInertiaObject<Input extends momentOfInertiaInput> {
  shape!: ShapesOfInertia;
  case!: CaseOfInertia;

  mass!: number;
  mass2!: number;

  distance!: number;
  radius!: number;
  innerRadius!: number;
  length!: number;
  height!: number;
  width!: number;
  depth!: number;

  inertiaMainAxis!: number;
  inertiaSecondAxis!: number;
  inertiaEndAxis!: number;

  constructor(
    input: Input,
    shape: ShapesOfInertia,
    caseOfInertia: CaseOfInertia
  ) {
    this.shape = shape;
    this.case = caseOfInertia;
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        const element = input[key];
        Object.defineProperty(this, key, { value: element });
      }
    }
  }

  private solvePointMass(): void {
    this.inertiaMainAxis = this.mass * this.radius ** 2;
  }

  private solveTwoMass(): void {
    this.inertiaMainAxis =
      ((this.mass * this.mass2) / (this.mass + this.mass2)) *
      this.distance ** 2;
  }

  private solveRod(): void {
    this.inertiaMainAxis = (1 / 12) * this.mass * this.length ** 2;
    this.inertiaEndAxis = (1 / 3) * this.mass * this.length ** 2;
  }

  private solveCylinder(): void {
    switch (this.case) {
      case CaseOfInertia.Solid:
        this.inertiaMainAxis = (1 / 2) * this.mass * this.radius ** 2;
        this.inertiaSecondAxis =
          (1 / 12) * this.mass * (3 * this.radius ** 2 + this.height ** 2);
        break;

      case CaseOfInertia.Hollow:
        this.inertiaMainAxis =
          (1 / 2) * this.mass * (this.radius ** 2 + this.innerRadius ** 2);
        this.inertiaSecondAxis =
          (1 / 12) *
          this.mass *
          (3 * (this.radius ** 2 + this.innerRadius ** 2) + this.height ** 2);
        break;

      case CaseOfInertia.Thin:
        this.inertiaMainAxis = this.mass * this.radius ** 2;
        this.inertiaSecondAxis =
          (1 / 12) * this.mass * (6 * this.radius ** 2 + this.height ** 2);
        break;

      default:
        break;
    }
  }

  private solveSphere(): void {
    switch (this.case) {
      case CaseOfInertia.Solid:
        this.inertiaMainAxis = (2 / 5) * this.mass * this.radius ** 2;
        break;
      case CaseOfInertia.Thin:
        this.inertiaMainAxis = (2 / 3) * this.mass * this.radius ** 2;
        break;

      case CaseOfInertia.Hollow:
        this.inertiaMainAxis =
          ((2 / 5) * this.mass * (this.radius ** 5 - this.innerRadius ** 5)) /
          (this.radius ** 3 - this.innerRadius ** 3);
        break;

      default:
        break;
    }
  }

  private solveDisk(): void {
    switch (this.case) {
      case CaseOfInertia.Solid:
        this.inertiaMainAxis = (1 / 2) * this.mass * this.radius ** 2;
        this.inertiaSecondAxis = this.inertiaMainAxis / 2;
        break;
      case CaseOfInertia.Hollow:
        this.inertiaMainAxis =
          (1 / 2) * this.mass * (this.radius ** 2 + this.innerRadius ** 2);
        this.inertiaSecondAxis = this.inertiaMainAxis / 2;
        break;

      case CaseOfInertia.Thin:
        this.inertiaMainAxis = this.mass * this.radius ** 2;
        this.inertiaSecondAxis = this.inertiaMainAxis / 2;
        break;

      default:
        break;
    }
  }

  private solvePlate(): void {
    // along the perpendicular central axis
    this.inertiaMainAxis =
      (1 / 12) * this.mass * (this.height ** 2 + this.width ** 2);
    //about a symmetry axis in the plate plane
    this.inertiaSecondAxis =
      (1 / 24) * this.mass * (this.height ** 2 + this.width ** 2);
    //axis at the end of the plate
    this.inertiaEndAxis =
      (1 / 12) * this.mass * (4 * this.height ** 2 + this.width ** 2);
  }

  private solveCuboid(): void {
    //  along height axis
    this.inertiaMainAxis =
      (1 / 12) * this.mass * (this.depth ** 2 + this.width ** 2);

    //  along width axis
    this.inertiaSecondAxis =
      (1 / 12) * this.mass * (this.height ** 2 + this.depth ** 2);

    //  along depth axis
    this.inertiaEndAxis =
      (1 / 12) * this.mass * (this.width ** 2 + this.height ** 2);
  }

  solve(): momentOfInertiaResult {
    switch (this.shape) {
      case ShapesOfInertia.PointMass:
        this.solvePointMass();
        break;
      case ShapesOfInertia.TwoMass:
        this.solveTwoMass();
        break;
      case ShapesOfInertia.Rod:
        this.solveRod();
        break;
      case ShapesOfInertia.Cylinder:
        this.solveCylinder();
        break;
      case ShapesOfInertia.Sphere:
        this.solveSphere();
        break;
      case ShapesOfInertia.Disk:
        this.solveDisk();
        break;
      case ShapesOfInertia.Plate:
        this.solvePlate();
        break;
      case ShapesOfInertia.Cuboid:
        this.solveCuboid();
        break;
      default:
        break;
    }
    return this as unknown as momentOfInertiaResult;
  }
}
