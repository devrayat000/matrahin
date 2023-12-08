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

export interface DynamicUnitInputProps<T extends string> {
  converter: UnitConverter<T>;
  name: string;
  label: string;
  required?: boolean;
  min?: string | number;
  description?: string;
}

export default function DynamicUnitInput<T extends string>({
  converter,
  name,
  label,
  required,
  min,
  description,
}: DynamicUnitInputProps<T>) {
  const form = useFormContext();
  const control = useController({
    name: `${name}.unit`,
    rules: { required: true },
    shouldUnregister: true,
    control: form.control,
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
          {...form.register(`${name}.value`, {
            valueAsNumber: true,
            required,
            min:
              typeof min !== "undefined"
                ? { value: min, message: `Minimum value is ${min}` }
                : undefined,
          })}
          required={required}
          min={min}
        />
        <Select
          onValueChange={control.field.onChange}
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
      {form.formState.errors[name]?.value?.message && (
        <FormMessage>
          {form.formState.errors[name]?.value?.message?.toString()}
        </FormMessage>
      )}
    </FormItem>
  );
}
