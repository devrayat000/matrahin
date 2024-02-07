"use client";

import { useEffect, useRef } from "react";
import Pendulum from "./Pendulum";
import PendulumAnimation from "./PendulumAnimation";
import PendulumInputs from "./PendulumInput";
import PendulumResults from "./Results";
import { INITIAL_VALUES } from "./store";
import FormulaAndProcedures from "./FormulaAndProcedures";

export default function PendulumAnimationPage() {
  const pendulumRef = useRef<Pendulum>(null);

  // refs for showing results live
  const angleResultRef = useRef<HTMLParagraphElement>(null);
  const velocityResultRef = useRef<HTMLParagraphElement>(null);
  const accelarationResultRef = useRef<HTMLParagraphElement>(null);
  const heightResultRef = useRef<HTMLParagraphElement>(null);
  const potentialEnergyResultRef = useRef<HTMLParagraphElement>(null);
  const kineticEnergyResultRef = useRef<HTMLParagraphElement>(null);
  const totalEnergyResultRef = useRef<HTMLParagraphElement>(null);
  const periodCounterRef = useRef<HTMLParagraphElement>(null);

  const resultRefs = {
    angleResultRef,
    velocityResultRef,
    accelarationResultRef,
    heightResultRef,
    potentialEnergyResultRef,
    kineticEnergyResultRef,
    totalEnergyResultRef,
    periodCounterRef,
  };

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
    <>
      <div className="grid md:grid-cols-4 grid-cols-1 gap-2 m-4 justify-center items-center md:items-start">
        {/* Results */}
        <center className="order-3 md:order-1 ">
          {/* <PendulumResults ref={PendulumRefs} /> */}
          <PendulumResults {...resultRefs} />
        </center>
        {/* Canvas */}
        <div className="md:col-span-2  order-1 md:order-2 flex flex-col gap-3 items-center justify-between  ">
          {/* <PendulumAnimation ref={pendulumAnimationRefs} /> */}
          <PendulumAnimation
            {...{
              pendulumRef,
              angleResultRef,
              velocityResultRef,
              accelarationResultRef,
              heightResultRef,
              potentialEnergyResultRef,
              kineticEnergyResultRef,
              totalEnergyResultRef,
              periodCounterRef,
            }}
          />
        </div>
        <div className="order-2 md:order-4  ">
          {/* Inputs */}
          <PendulumInputs pendulumRef={pendulumRef} />
        </div>
      </div>

      <center>
        {/* Formula and procedures */}
        <FormulaAndProcedures />
      </center>
    </>
  );
}
