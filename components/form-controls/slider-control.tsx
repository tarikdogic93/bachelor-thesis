import { ComponentPropsWithoutRef } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { calculateProficiency } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type SliderControlProps<T extends FieldValues> = ComponentPropsWithoutRef<
  typeof SliderPrimitive.Root
> & {
  control: Control<T>;
  name: Path<T>;
  label: string;
};

export default function SliderControl<T extends FieldValues>({
  control,
  name,
  label,
  ...props
}: SliderControlProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <FormItem className="space-y-3">
          <div className="flex items-center justify-between">
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <div className="cursor-default rounded-md border px-2 py-0.5">
              <p className="text-sm text-muted-foreground">
                {value} - {calculateProficiency(value)}
              </p>
            </div>
          </div>
          <FormControl>
            <Slider
              className="cursor-pointer"
              rangeClassName="bg-from"
              trackClassName="bg-primary/20"
              name={name}
              value={[value]}
              onValueChange={(values) => {
                onChange(values[0]);
              }}
              {...props}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
