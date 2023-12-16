import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

export default function StaticFields() {
  const form = useFormContext();

  return (
    <div className="flex flex-col gap-2">
      <FormField
        control={form.control}
        name="q1"
        render={({ field: input }) => (
          <FormItem className="flex items-center">
            <FormLabel className="flex-1" htmlFor="q1">
              Charge 1 (q<sub>1</sub>)
            </FormLabel>
            <Input
              id="q1"
              className="flex-[16rem]"
              type="number"
              defaultValue={0}
              {...input}
            />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="2"
        render={({ field: input }) => (
          <FormItem className="flex items-center">
            <FormLabel className="flex-1" htmlFor="2">
              Charge 1 (q<sub>2</sub>)
            </FormLabel>
            <Input
              id="2"
              className="flex-[16rem]"
              type="number"
              defaultValue={0}
              {...input}
            />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="d"
        render={({ field: input }) => (
          <FormItem className="flex items-center">
            <FormLabel className="flex-1" htmlFor="d">
              Diatsnce (d)
            </FormLabel>
            <Input
              id="d"
              className="flex-[16rem]"
              type="number"
              defaultValue={0}
              {...input}
            />
          </FormItem>
        )}
      />
    </div>
  );
}
