"use client";

import CalculateAndReset from "./CalculateAndReset";
import ComponentInput from "./ComponentInput";
import InputCircuit from "./InputCircuit";
import ResultSection from "./ResultSection";

const Page = () => {
  return (
    <>
      <div className="text-center text-2xl font-bold">
        Equivalent Resistance Calculator
      </div>
      <div className=" grid sm:grid-cols-5  ">
        <ComponentInput />
        <div className="w-full col-span-3 m-auto ">
          <InputCircuit />
        </div>
      </div>

      <section>
        <CalculateAndReset />
      </section>
      <section>
        <ResultSection />
      </section>
    </>
  );
};

export default Page;
