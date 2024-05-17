"use client";

import ComponentInput from "./ComponentInput";
import InputCircuit from "./InputCircuit";
import ResultSection from "./ResultSection";

const Page = () => {
  return (
    <>
      <div className=" grid grid-cols-5  ">
        <ComponentInput />
        <div className="w-full col-span-3 m-auto ">
          <InputCircuit />
        </div>
      </div>

      <section>
        <ResultSection />
      </section>
    </>
  );
};

export default Page;
