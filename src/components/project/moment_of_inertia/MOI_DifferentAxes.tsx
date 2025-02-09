/**
 * this component is used by the following components:
 *
 * Rectangular plate
 * Rod
 * Solid cuboid
 *
 */

"use client";

import React, { useEffect, useState } from "react";

import { MathJax } from "better-react-mathjax";
import { useSetAtom } from "jotai";
import { useForm } from "react-hook-form";
import DynamicUnitInput from "~/components/common/DynamicUnitInput";
import constants, {
  momentOfInertiaSchema,
} from "~/components/project/moment_of_inertia/schema";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Form } from "~/components/ui/form";
import {
  MomentOfInertiaObject,
  ShapesOfInertia,
  momentOfInertiaInput,
  momentOfInertiaResult,
} from "~/services/Moment_of_inertia";
import ResultsTable from "./ResultsTable";
import {
  moiDifferentAxesInputDefaults,
  moiDifferentAxesInputsAtom,
} from "./store";

interface MOI_DifferentAxesProps {
  shape: ShapesOfInertia;
}

const MOI_DifferentAxes: React.FC<MOI_DifferentAxesProps> = ({ shape }) => {
  const form = useForm();

  // to update the input fields value in the animation :

  const setMoiDiffInputs = useSetAtom(moiDifferentAxesInputsAtom);

  const [calculationObject] = useState<momentOfInertiaSchema[0]["options"][0]>(
    constants.filter((option) => option.shape === shape)[0].options[0]
  );
  const [result, setResult] = useState<number[]>([]);

  function onSubmit(data: any) {
    const inputs: Record<string, number> = {};
    for (const [name, values] of Object.entries<any>(data)) {
      inputs[name] = calculationObject.fields
        .filter((e) => e.name == name)[0]
        ?.converter.convertDefault(values);
    }

    const newcalculationObject = new MomentOfInertiaObject(
      inputs as unknown as momentOfInertiaInput,
      calculationObject.shape,
      calculationObject.case
    );

    setMoiDiffInputs({
      mass: inputs.mass ?? moiDifferentAxesInputDefaults.mass,
      length: inputs.length ?? moiDifferentAxesInputDefaults.length,
      width: inputs.width ?? moiDifferentAxesInputDefaults.width,
      height: inputs.height ?? moiDifferentAxesInputDefaults.height,
      depth: inputs.depth ?? moiDifferentAxesInputDefaults.depth,
    });

    const result: momentOfInertiaResult = newcalculationObject.solve();
    setResult([
      result.inertiaMainAxis,
      result.inertiaSecondAxis ?? -1,
      result.inertiaEndAxis ?? -1,
    ]);
  }

  const reset = () => {
    form.reset();
    setResult([]);

    setMoiDiffInputs(moiDifferentAxesInputDefaults);
  };
  useEffect(() => {
    return () => {
      reset();
    };
  }, []);
  return (
    <div>
      <h2 className="text-2xl font-semibold italic pt-2 text-center">
        {calculationObject.title}
      </h2>
      <div className="flex flex-col sm:flex-row m-2 mx-10 gap-6 items-center justify-center">
        <ul className="text-left max-w-lg  text-lg  leading-6 text-gray-800 p-3 ">
          {calculationObject.description.map((line) => (
            <li key={line}>
              <MathJax inline hideUntilTypeset={"first"}>
                {line}
              </MathJax>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 mt-2 items-start justify-center">
          <Card>
            <CardHeader>
              <CardTitle>Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  className="w-full m-2 rounded-lg border-slate-200 border p-4 "
                  onSubmit={onSubmit}
                >
                  {calculationObject.fields.map((field) => (
                    <DynamicUnitInput
                      key={field.name}
                      label={field.label}
                      converter={field.converter}
                      name={field.name}
                      min={0}
                    />
                  ))}
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="destructive" type="reset" onClick={reset}>
                Reset
              </Button>
              <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                Calculate
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {result.length > 0 && (
        <div className="flex justify-center items-center mb-10">
          <div className="max-w-xl border-y-2 pt-2 border-slate-500">
            {result.length > 0 && (
              <ResultsTable
                firstColumn={calculationObject.axes}
                secondColumn={result}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MOI_DifferentAxes;
