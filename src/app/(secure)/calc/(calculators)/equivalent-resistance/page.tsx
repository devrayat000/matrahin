"use client";

import { useRef } from "react";
import ComponentInput from "~/components/project/equi-resistance/ComponentInput";
import ControlButtons from "~/components/project/equi-resistance/ControlButtons";
import FinalResult from "~/components/project/equi-resistance/FinalResult";
import InputCircuit from "~/components/project/equi-resistance/InputCircuit";
import ResultSection from "~/components/project/equi-resistance/ResultSection";

const Page = () => {
  const resultSectionRef = useRef(null);
  return (
    <>
      <h1 className=" text-center m-auto text-4xl font-bold">
        Equivalent Resistance Calculator
      </h1>
      <div className=" flex flex-col mx-4 sm:flex-row  ">
        <div className="sm:w-1/3 sm:self-start">
          <ComponentInput />
        </div>
        <div className="w-full col-span-3 m-auto ">
          <InputCircuit />
        </div>
      </div>

      <section className="">
        <ControlButtons />
      </section>
      <section className="mb-4">
        <ResultSection resultRef={resultSectionRef} />
        <FinalResult />
      </section>
    </>
  );
};

export default Page;
