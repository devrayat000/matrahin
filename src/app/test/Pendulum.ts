const TWO_PI = 2 * Math.PI;

class Pendulum {
  angle: number = 0;
  angularVelocity: number = 0;
  length: number = 1;
  mass: number = 1;

  gravity: number = 9.8;
  friction: number = 0;
  damping: number = 0;

  constructor(
    angle: number,
    angularVelocity: number,
    length: number,
    mass: number,
    gravity: number,
    friction: number,
    damping: number
  ) {
    this.angle = angle;
    this.angularVelocity = angularVelocity;
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

    return this.angle;

    // update the derived variables, taking into account the transfer to thermal energy if friction is present
    // this.updateDerivedVariables( this.frictionProperty.value > 0 );

    // this.stepEmitter.emit( dt );
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
   * @param {number} omega - angular velocity
   * @returns {number}
   */
  omegaDerivative(theta: number): number {
    return -(this.gravity / this.length) * Math.sin(theta);
  }

  setLength(length: number) {
    this.reset();
    this.length = length;
    return this;
  }

  reset() {
    this.angle = 0;
    this.angularVelocity = 0;
    this.length = 1;
    this.mass = 1;

    this.gravity = 9.8;
    this.friction = 0;
    this.damping = 0;
  }
}

export default Pendulum;
