"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useController, useForm, useWatch } from "react-hook-form";

import { useAtom } from "jotai";
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
import { textAppear } from "~/lib/animations";
import { makeDegree } from "~/lib/utils";
import Vector from "~/lib/vector";
import Animated from "../../Animated";
import {
  AxesAndGrid,
  Charges,
  ChargesForNeutralPoints,
  FirstCase,
  NetForce,
  NeutralPoint,
  ZoomControl,
  ZoomControlChips,
} from "./Simulation";
import { MAX_ZOOM, MIN_ZOOM, dimensionsAtom, scaleAtom } from "./store";

export type ElectricForceParams =
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

export type Results =
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

  const [{ canvasWidth, canvasHeight }, setDimensions] =
    useAtom(dimensionsAtom);
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) {
        setDimensions({
          canvasWidth: (window.innerWidth * 7) / 8,
          canvasHeight: window.innerHeight / 2,
          yOriginOffset: window.innerHeight / 4,
        });
      } else {
        setDimensions({
          canvasHeight: (window.innerHeight * 4) / 5,
          canvasWidth: window.innerWidth / 2,
          yOriginOffset: (window.innerHeight * 2) / 5,
        });
      }
    }
  }, []);

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

  // if device width is less than 640px, set canvas width to 100% of the screen

  const [scale, setScale] = useAtom(scaleAtom);

  return (
    <Animated className="mb-3">
      <motion.p variants={textAppear} className="text-center text-4xl pt-3">
        Static Electricity
      </motion.p>
      <div className="flex flex-col-reverse md:flex-row md:gap-2 items-center md:items-center justify-around md:mx-5">
        <div className="flex flex-col md:self-start items-center justify-center gap-2">
          <div className="self-center md:self-start md:mt-4  ">
            <div className="w-full h-full flex-col">
              <svg
                style={{
                  userSelect: "none",
                  border: "1px solid black",
                  boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.5)",
                }}
                onWheel={(e) => {
                  e.preventDefault();

                  if (e.deltaY > 0) {
                    setScale((prev) => (prev > MIN_ZOOM ? prev - 0.1 : prev));
                  } else {
                    setScale((prev) => (prev < MAX_ZOOM ? prev + 0.1 : prev));
                  }
                }}
                width={canvasWidth}
                height={canvasHeight}
                viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
                xmlns="http://www.w3.org/2000/svg"
              >
                <AxesAndGrid />
                {initialParams === "f_2" &&
                  form.watch("d") &&
                  form.watch("q1") != 0 &&
                  form.watch("q2") != 0 && (
                    <FirstCase
                      key={"first-case"}
                      isAttractive={form.watch("q1") * form.watch("q2") > 0}
                      d={form.watch("d")}
                    />
                  )}

                {/* 2nd case */}
                {initialParams === "f_net" &&
                  form.watch("charges") &&
                  form.watch("test.c") && (
                    <g key="second-case">
                      <Charges
                        charges={form.watch("charges")}
                        test={form.watch("test")}
                      />
                      {!!result &&
                        form.watch("charges")[0].c &&
                        !isNaN(result[angle]) && (
                          <NetForce
                            angle={result[angle]}
                            force={result[f]}
                            test={form.watch("test")}
                          />
                        )}
                    </g>
                  )}

                {/* 3rd case */}
                {initialParams === "f_neut" &&
                  form.watch("charges") &&
                  form.watch("charges").length > 0 && (
                    <g>
                      <ChargesForNeutralPoints
                        key={"neutral-point"}
                        charges={form.watch("charges")}
                      />
                      {!!result && !isNaN(result[x]) && (
                        <NeutralPoint x={result[x]} y={result[y]} />
                      )}
                    </g>
                  )}

                {/* add + and - icon in svg to zoom in or out */}
                <ZoomControl />
              </svg>
            </div>
          </div>
          <ZoomControlChips />
        </div>
        <div className="bg-slate-300 z-10 md:self-start  flex md:w-1/3 m-2 p-2  flex-col items-center gap-4">
          <Form {...form}>
            <form
              className="w-full p-5 rounded-lg border-slate-200 border"
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
                            __html: key.description,
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
      </div>
    </Animated>
  );
}
