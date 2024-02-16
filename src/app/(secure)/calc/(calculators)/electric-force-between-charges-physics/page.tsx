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

  // if device width is less than 640px, set canvas width to 100% of the screen

  const canvasHeight = (window.innerHeight * 5) / 6;
  const canvasWidth =
    window.innerWidth < 640 ? window.innerWidth : window.innerWidth / 2;
  // Offset for the new origin (y = 100)
  const yOriginOffset = canvasHeight / 2;
  const scale = 10;
  const Figure = () => (
    <svg
      width={canvasWidth}
      height={canvasHeight}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* axes */}
      {/* draw grid  */}
      <g stroke="lightgray" stroke-width="0.5">
        {Array.from({ length: canvasWidth / 2 / scale }, (_, index) => (
          <g>
            <line
              x1={canvasWidth / 2 + (index + 1) * scale * 2}
              y1="0"
              x2={canvasWidth / 2 + (index + 1) * scale * 2}
              y2={canvasHeight}
            />
            <line
              x1={canvasWidth / 2 - (index + 1) * scale * 2}
              y1="0"
              x2={canvasWidth / 2 - (index + 1) * scale * 2}
              y2={canvasHeight}
            />
          </g>
        ))}

        {Array.from({ length: canvasHeight / 2 / scale }, (_, index) => (
          <g>
            <line
              x1="0"
              y1={canvasHeight - yOriginOffset - (index + 1) * scale * 2}
              x2={canvasWidth}
              y2={canvasHeight - yOriginOffset - (index + 1) * scale * 2}
            />
            <line
              x1="0"
              y1={canvasHeight - yOriginOffset + (index + 1) * scale * 2}
              x2={canvasWidth}
              y2={canvasHeight - yOriginOffset + (index + 1) * scale * 2}
            />
          </g>
        ))}
      </g>
      {/* axes */}
      <g>
        {/* <!-- X-axis --> */}
        <line
          x1="0"
          y1={canvasHeight - yOriginOffset}
          x2={canvasWidth}
          y2={canvasHeight - yOriginOffset}
          stroke="black"
          strokeWidth="2"
        />

        {/* <!-- Y-axis --> */}
        <line
          x1={canvasWidth / 2}
          y1="0"
          x2={canvasWidth / 2}
          y2={canvasHeight}
          stroke="black"
          strokeWidth="2"
        />

        {/* <!-- X-axis label --> */}
        <text
          x={canvasWidth - 20}
          y={canvasHeight - yOriginOffset + 20}
          fontFamily="Arial"
          fontSize="12"
          fill="black"
        >
          X
        </text>

        {/* <!-- Y-axis label --> */}
        <text
          x={canvasWidth / 2 + 10}
          y="15"
          fontFamily="Arial"
          fontSize="12"
          fill="black"
        >
          Y
        </text>
      </g>
      {/* 1st case */}
      {initialParams === "f_2" && form.watch("d") && (
        <g>
          <line
            x1={canvasWidth / 2 - 75}
            y1={canvasHeight - yOriginOffset}
            x2={canvasWidth / 2 + 75}
            y2={canvasHeight - yOriginOffset}
            stroke="black"
            strokeWidth="2"
          />

          {/* arrow from q1 */}
          <line
            x1={canvasWidth / 2 - 100}
            y1={canvasHeight - yOriginOffset}
            x2={
              canvasWidth / 2 +
              (form.watch("q1") > 0 && form.watch("q2") > 0 ? -150 : -50)
            }
            y2={canvasHeight - yOriginOffset}
            stroke="black"
            strokeWidth="2"
            markerEnd="url(#arrowhead_1)"
          />

          {/* arrow from q2 */}
          <line
            x1={canvasWidth / 2 + 100}
            y1={canvasHeight - yOriginOffset}
            x2={
              canvasWidth / 2 +
              (form.watch("q1") > 0 && form.watch("q2") > 0 ? 150 : 50)
            }
            y2={canvasHeight - yOriginOffset}
            stroke="black"
            strokeWidth="2"
            markerEnd="url(#arrowhead_1)"
          />
          <defs>
            <marker
              id="arrowhead_1"
              markerWidth="10"
              markerHeight="7"
              refX="0"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="black" />
            </marker>
          </defs>
          <text
            x={canvasWidth / 2 + 10}
            y={canvasHeight - yOriginOffset + 30}
            fontFamily="Arial"
            fontSize="14"
            fill="black"
          >
            d = {form.watch("d")} m
          </text>

          <text x={canvasWidth / 2 - 110} y={canvasHeight - yOriginOffset + 30}>
            q1
          </text>
          <text x={canvasWidth / 2 + 90} y={canvasHeight - yOriginOffset + 30}>
            q2
          </text>

          <circle
            cx={canvasWidth / 2 - 100}
            cy={canvasHeight - yOriginOffset}
            r="10"
            fill="red"
          />

          <circle
            cx={canvasWidth / 2 + 100}
            cy={canvasHeight - yOriginOffset}
            r="10"
            fill="blue"
          />
        </g>
      )}

      {/* 2nd case */}
      {initialParams === "f_net" &&
        form.watch("charges") &&
        form.watch("test.c") && (
          <g>
            {form.watch("charges").map((charge, i) => {
              const testChargePositionX =
                form.watch("test.x") * scale + canvasWidth / 2;
              const testChargePositionY =
                canvasHeight - yOriginOffset - form.watch("test.y") * scale;
              const positionSelfX = charge.x * scale + canvasWidth / 2;
              const positionSelfY =
                canvasHeight - yOriginOffset - charge.y * scale;

              const isRepulsive = charge.c * Number(form.watch("test.c")) > 0;

              console.log(charge.c, form.watch("test.c"), isRepulsive);
              return (
                <g>
                  <text
                    x={positionSelfX + 15}
                    y={positionSelfY - 15}
                    color={!isRepulsive ? "red" : "blue"}
                  >
                    {charge.c} C
                  </text>
                  {charge.c != 0 && (
                    <g>
                      {!isRepulsive ? (
                        <line
                          x1={testChargePositionX}
                          y1={testChargePositionY}
                          x2={positionSelfX}
                          y2={positionSelfY}
                          stroke="red"
                          strokeWidth="2"
                          markerEnd={`url(#arrowhead_${i + 10})`} // Place the marker at the end of the line
                        />
                      ) : (
                        <line
                          x1={positionSelfX}
                          y1={positionSelfY}
                          x2={testChargePositionX}
                          y2={testChargePositionY}
                          stroke="blue"
                          strokeWidth="2"
                          markerEnd={`url(#arrowhead_${i + 10})`} // Place the marker at the end of the line
                        />
                      )}

                      <defs>
                        <marker
                          id={`arrowhead_${i + 10}`}
                          markerWidth="10"
                          markerHeight="7"
                          refX="10" // Set refX to the width of the marker
                          refY="3.5"
                          orient="auto"
                        >
                          <polygon
                            points="0 0, 10 3.5, 0 7"
                            fill={!isRepulsive ? "red" : "blue"}
                          />
                        </marker>
                      </defs>
                    </g>
                  )}
                  <circle
                    key={i}
                    cx={positionSelfX}
                    cy={positionSelfY}
                    r="10"
                    fill={charge.c < 0 ? "red" : "blue"}
                  />
                </g>
              );
            })}
            <circle
              cx={canvasWidth / 2 + form.watch("test.x") * scale}
              cy={canvasHeight - yOriginOffset - form.watch("test.y") * scale}
              r="10"
              fill="black"
            />

            <circle
              cx={canvasWidth / 2 + form.watch("test.x") * scale}
              cy={canvasHeight - yOriginOffset - form.watch("test.y") * scale}
              r="13"
              fill="none"
              stroke="green"
            />

            {form.watch("test.c") != 0 && (
              <text
                x={canvasWidth / 2 + form.watch("test.x") * scale + 15}
                y={
                  canvasHeight -
                  yOriginOffset -
                  form.watch("test.y") * scale -
                  15
                }
                color="black"
              >
                {form.watch("test.c")} C
              </text>
            )}

            {/* resultant force arrow */}
            {!!result && (
              <g>
                <line
                  x1={canvasWidth / 2 + form.watch("test.x") * scale}
                  y1={
                    canvasHeight - yOriginOffset - form.watch("test.y") * scale
                  }
                  x2={
                    canvasWidth / 2 +
                    form.watch("test.x") * scale +
                    10 * scale * Math.cos((result[angle] * Math.PI) / 180)
                  }
                  y2={
                    canvasHeight -
                    yOriginOffset -
                    form.watch("test.y") * scale +
                    10 * scale * Math.sin((result[angle] * Math.PI) / 180)
                  }
                  stroke="black"
                  strokeWidth="2"
                  markerEnd={`url(#arrowhead_2)`}
                />
                <defs>
                  <marker
                    id={`arrowhead_2`}
                    markerWidth="10"
                    markerHeight="7"
                    refX="0"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="black" />
                  </marker>
                </defs>
              </g>
            )}
          </g>
        )}
    </svg>
  );

  return (
    <div className="flex flex-col-reverse md:flex-row md:gap-2 items-center md:items-center justify-between">
      <div className=" md:self-start md:mt-4 md:w-[180px] md:h-[180px] ">
        {/* <div className=" "> */}
        <Figure />
      </div>
      <div className="bg-slate-300 z-10  flex md:w-1/3 m-2 p-2  flex-col items-center gap-4">
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
    </div>
  );
}
