import { Label } from "@radix-ui/react-label";
import { MathJax } from "better-react-mathjax";
import React, { useState } from "react";

import constants, {
  momentOfInertiaSchema,
} from "~/components/project/moment_of_inertia/schema";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { formatNumber } from "~/lib/utils/formatNumber";
import {
  MomentOfInertiaObject,
  ShapesOfInertia,
  momentOfInertiaInput,
} from "~/services/Moment_of_inertia";

interface MOI_BasicProps {
  shape: ShapesOfInertia;
}

const MOI_Basic: React.FC<MOI_BasicProps> = ({ shape }) => {
  const [pointMassObject] = useState<momentOfInertiaSchema[0]["options"][0]>(
    constants.filter((option) => option.shape === shape)[0].options[0]
  );
  const [result, setResult] = useState<number>(NaN);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const inputs: Record<string, number> = {};

    for (const [name, value] of formData.entries()) {
      inputs[name] = Number(value);
    }
    console.log(inputs);

    const newPointMassObject = new MomentOfInertiaObject(
      inputs as unknown as momentOfInertiaInput,
      pointMassObject.shape,
      pointMassObject.case
    );

    const result = newPointMassObject.solve();
    console.log(result.inertiaMainAxis);
    setResult(result.inertiaMainAxis);
  }

  console.log(result);

  return (
    <div className="m-4">
      <h1 className="text-3xl font-bold text-center">Moment of Inertia</h1>
      <h2 className="text-2xl font-semibold italic pt-2 text-center">
        {pointMassObject.title}
      </h2>

      <div className="flex flex-col gap-4 m-4 p-2 items-start justify-center md:flex-row   ">
        <img
          src={pointMassObject.image}
          alt={pointMassObject.title}
          className="w-96 flex-wrap"
        />
        <ul className="text-left max-w-lg  text-lg  leading-6 text-gray-800 p-3 ">
          {pointMassObject.description.map((line) => (
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
            {pointMassObject.fields.map((field, index) => (
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
                  autoFocus={index == 0}
                />
              </div>
            ))}
            {/* <Button className="w-full mt-2">Calculate</Button> */}
            <div className="w-full mt-4 flex flex-row items-center justify-evenly">
              <Button
                onClick={() => setResult(NaN)}
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
      {!Number.isNaN(result) && (
        <p className="text-center text-lg leading-6  py-2">
          The moment of inertia is:{" "}
          <MathJax inline hideUntilTypeset={"first"}>
            {`\\(${formatNumber(result)} \\ kg \\ m^2\\)`}
          </MathJax>
        </p>
      )}
    </div>
  );
};

export default MOI_Basic;
