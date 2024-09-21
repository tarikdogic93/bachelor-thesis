import { ComponentPropsWithoutRef } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type CheckboxControlProps<T extends FieldValues> = ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> & {
  control: Control<T>;
  name: Path<T>;
  label: string;
  trigger?: (name?: Path<T> | Path<T>[]) => void;
};

export default function CheckboxControl<T extends FieldValues>({
  control,
  name,
  label,
  trigger,
  ...props
}: CheckboxControlProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <FormItem className="flex flex-row items-center gap-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              id={name}
              name={name}
              checked={value}
              onCheckedChange={(checked) => {
                onChange(checked);

                if (trigger) {
                  trigger();
                }
              }}
              {...props}
            />
          </FormControl>
          <FormLabel className="text-sm" htmlFor={name}>
            {label}
          </FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
