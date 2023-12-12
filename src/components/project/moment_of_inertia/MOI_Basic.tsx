/**
 * Represents a page component without cases for calculating moment of inertia.
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Label } from "@radix-ui/react-label";
import { MathJax } from "better-react-mathjax";
import React, { useState } from "react";

import constants, {
  momentOfInertiaSchema,
} from "~/components/project/moment_of_inertia/schema";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
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
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [result, setResult] = useState<number>(0);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newPointMassObject = new MomentOfInertiaObject(
      inputs as unknown as momentOfInertiaInput,
      pointMassObject.shape,
      pointMassObject.case
    );
    try {
      setResult(newPointMassObject.solve().inertiaMainAxis);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  return (
    <>
      <h1 className="text-center text-4xl py-3 text-primary font-bold leading-8 text-gray-900 ">
        Moment of Inertia
      </h1>
      <h2 className="text-center text-xl font-semibold leading-8 text-gray-900 pt-2">
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
            {pointMassObject.fields.map((field) => (
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
                  className="flex-1"
                  type={field.type}
                  value={inputs[field.name] || 0}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      [field.name]: +e.currentTarget.value,
                    })
                  }
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
          {!Number.isNaN(result) && (
            <p className="text-center text-lg leading-6  py-2">
              The moment of inertia is: {result}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default MOI_Basic;
