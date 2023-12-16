import UnitConverter from "~/lib/UnitConverter";
import { FormDescription, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useController, useFormContext } from "react-hook-form";
import { useId } from "react";

export interface DynamicUnitInputProps<
  Units extends string,
  Name extends string
> {
  converter: UnitConverter<Units>;
  name: Name;
  label: string;
  required?: boolean;
  min?: string | number;
  description?: string;
}

type FormField<Units extends string, Name extends string> = {
  [Key in Name]: {
    value: number;
    unit: Units;
  };
};

export default function DynamicUnitInput<
  Units extends string,
  Name extends string
>({
  converter,
  name,
  label,
  required,
  min,
  description,
}: DynamicUnitInputProps<Units, Name>) {
  const form = useFormContext<FormField<Units, Name>>();

  const control = useController({
    // @ts-ignore
    name: `${name}.unit` as const,
    rules: { required: true },
    shouldUnregister: true,
    control: form.control,
    // @ts-ignore
    defaultValue: converter.units[0],
  });
  const id = useId();

  return (
    <FormItem>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <div className="flex">
        <Input
          id={id}
          type="number"
          defaultValue={0}
          className="flex-1 rounded-r-none"
          {...form.register(
            // @ts-ignore
            `${name}.value`,
            {
              valueAsNumber: true,
              required,
              min:
                typeof min !== "undefined"
                  ? { value: min, message: `Minimum value is ${min}` }
                  : undefined,
            }
          )}
          required={required}
          min={min}
        />
        <Select
          onValueChange={control.field.onChange}
          // @ts-ignore
          value={control.field.value}
        >
          <SelectTrigger className="w-20 rounded-l-none border-l-0">
            <SelectValue placeholder="Select a unit" />
          </SelectTrigger>
          <SelectContent>
            {converter.units.map((unit) => (
              <SelectItem key={unit} value={unit}>
                {unit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {description && <FormDescription>{description}</FormDescription>}
      {
        // @ts-ignore
        form.formState.errors[name]?.value?.message && (
          <FormMessage>
            {
              // @ts-ignore
              form.formState.errors[name]?.value?.message?.toString()
            }
          </FormMessage>
        )
      }
    </FormItem>
  );
}
