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

export default function IterableFiels() {
  const form = useFormContext();
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
      <fieldset className="flex items-center gap-x-6 p-2 border border-slate-300 rounded-md">
        <legend>Test Charge</legend>
        <FormField
          control={form.control}
          name={`test.c`}
          render={({ field }) => (
            <FormItem className="flex-1 flex items-center gap-2 space-y-0">
              <FormLabel htmlFor={`test.c`}>charge</FormLabel>
              <FormControl>
                <Input
                  className="mt-0"
                  type="number"
                  defaultValue={0}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {initialParams === "f_net" && (
          <>
            <FormField
              control={form.control}
              name={`test.x`}
              render={({ field }) => (
                <FormItem className="basis-[20%] flex items-center gap-2 space-y-0">
                  <FormLabel htmlFor={`test.c`}>x</FormLabel>
                  <FormControl>
                    <Input
                      className="mt-0"
                      type="number"
                      defaultValue={0}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`test.y`}
              render={({ field }) => (
                <FormItem className="basis-[20%] flex items-center gap-2 space-y-0">
                  <FormLabel htmlFor={`test.c`}>y</FormLabel>
                  <FormControl>
                    <Input
                      className="mt-0"
                      type="number"
                      defaultValue={0}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}
      </fieldset>

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
          {fields.map((field, i) => (
            <div key={field.id} className="flex items-center gap-x-6">
              <FormField
                control={form.control}
                name={`charges.${i}.c`}
                render={({ field }) => (
                  <FormItem className="flex-1 flex items-center gap-2 space-y-0">
                    <FormLabel htmlFor={`charges.${i}.c`}>charge</FormLabel>
                    <FormControl>
                      <Input className="mt-0" type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`charges.${i}.x`}
                render={({ field }) => (
                  <FormItem className="basis-[20%] flex items-center gap-2 space-y-0">
                    <FormLabel htmlFor={`charges.${i}.c`}>x</FormLabel>
                    <FormControl>
                      <Input className="mt-0" type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`charges.${i}.y`}
                render={({ field }) => (
                  <FormItem className="basis-[20%] flex items-center gap-2 space-y-0">
                    <FormLabel htmlFor={`charges.${i}.c`}>y</FormLabel>
                    <FormControl>
                      <Input className="mt-0" type="number" {...field} />
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
      </fieldset>
    </div>
  );
}
