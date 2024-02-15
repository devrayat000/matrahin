"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import pendulum from "~/assets/cards/pendulum.jpg";
import DynamicUnitInput from "~/components/common/DynamicUnitInput";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  angleConverter,
  lenghtConverter,
  massConverter,
} from "~/lib/UnitConverter";
import UnitValue, { IUnitValue } from "~/lib/UnitValue";
import "~/lib/globals";

type PendulumParams = {
  aMax: IUnitValue<any>;
  a: IUnitValue<any>;
  vMax: IUnitValue<any>;
  v: IUnitValue<any>;
  T: IUnitValue<any>;
  eTotal?: IUnitValue<any>;
  eK?: IUnitValue<any>;
  eP?: IUnitValue<any>;
};

const pendulumSchema = {
  aMax: "Maximum displacement, a",
  a: "Displacement, x(θ)",
  vMax: "Maximum velocity, v<sub>max</sub>",
  v: "Velocity, v(θ)",
  T: "Period, T",
  eTotal: "Total energy, E<sub>total</sub>",
  eK: "Kinetic energy, E<sub>K</sub>",
  eP: "Potential energy, E<sub>P</sub>",
} satisfies Record<keyof PendulumParams, string>;

export default function PendulumCalculator() {
  const form = useForm();
  const [params, setParams] = useState<PendulumParams>();

  function calculate(data: any) {
    const L = lenghtConverter.convert(data.length, "m"),
      angle = angleConverter.convert(data.angle, "rad"),
      maxAngle = angleConverter.convert(data.maxAngle, "rad");

    const aMax = L.value * (1 - Math.cos(maxAngle.value)),
      a = L.value * (1 - Math.cos(angle.value)),
      vMax = Math.sqrt(2 * 9.80665 * aMax),
      v = Math.sqrt(2 * 9.80665 * (aMax - a)),
      T = 2 * Math.PI * Math.sqrt(L.value / 9.81);

    let newParams: PendulumParams = {
      aMax: new UnitValue(aMax, "m"),
      a: new UnitValue(a, "m"),
      vMax: new UnitValue(vMax, "m/s"),
      v: new UnitValue(v, "m/s"),
      T: new UnitValue(T, "s"),
    };

    if (data.mass.value) {
      const M = massConverter.convert(data.mass, "kg"),
        eTotal = new UnitValue(M.value * 9.80665 * aMax, "J"),
        eK = new UnitValue((M.value * v ** 2) / 2, "J"),
        eP = new UnitValue(M.value * 9.80665 * a, "J");

      newParams = {
        ...newParams,
        eTotal,
        eK,
        eP,
      };
    }

    setParams(newParams);
  }

  function reset() {
    form.reset();
    setParams(undefined);
  }

  return (
    <div className="m-4">
      <h1 className="text-3xl font-bold text-center">Pendulum Calculator</h1>
      <div className="mt-12 flex gap-4 mx-auto max-w-4xl">
        <figure className="basis-[45%]">
          <Image {...pendulum} alt="Pendulum physics" />
        </figure>
        <section className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form>
                  <div className="grid w-full items-center gap-2">
                    <DynamicUnitInput
                      label="Working length, L"
                      converter={lenghtConverter}
                      name="length"
                      required
                    />
                    <DynamicUnitInput
                      label="Maximum displacement angle, θ"
                      converter={angleConverter}
                      name="maxAngle"
                      required
                    />
                    <DynamicUnitInput
                      label="Bob mass, M (optional)"
                      converter={massConverter}
                      name="mass"
                      min={0}
                    />
                    <DynamicUnitInput
                      label="Displacement angle, α"
                      converter={angleConverter}
                      name="angle"
                      description="The angle from the vertical to calculate"
                      required
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="destructive" type="reset" onClick={reset}>
                Reset
              </Button>
              <Button type="submit" onClick={form.handleSubmit(calculate)}>
                Calculate
              </Button>
            </CardFooter>
          </Card>
        </section>
      </div>
      {!!params && (
        <div className="mt-8 grid place-items-center">
          <div className="p-2 rounded-lg border-slate-200 border w-[36rem]">
            <Table>
              {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
              <TableHeader>
                <TableRow>
                  <TableHead className="w-3/4">Parameters</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(params).map(([name, param]) => {
                  const label = pendulumSchema[name as keyof PendulumParams];
                  return (
                    <TableRow key={name}>
                      <TableCell
                        className="font-medium"
                        dangerouslySetInnerHTML={{
                          __html: label,
                        }}
                      />
                      <TableCell className="text-right">
                        {param.value.toCalc()} {param.unit}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
