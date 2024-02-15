"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
// import FormulaAndProcedures from "~/components/project/pendulum-3d/FormulaAndProcedures";

import Pendulum from "~/components/project/pendulum-3d/Pendulum";
import PendulumAnimation from "~/components/project/pendulum-3d/PendulumAnimation";
import PendulumInputs from "~/components/project/pendulum-3d/PendulumInput";
import PendulumResults from "~/components/project/pendulum-3d/Results";
// import TimePeriodCalcProcedure from "~/components/project/pendulum-3d/TimePeriodCalcProcedure";
import { INITIAL_VALUES } from "~/components/project/pendulum-3d/store";

const FormulaAndProcedures = dynamic(
  () => import("~/components/project/pendulum-3d/FormulaAndProcedures"),
  {
    ssr: false,
  }
);

const TimePeriodCalcProcedure = dynamic(
  () => import("~/components/project/pendulum-3d/TimePeriodCalcProcedure"),
  {
    ssr: false,
  }
);
export default function PendulumAnimationPage() {
  const pendulumRef = useRef<Pendulum>(null);

  useEffect(() => {
    if (!pendulumRef.current) {
      pendulumRef.current = new Pendulum(
        (INITIAL_VALUES.angle * Math.PI) / 180,
        INITIAL_VALUES.length,
        INITIAL_VALUES.mass,
        INITIAL_VALUES.gravity,
        0,
        0
      );
    }
  }, []);

  return (
    <div className="mb-8">
      <p className="text-center text-4xl pt-3">Simple Pendulum</p>

      <div className="grid md:grid-cols-10 grid-cols-1  my-2 justify-center items-center md:items-start">
        {/* Results */}
        <center className="order-3 md:col-span-3 md:order-1 ">
          <PendulumResults pendulumRef={pendulumRef} />
        </center>
        {/* Canvas */}
        <center className="md:col-span-5   order-1 md:order-2  ">
          <PendulumAnimation pendulumRef={pendulumRef} />
        </center>
        <center className="order-2 col-span-2 md:order-4  ">
          {/* Inputs */}
          <PendulumInputs pendulumRef={pendulumRef} />
        </center>
      </div>

      {/* Formula and procedures */}
      <center>
        <FormulaAndProcedures />
      </center>
      <center>
        <TimePeriodCalcProcedure />
      </center>
    </div>
  );
}
