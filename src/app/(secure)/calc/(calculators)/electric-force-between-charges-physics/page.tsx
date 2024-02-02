"use client";

import { useMemo } from "react";
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

export default function ElectricForcePage() {
  const form = useForm({
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

  return (
    <div className="min-h-screen flex flex-col items-center gap-4">
      <Form {...form}>
        <form
          className="w-[32rem] p-5 rounded-lg border-slate-200 border"
          // onSubmit={onSubmit}
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
    </div>
  );
}
