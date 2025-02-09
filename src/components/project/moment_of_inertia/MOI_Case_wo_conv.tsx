"use client";

import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";

import { MathJax } from "better-react-mathjax";
import constants, {
  momentOfInertiaSchema,
} from "~/components/project/moment_of_inertia/schema";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import {
  CaseOfInertia,
  MomentOfInertiaObject,
  ShapesOfInertia,
  momentOfInertiaInput,
  momentOfInertiaResult,
} from "~/services/Moment_of_inertia";
import ResultsTable from "./ResultsTable";
import Image from "next/image";

interface MOI_CasesProps {
  shape: ShapesOfInertia;
}

const MOI_Case: React.FC<MOI_CasesProps> = ({ shape }) => {
  const [index, setIndex] = useState<number>(0);
  const [calculationObject] = useState<momentOfInertiaSchema[0]["options"]>(
    constants.filter((option) => option.shape === shape)[0].options
  );

  const [result, setResult] = useState<number[]>([]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const inputs: Record<string, number> = {};

    for (const [name, value] of formData.entries()) {
      inputs[name] = Number(value);
    }
    console.log(inputs);

    if (
      calculationObject[index].case == CaseOfInertia.Hollow &&
      inputs["innerRadius"] > inputs["radius"]
    ) {
      alert("Inner radius must be smaller than outer radius");
      return;
    }

    const newcalculationObject = new MomentOfInertiaObject(
      inputs as unknown as momentOfInertiaInput,
      calculationObject[index].shape,
      calculationObject[index].case
    );
    const result: momentOfInertiaResult = newcalculationObject.solve();
    setResult([
      result.inertiaMainAxis,
      result.inertiaSecondAxis ?? -1,
      result.inertiaEndAxis ?? -1,
    ]);
  }

  const clearResults = () => {
    setResult([]);
  };

  return (
    <div className="m-4">
      <h1 className="text-3xl font-bold text-center">Moment of Inertia</h1>
      <h2 className="text-2xl font-semibold italic pt-2 text-center">
        {calculationObject[index].title}
      </h2>

      <div className="flex flex-row gap-2 pt-2 lg:pt-4 items-center justify-center">
        {calculationObject.map((option, i) => (
          <Button
            key={option.case}
            className={cn(
              i !== index
                ? "bg-slate-100 text-black"
                : "bg-green-500 text-white",
              "hover:text-white hover:bg-green-500"
            )}
            onClick={() => {
              setIndex(i), setResult([]);
            }}
          >
            {option.title}
          </Button>
        ))}
      </div>
      <div className="flex w-full flex-col gap-4   p-2 items-center justify-center lg:flex-row   ">
        <div className="flex  flex-col  items-center justify-center md:flex-row   ">
          {/* <figure className="basis-[45%]"> */}
          <Image
            {...calculationObject[index].image}
            alt={calculationObject[index].title}
            className="w-96 flex-wrap"
          />
          {/* </figure> */}
          <ul className="text-left max-w-lg  text-lg  leading-6 text-gray-800 p-3 ">
            {calculationObject[index].description.map((line) => (
              <li key={line}>
                <MathJax inline hideUntilTypeset={"first"}>
                  {line}
                </MathJax>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2  items-start justify-center">
            <form
              className="w-full m-2 rounded-lg border-slate-200 border p-4 "
              onSubmit={onSubmit}
            >
              <header className="text-center text-xl font-semibold leading-8 text-gray-900 py-2">
                Calculator
              </header>
              {calculationObject[index].fields.map((field) => (
                <div
                  className="flex items-center justify-center m-2"
                  key={field.name}
                >
                  <Label
                    className="flex-1"
                    htmlFor={field.name}
                    dangerouslySetInnerHTML={{ __html: field.label }}
                  />
                  <Input
                    id={field.name}
                    name={field.name}
                    className="flex-1 border-slate-950"
                    type={field.type}
                  />
                </div>
              ))}
              <div className="w-full mt-4 flex flex-row items-center justify-evenly">
                <Button
                  onClick={clearResults}
                  type="reset"
                  className="bg-red-600 px-8  text-white hover:bg-red-800 hover:text-white"
                >
                  Clear
                </Button>
                <Button type="submit">Calculate</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {result.length > 0 && (
        <div className="flex justify-center items-center mb-10">
          <div className="max-w-xl border-y-2 pt-2 border-slate-500">
            {result.length > 0 && (
              <ResultsTable
                firstColumn={calculationObject[index].axes}
                secondColumn={result}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MOI_Case;
