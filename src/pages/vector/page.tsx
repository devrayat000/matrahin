import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormMessage,
} from "~/components/ui/form";
import Vector from "~/lib/vector";

const vectorSchema = z.object({
  a: z.tuple([
    z.string().transform(Number),
    z.string().transform(Number),
    z.string().transform(Number),
  ]),
  b: z.tuple([
    z.string().transform(Number),
    z.string().transform(Number),
    z.string().transform(Number),
  ]),
});

interface VectorResults {
  angle: number;
  resultantA: number;
  resultantB: number;
  dot: number;
  cross: Vector;
  add: Vector;
  sub: Vector;
}

export default function VectorPage() {
  const [result, setResult] = useState<VectorResults>();
  const form = useForm({
    defaultValues: {
      a: [0, 0, 0],
      b: [0, 0, 0],
    },
    resolver: zodResolver(vectorSchema),
  });

  function calculate(data: { a: number[]; b: number[] }) {
    const vecA = new Vector(data.a),
      vecB = new Vector(data.b);

    const dot = Vector.dot(vecA, vecB);
    const cross = Vector.cross(vecA, vecB);
    const add = Vector.add(vecA, vecB);
    const sub = Vector.sub(vecA, vecB);
    const resultantA = Vector.len(vecA);
    const resultantB = Vector.len(vecB);
    const angle = Math.acos(dot / (resultantA * resultantB));

    setResult({
      add,
      sub,
      dot,
      cross,
      resultantA,
      resultantB,
      angle: angle * (180 / Math.PI),
    });
  }

  useEffect(() => {
    console.log(result);
  }, [result]);

  return (
    <div className="min-h-screen flex flex-col items-center gap-4">
      <Form {...form}>
        <form
          className="w-[32rem] p-2 rounded-lg border-slate-200 border"
          onSubmit={form.handleSubmit(calculate)}
        >
          <h2 className="text-2xl text-center">Vector Calculaltor</h2>
          <div className="mt-3 flex flex-col gap-4 rounded-[inherit]">
            <fieldset className="flex flex-col gap-2 border-2 p-2 border-slate-200 rounded-[inherit] relative">
              <legend>Vectors</legend>

              <div className="flex items-center gap-5">
                <Label className="flex-1 font-bold">A</Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name="a.0"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <b>i</b>
                  </div>
                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name="a.1"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <b>j</b>
                  </div>
                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name="a.2"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <b>k</b>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <Label className="flex-1 font-bold">B</Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name="b.0"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <b>i</b>
                  </div>
                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name="b.1"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <b>j</b>
                  </div>
                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name="b.2"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <b>k</b>
                  </div>
                </div>
              </div>
            </fieldset>
            <Button className="justify-self-end">Calculate</Button>
          </div>
        </form>
      </Form>

      <div className="w-[32rem] p-2 rounded-lg border-slate-200 border">
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Parameters</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(result || {}).map(([param, val]) => (
              <TableRow key={param}>
                <TableCell className="font-medium">{param}</TableCell>
                <TableCell className="text-right">
                  {val instanceof Vector ? (
                    <span>
                      {val.x}
                      <b>i</b> + {val.y}
                      <b>j</b> + {val.z} <b>k</b>
                    </span>
                  ) : (
                    (val as number).toFixed(2)
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
