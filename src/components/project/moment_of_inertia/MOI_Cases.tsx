"use client";

import React, { useState } from "react";

import { MathJax } from "better-react-mathjax";
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

const MOI_Cases: React.FC<MOI_CasesProps> = ({ shape }) => {
  const form = useForm();
  const [index, setIndex] = useState<number>(0);
  const [calculationObject] = useState<momentOfInertiaSchema[0]["options"]>(
    constants.filter((option) => option.shape === shape)[0].options
  );

  const [result, setResult] = useState<number[]>([]);

  function onSubmit(data: any) {
    const inputs: Record<string, number> = {};
    for (const [name, values] of Object.entries<any>(data)) {
      inputs[name] = calculationObject[index].fields
        .filter((e) => e.name == name)[0]
        .converter.convertDefault(values);
    }

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

  const reset = () => {
    form.reset();
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
                    {calculationObject[index].fields.map((field) => (
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

export default MOI_Cases;
