import { MathJax } from "better-react-mathjax";

const TimePeriodCalcProcedure = () => {
  return (
    <div>
      <div className="mb-8 flex flex-col-reverse md:flex-row gap-2 justify-between items-center   ">
        <div>
          <p className="text-center text-3xl pt-3">Note on Time Period</p>
          <hr className="w-5/6 my-2" />

          <div className="text-left text-lg px-4">
            The time period of a pendulum is the time taken for the pendulum to
            complete one full oscillation.
            <br />
            For initial angle less than 10°, the time period is given by the
            formula: <br />
            <span className="text-3xl">
              <MathJax>{` $$ T = 2π\\sqrt{\\frac{l}{g}}$$ `}</MathJax>
            </span>
            where <i>T</i> is the time period, <i>l</i> is the length of the
            pendulum and <i>g</i> is the acceleration due to gravity.
            <br />
            For larger angles, the time period (<i>T</i>) can't be calculated
            using the above formula.
            <br />
          </div>
        </div>
        {/* <div>
        <Image src={pendulum_image} alt="Pendulum" width={480} />
      </div> */}
        <div className="w-full lg:w-1/3  flex-col border-2 rounded-lg bg-[#42b6c5]  items-center border-gray-950">
          <p className="text-center text-3xl ">Procedure</p>
          <div className="flex flex-row items-center pt-2 mx-5  lg:mx-4 justify-between gap-2 lg:px-4">
            <div className="flex flex-col gap-2">
              <p className="text-left text-lg">
                <strong>Step 1:</strong> Set the initial angle, length of the
                pendulum, mass of the bob, acceleration due to gravity and the
                initial velocity of the bob.
              </p>
              <p className="text-left text-lg">
                <strong>Step 2:</strong> Click on the "Start" button to start
                the simulation.
              </p>
              <p className="text-left text-lg">
                <strong>Step 3:</strong> Observe the motion of the pendulum and
                the results.
              </p>
              <p className="text-left text-lg">
                <strong>Step 4:</strong> The time period is calculated by
                counting the time taken to complete the oscillations.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="text-left text-lg px-4">
        The above formula is derived using the assumption that the angle of
        oscillation is very small.
        <br />
        The actual derivation includes the equation of motion of the Pendulum as
        follows:
        <div className="text-left text-lg px-4">
          <span className="text-3xl">
            <MathJax>
              {` $$ \\frac{d^2θ}{dθ^2} + \\frac{g}{l}sin(θ) = 0 $$ `}
            </MathJax>
          </span>
        </div>
        where <i>θ</i> is the angle of oscillation, <i>g</i> is the acceleration
        due to gravity and <i>l</i> is the length of the pendulum.
        <br />
        The above equation is a second order ordinary differential equation
        which can't be solved using elementary methods (i.e. analytical methods)
        <br />
        Instead, the time period can be calculated using advanced calculus and
        differential equations which is
        <strong> beyond the scope of HSC Syllabus.</strong>
        <br />
        <br />
        In this simulation, the oscillation of the pendulum is calculated using
        a popular <strong>numerical method</strong> to solve the differential
        equation. The time period is calculated by counting the time taken to
        complete the oscillations.
      </div>
    </div>
  );
};

export default TimePeriodCalcProcedure;
