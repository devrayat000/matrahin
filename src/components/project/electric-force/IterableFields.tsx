import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import { useEffect } from "react";

type IterableFields = {
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
};

export default function IterableFiels() {
  const form = useFormContext<IterableFields>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "charges",
  });
  const initialParams = useWatch({ name: "initialParams" });

  useEffect(() => {
    append({ c: 0, x: 0, y: 0 });
    return () => {
      remove();
    };
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {initialParams === "f_net" && (
        <>
          <fieldset className="flex flex-col md:flex-row items-center gap-x-6 p-2 border border-slate-300 rounded-md">
            <legend>Test Charge</legend>
            <FormField
              control={form.control}
              defaultValue={0}
              name={`test.c`}
              render={({ field }) => (
                <FormItem className="flex-1 flex items-center gap-2 gap-y-0">
                  <FormLabel htmlFor={`test.c`}>charge</FormLabel>
                  <FormControl>
                    <Input className="mt-0" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`test.x`}
              defaultValue={0}
              render={({ field }) => (
                <FormItem className="basis-[20%] flex items-center gap-2 gap-y-0">
                  <FormLabel htmlFor={`test.c`}>x</FormLabel>
                  <FormControl>
                    <Input className="mt-0" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`test.y`}
              defaultValue={0}
              render={({ field }) => (
                <FormItem className="basis-[20%] flex items-center gap-2 gap-y-0">
                  <FormLabel htmlFor={`test.c`}>y</FormLabel>
                  <FormControl>
                    <Input className="mt-0" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </fieldset>
        </>
      )}

      <fieldset className="p-2 border border-slate-300 rounded-md">
        <legend>Other Charges</legend>
        <div className="flex flex-col gap-2">
          <Button
            size="icon"
            variant="outline"
            type="button"
            className="self-end"
            onClick={() => append({ c: 0, x: 0, y: 0 })}
          >
            <Plus className="w-4 h-4" />
          </Button>
          <div className="flex flex-col gap-y-4">
            {fields.map((field, i) => (
              <div
                key={field.id}
                className="flex flex-col md:flex-row items-center gap-x-6 gap-y-1"
              >
                <FormField<IterableFields, `charges.${number}.c`>
                  control={form.control}
                  defaultValue={0}
                  name={`charges.${i}.c`}
                  render={({ field }) => (
                    <FormItem className="flex-1 flex items-center gap-2 gap-y-0">
                      <FormLabel htmlFor={`charges.${i}.c`}>charge</FormLabel>
                      <FormControl>
                        <Input className="mt-0" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField<IterableFields, `charges.${number}.x`>
                  control={form.control}
                  defaultValue={0}
                  name={`charges.${i}.x`}
                  render={({ field }) => (
                    <FormItem className="basis-[20%] flex items-center gap-2 gap-y-0">
                      <FormLabel htmlFor={`charges.${i}.c`}>x</FormLabel>
                      <FormControl>
                        <Input className="mt-0" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField<IterableFields, `charges.${number}.y`>
                  control={form.control}
                  defaultValue={0}
                  name={`charges.${i}.y`}
                  render={({ field }) => (
                    <FormItem className="basis-[20%] flex items-center gap-2 gap-y-0">
                      <FormLabel htmlFor={`charges.${i}.c`}>y</FormLabel>
                      <FormControl>
                        <Input className="mt-0" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  size="icon"
                  variant="outline"
                  type="button"
                  onClick={() => remove(i)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </fieldset>
    </div>
  );
}
