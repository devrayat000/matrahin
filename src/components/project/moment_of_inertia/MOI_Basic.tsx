/**
 * This component is used in the following components:
 *
 * point mass
 * two point mass
 */

"use client";

import { MathJax } from "better-react-mathjax";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "~/components/ui/form";

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
  const form = useForm();

  const [pointMassObject] = useState<momentOfInertiaSchema[0]["options"][0]>(
    constants.filter((option) => option.shape === shape)[0].options[0]
  );
  const [result, setResult] = useState<number>(NaN);

  function onSubmit(data: any) {
    const inputs: Record<string, number> = {};
    for (const [name, values] of Object.entries<any>(data)) {
      inputs[name] = pointMassObject.fields
        .filter((e) => e.name == name)[0]
        ?.converter.convertDefault(values);
    }
    const newPointMassObject = new MomentOfInertiaObject(
      inputs as unknown as momentOfInertiaInput,
      pointMassObject.shape,
      pointMassObject.case
    );

    const result = newPointMassObject.solve();
    setResult(result.inertiaMainAxis);
  }

  // console.log(result);

  const reset = () => {
    form.reset();
    setResult(NaN);
  };
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-2  items-center justify-center">
        <h2 className="text-2xl font-semibold italic pt-2 text-center">
          {pointMassObject.title}
        </h2>
        <ul className="text-left max-w-lg  text-lg  leading-6 text-gray-800  ">
          {pointMassObject.description.map((line) => (
            <li key={line}>
              <MathJax inline hideUntilTypeset={"first"}>
                {line}
              </MathJax>
            </li>
          ))}
        </ul>
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
                {pointMassObject.fields.map((field) => (
                  // <div
                  //   className="flex items-center justify-center m-2"
                  //   key={field.name}
                  // >
                  //   <Label
                  //     className="flex-1"
                  //     htmlFor={field.name}
                  //     dangerouslySetInnerHTML={{ __html: field.label }}
                  //   />
                  //   <Input
                  //     id={field.name}
                  //     name={field.name}
                  //     className="flex-1 border-slate-950"
                  //     type={field.type}
                  //     autoFocus={index == 0}
                  //   />
                  // </div>
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
