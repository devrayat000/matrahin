"use client";

import { useMemo, useState } from "react";
import { useController, useForm, useWatch } from "react-hook-form";

import IterableFiels from "~/components/project/electric-force/IterableFields";
import StaticFields from "~/components/project/electric-force/StaticFields";
import { electricForceSchema } from "~/components/project/electric-force/schema";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { makeDegree } from "~/lib/utils";
import Vector from "~/lib/vector";

type ElectricForceParams =
  | {
      initialParams: "f_2";
      q1: number;
      q2: number;
      d: number;
    }
  | {
      initialParams: "f_net";
      charges: {
        c: number;
        x: number;
        y: number;
      }[];
      test: {
        c: number;
        x: number;
        y: number;
      };
    }
  | {
      initialParams: "f_neut";
      charges: {
        c: number;
        x: number;
        y: number;
      }[];
    };

const f = Symbol("Net electric force, f");
const angle = Symbol("Force angle from x");
const x = Symbol("x coordinate");
const y = Symbol("y coordinate");

type Results =
  | {
      initialParams: "f_2";
      [f]: number;
    }
  | {
      initialParams: "f_net";
      [f]: number;
      [angle]: number;
    }
  | {
      initialParams: "f_neut";
      [x]: number;
      [y]: number;
    };

export default function ElectricForcePage() {
  const [result, setResult] = useState<Results>(null);
  const form = useForm<ElectricForceParams, any, ElectricForceParams>({
    defaultValues: {
      initialParams: electricForceSchema[0].name,
    },
  });
  const initialParams = useWatch({
    control: form.control,
    name: "initialParams",
    exact: true,
  });
  const selectController = useController({
    name: "initialParams",
    control: form.control,
  });

  const body = useMemo(() => {
    switch (initialParams) {
      case "f_net":
      case "f_neut":
        return <IterableFiels key={initialParams} />;
      default:
        return <StaticFields />;
    }
  }, [initialParams]);

  function calculateEforce(q1: number, q2: number, d: number) {
    return 9e9 * ((q1 * q2) / d ** 2);
  }

  function calculateDistance(x: [number, number], y: [number, number]) {
    return Math.sqrt((x[0] - x[1]) ** 2 + (y[0] - y[1]) ** 2);
  }

  function getDegreeAngle(x: [number, number], y: [number, number]) {
    return makeDegree(Math.atan2(y[0] - y[1], x[0] - x[1]));
  }

  const onSubmit = form.handleSubmit((data) => {
    switch (data.initialParams) {
      case "f_2":
        setResult({
          initialParams: data.initialParams,
          [f]: calculateEforce(data.q1, data.q2, data.d),
        });
        break;
      case "f_net":
        const t = data.test;
        const totalForce = data.charges.reduce((prev, charge) => {
          const d = calculateDistance([t.x, charge.x], [t.y, charge.y]);
          const angle = getDegreeAngle([t.x, charge.x], [t.y, charge.y]);
          const f = calculateEforce(t.c, charge.c, d);
          const vec = Vector.fromLine(f, angle);
          return Vector.add(vec, prev);
        }, Vector.fromLine(0, 0));
        setResult({
          initialParams: data.initialParams,
          [f]: totalForce.len(),
          [angle]: totalForce.angle([999, 0, 0]),
        });
        break;
      case "f_neut":
        const neutralPoint = data.charges.reduce(
          (prev, charge) => {
            return {
              qixi: prev.qixi + charge.c * charge.x,
              qiyi: prev.qiyi + charge.c * charge.y,
              qi: prev.qi - -charge.c,
            };
          },
          { qixi: 0, qi: 0, qiyi: 0 }
        );
        setResult({
          initialParams: data.initialParams,
          [x]: neutralPoint.qixi / neutralPoint.qi,
          [y]: neutralPoint.qiyi / neutralPoint.qi,
        });
        break;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen flex flex-col items-center gap-4">
      <Form {...form}>
        <form
          className="w-[32rem] p-5 rounded-lg border-slate-200 border"
          onSubmit={onSubmit}
        >
          <Select
            name="initialParams"
            value={selectController.field.value}
            onValueChange={selectController.field.onChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Known Parameters" />
            </SelectTrigger>
            <SelectContent>
              {electricForceSchema.map((schema) => (
                <SelectItem key={schema.name} value={schema.name}>
                  <div dangerouslySetInnerHTML={{ __html: schema.label }} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="mt-6 flex flex-col gap-3">
            {body}

            <Button
              className="justify-self-end"
              // disabled={Object.keys(inputs).length < 3}
            >
              Calculate
            </Button>
          </div>
        </form>
      </Form>
      {!!result && (
        <div className="w-5/6 lg:w-[32rem] p-5 rounded-lg border-slate-200 border">
          <Table>
            <caption className="caption-top text-2xl border-b-2 pb-2">
              Results
            </caption>
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead className="w-full">Parameters</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.getOwnPropertySymbols(result).map((key) => {
                const value = result[key];

                return (
                  <TableRow key={key.description}>
                    <TableCell
                      className="font-medium"
                      dangerouslySetInnerHTML={{
                        __html: (key as symbol).description,
                      }}
                    />
                    <TableCell className="text-right">
                      {(value as number).toPrecision(4)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
