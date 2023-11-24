import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import UmbrellaSteps from "~/components/project/rain/UmbrellaSteps";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import Vector from "~/lib/vector";

const rainSchema = z.object({
  rain: z.object({
    velocity: z.string().transform(Number),
    angle: z.string().transform(Number),
  }),
  object: z.object({
    velocity: z.string().transform(Number),
    angle: z.string().transform(Number),
  }),
  wind: z.object({
    velocity: z.string().transform(Number),
    angle: z.string().transform(Number),
  }),
});

const resultSchema = [
  {
    name: "angle",
    label: "Angle of umbrella",
  },
  {
    name: "relativeVelocity",
    label: "Relative velocity of rain",
  },
] as const;

type UmbrellaProperties = {
  [key in (typeof resultSchema)[number]["name"]]: number;
};

export default function RainManPage() {
  const [umbrellaProperties, setUmbrellaProperties] =
    useState<UmbrellaProperties>();
  const form = useForm({
    defaultValues: {
      rain: {
        velocity: "0",
        angle: "0",
      },
      object: {
        velocity: "0",
        angle: "0",
      },
      wind: {
        velocity: "0",
        angle: "0",
      },
    },
    resolver: zodResolver(rainSchema),
  });

  function getUmbrellaAngle(data: z.infer<typeof rainSchema>) {
    const vRain = Vector.fromLine(data.rain.velocity, data.rain.angle - 90);
    const vObject = Vector.fromLine(data.object.velocity, data.object.angle);
    const vWind = Vector.fromLine(data.wind.velocity, data.wind.angle);
    const vR = Vector.sub(vObject, vWind);

    const vr = Vector.sub(vRain, vR);

    const angle = 180 - Vector.angle(vr, new Vector([0, 1, 0]));

    setUmbrellaProperties({ angle, relativeVelocity: vr.len() });
  }

  useEffect(() => {
    const subscription = form.watch((_, { type }) => {
      if (type === "valueChange") setUmbrellaProperties(undefined);
    });
    return subscription.unsubscribe;
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center gap-4">
      <Form {...form}>
        <form
          className="w-[32rem] p-2 rounded-lg border-slate-200 border"
          // @ts-ignore
          onSubmit={form.handleSubmit(getUmbrellaAngle)}
        >
          <h2 className="text-2xl text-center font-semibold">
            Umbrella Calculaltor
          </h2>
          <div className="mt-3 flex flex-col gap-4 rounded-[inherit]">
            <fieldset className="flex gap-2 border p-2 border-slate-200 rounded-[inherit] relative">
              <legend>Rain</legend>
              <FormField
                control={form.control}
                name="rain.velocity"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel htmlFor="vr">Velocity</FormLabel>
                    <FormControl>
                      <Input id="vr" type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rain.angle"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel htmlFor="Tr">Angle</FormLabel>
                    <FormControl>
                      <Input id="Tr" type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </fieldset>
            <fieldset className="flex gap-2 border p-2 border-slate-200 rounded-[inherit]">
              <legend>Object</legend>
              <FormField
                control={form.control}
                name="object.velocity"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel htmlFor="vo">Velocity</FormLabel>
                    <FormControl>
                      <Input id="vo" type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="object.angle"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel htmlFor="To">Angle</FormLabel>
                    <FormControl>
                      <Input id="To" type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </fieldset>
            <fieldset className="flex gap-2 border p-2 border-slate-200 rounded-[inherit]">
              <legend>Wind</legend>
              <FormField
                control={form.control}
                name="wind.velocity"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel htmlFor="va">Velocity</FormLabel>
                    <FormControl>
                      <Input id="va" type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wind.angle"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel htmlFor="Ta">Angle</FormLabel>
                    <FormControl>
                      <Input id="Ta" type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </fieldset>

            <Button className="justify-self-end" type="submit">
              Calculate
            </Button>
          </div>
        </form>
      </Form>

      {!!umbrellaProperties && (
        <div className="w-[32rem] p-2 rounded-lg border-slate-200 border">
          <Accordion type="single" collapsible className="px-4">
            <AccordionItem value="steps">
              <AccordionTrigger>Show Steps</AccordionTrigger>
              <AccordionContent>
                {UmbrellaSteps.map((Step, i) => (
                  <div key={i} className="mt-1 first-of-type:mt-0">
                    <b>Step {i + 1}:</b> {/* @ts-ignore */}
                    <Step umbrella={umbrellaProperties} {...form.getValues()} />
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Table>
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead className="w-3/4">Parameters</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resultSchema.map(({ name, label }) => (
                <TableRow key={name}>
                  <TableCell
                    className="font-medium"
                    dangerouslySetInnerHTML={{
                      __html: label,
                    }}
                  />
                  <TableCell className="text-right">
                    {umbrellaProperties[name].toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
