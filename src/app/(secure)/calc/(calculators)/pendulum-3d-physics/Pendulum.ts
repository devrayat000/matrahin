// import { EventEmitter } from "node:stream";

const TWO_PI = 2 * Math.PI;

class Pendulum {
  initialAngle: number = 0;
  angle: number = 0;
  angularVelocity: number = 0;
  length: number = 1;
  mass: number = 1;

  gravity: number = 9.8;
  friction: number = 0;
  damping: number = 0;

  height: number = 0;
  accelaration: number = 0;
  velocity: number = 0;
  kineticEnergy: number = 0;
  potentialEnergy: number = 0;
  totalEnergy: number = 0;

  swingCount: number = 0;
  constructor(
    angle: number,
    length: number,
    mass: number,
    gravity: number,
    friction: number,
    damping: number
  ) {
    this.angle = null;
    this.initialAngle = angle;
    this.length = length;
    this.mass = mass;
    this.gravity = gravity;
    this.friction = friction;
    this.damping = damping;
  }

  /**
   * Stepper function for the pendulum model.
   * It uses a Runge-Kutta approach to solve the angular differential equation
   * @public
   *
   * @param {number} dt
   */
  step(dt: number) {
    if (this.angle === null) {
      this.angle = this.initialAngle;
      //console.log("initial angle", (this.angle * 180) / Math.PI);
    }
    let theta = this.angle;
    let omega = this.angularVelocity;

    const numSteps = Math.max(7, dt * 120);

    // 10 iterations typically maintains about ~11 digits of precision for total energy
    for (let i = 0; i < numSteps; i++) {
      const step = dt / numSteps;

      // Runge Kutta (order 4), where the derivative of theta is omega.
      const k1 = omega * step;
      const l1 = this.omegaDerivative(theta) * step;
      const k2 = (omega + 0.5 * l1) * step;
      const l2 = this.omegaDerivative(theta + 0.5 * k1) * step;
      const k3 = (omega + 0.5 * l2) * step;
      const l3 = this.omegaDerivative(theta + 0.5 * k2) * step;
      const k4 = (omega + l3) * step;
      const l4 = this.omegaDerivative(theta + k3) * step;
      const newTheta = Pendulum.modAngle(
        theta + (k1 + 2 * k2 + 2 * k3 + k4) / 6
      );
      const newOmega = omega + (l1 + 2 * l2 + 2 * l3 + l4) / 6;

      // did the pendulum crossed the vertical axis (from below)
      // is the pendulum going from left to right or vice versa, or (is the pendulum on the vertical axis and changed position )
      if (newTheta * theta < 0 || (newTheta === 0 && theta !== 0)) {
        this.cross(i * step, (i + 1) * step, newOmega > 0, theta, newTheta);
      }

      // did the pendulum reach a turning point
      // is the pendulum changing is speed from left to right or is the angular speed zero but wasn't zero on the last update
      if (newOmega * omega < 0 || (newOmega === 0 && omega !== 0)) {
        this.peak(theta, newTheta);
      }

      theta = newTheta;
      omega = newOmega;
    }

    // update the angular variables
    this.angle = theta;
    this.angularVelocity = omega;

    this.calculateResults(theta);

    return this.angle;

    // update the derived variables, taking into account the transfer to thermal energy if friction is present
    // this.updateDerivedVariables( this.frictionProperty.value > 0 );
  }

  /**
   * Function that emits when the pendulum is crossing the equilibrium point (theta=0)
   * Given that the time step is finite, we attempt to do a linear interpolation, to find the
   * precise time at which the pendulum cross the vertical.
   * @private
   *
   * @param {number} oldDT
   * @param {number} newDT
   * @param {boolean} isPositiveDirection
   * @param {number} oldTheta
   * @param {number} newTheta
   */
  cross(
    oldDT: number,
    newDT: number,
    isPositiveDirection: boolean,
    oldTheta: number,
    newTheta: number
  ) {
    // If we crossed near oldTheta, our crossing DT is near oldDT. If we crossed near newTheta, our crossing DT is close
    // to newDT.
    // const crossingDT = Utils.linear( oldTheta, newTheta, oldDT, newDT, 0 );
    // this.crossingEmitter.emit( crossingDT, isPositiveDirection );
  }

  /**
   * Sends a signal that the peak angle (turning angle) has been reached
   * It sends the value of the peak angle
   * @private
   *
   * @param {number} oldTheta
   * @param {number} newTheta
   */
  peak(oldTheta: number, newTheta: number) {
    // a slightly better estimate is turningAngle =  ( oldTheta + newTheta ) / 2 + (dt/2)*(oldOmega^2+newOmega^2)/(oldOmega-newOmega)
    const turningAngle =
      oldTheta + newTheta > 0
        ? Math.max(oldTheta, newTheta)
        : Math.min(oldTheta, newTheta);
    // this.peakEmitter.emit( turningAngle );
    if (turningAngle > 0) {
      this.swingCount++;
    }
  }

  /**
   * Takes our angle modulo 2pi between -pi and pi.
   * @public
   *
   * @param {number} angle
   * @returns {number}
   */
  static modAngle(angle: number): number {
    angle = angle % TWO_PI;

    if (angle < -Math.PI) {
      angle += TWO_PI;
    }
    if (angle > Math.PI) {
      angle -= TWO_PI;
    }

    return angle;
  }

  /**
   * Function that returns the instantaneous angular acceleration
   * @private
   *
   * @param {number} theta - angular position
   * @returns {number}
   */
  omegaDerivative(theta: number): number {
    return -(this.gravity / this.length) * Math.sin(theta);
  }

  // a function that sets the value by its argument
  setValue(string: string, value: number) {
    switch (string) {
      case "angle":
        this.setAngle(value);
        //console.log("angle", value);
        break;
      case "length":
        this.setLength(value);
        break;
      case "mass":
        this.setMass(value);
        break;
      case "gravity":
        this.setGravity(value);
        break;
    }
  }

  setLength(length: number) {
    // this.reset();
    // this.resetAnimation();
    this.length = length;
    this.calculateResults(this.angle);
    return this;
  }
  setAngle(angle: number) {
    this.resetAnimation();
    // this.angle = angle;
    //console.log(" in setANgleangle", angle);
    this.initialAngle = angle;
    this.calculateResults(angle);
    return this;
  }

  setMass(mass: number) {
    // this.reset();
    this.mass = mass;
    this.calculateResults(this.angle);
    return this;
  }

  setGravity(gravity: number) {
    // this.reset();
    this.resetAnimation();
    this.gravity = gravity;
    this.calculateResults(this.angle);
    return this;
  }
  resetAnimation() {
    this.swingCount = 0;
    this.angle = null;
    this.angularVelocity = 0;
    this.velocity = 0;
    this.accelaration = 0;
    this.kineticEnergy = 0;
  }

  calculateResults(theta: number) {
    this.height = this.length * (1 - Math.cos(theta));
    this.accelaration = this.gravity * Math.sin(theta);
    // this.velocity = this.length * this.angularVelocity;
    // sqrt(2 g delta h)
    this.velocity = Math.sqrt(
      2 *
        this.gravity *
        this.length *
        (Math.cos(theta) - Math.cos(this.initialAngle))
    );
    this.kineticEnergy = 0.5 * this.mass * this.velocity ** 2;
    this.potentialEnergy = this.mass * this.gravity * this.height;
    this.totalEnergy = this.kineticEnergy + this.potentialEnergy;
  }
}

export default Pendulum;
