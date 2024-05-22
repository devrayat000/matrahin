"use client";

import ComponentInput from "./ComponentInput";
import ControlButtons from "./ControlButtons";
import InputCircuit from "./InputCircuit";
import ResultSection from "./ResultSection";

const Page = () => {
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

      <section className="mb-4">
        <ControlButtons />
      </section>
      <section>
        <ResultSection />
      </section>
    </>
  );
};

export default Page;
