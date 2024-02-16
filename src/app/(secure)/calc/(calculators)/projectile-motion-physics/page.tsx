"use client";

import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";

import ResultsContainer from "~/components/project/projectile/ResultsContainer";
import { projectileSchema } from "~/components/project/projectile/schema";
import { projectileAtom } from "~/components/project/projectile/store";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import Projectile, { ProjectileInput } from "~/services/Projectile";

export default function ProjectilePage() {
  const [initialState, setInitialState] = useState(projectileSchema[0]);
  const [inputs, setInputs] = useState<Record<string, number>>({ g: 9.81 });
  // @ts-ignore
  const setProjectileParams = useSetAtom(projectileAtom);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const projectile = new Projectile(inputs as unknown as ProjectileInput);
    projectile.solve();
    // console.log(projectile);
    setProjectileParams({
      yi: projectile.yi,
      g: projectile.g,
      vi: projectile.vi,
      angle: projectile.angle,
      xm: projectile.xm,
      ym: projectile.ym,
      t: projectile.t,
    });
  }

  useEffect(() => {
    return () => {
      setProjectileParams(undefined);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center gap-4 mb-4">
      <h1 className="text-center text-4xl py-3 mt-3 text-primary font-bold leading-8 text-gray-900 ">
        Projectile Motion
      </h1>
      <form
        className="w-5/6 lg:w-[32rem] p-2 lg:p-5 rounded-lg border-slate-200 border"
        onSubmit={onSubmit}
      >
        <Select
          name="initialParams"
          value={initialState.name}
          onValueChange={(value) => {
            setInputs((prev) => ({ g: prev.g }));
            setProjectileParams(undefined);
            setInitialState(
              (prev) =>
                projectileSchema.find((state) => state.name === value) || prev
            );
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Known Parameters" />
          </SelectTrigger>
          <SelectContent>
            {projectileSchema.map((schema) => (
              <SelectItem key={schema.name} value={schema.name}>
                <div dangerouslySetInnerHTML={{ __html: schema.label }} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="mt-6 flex flex-col gap-2">
          <div className="flex items-center">
            <Label className="flex-1" htmlFor="g">
              Gravity
            </Label>
            <Input
              required
              id="g"
              name="g"
              className=" w-[20ch]"
              type="number"
              value={inputs.g}
              max={30}
              onChange={(e) =>
                setInputs({ ...inputs, g: +e.currentTarget.value })
              }
            />
          </div>
          {initialState.fields.map((field) => (
            <div className="flex items-center" key={field.name}>
              <Label
                className="flex-1"
                htmlFor={field.name}
                dangerouslySetInnerHTML={{ __html: field.label }}
              />
              <Input
                required
                id={field.name}
                name={field.name}
                className=" w-[20ch]"
                type={field.type}
                max={field.name == "angle" ? 90 : Infinity}
                value={inputs[field.name] || 0}
                onChange={(e) =>
                  setInputs({ ...inputs, [field.name]: +e.currentTarget.value })
                }
              />
            </div>
          ))}

          <Button
            className="justify-self-end"
            disabled={Object.keys(inputs).length < 3}
          >
            Calculate
          </Button>
        </div>
      </form>
      <ResultsContainer />
    </div>
  );
}
