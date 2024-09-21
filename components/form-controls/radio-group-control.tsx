import { ComponentPropsWithoutRef } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type RadioGroupControlProps<T extends FieldValues> = ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Root
> & {
  control: Control<T>;
  name: Path<T>;
  label: string;
  items: { label: string; value: string }[];
};

export default function RadioGroupControl<T extends FieldValues>({
  control,
  name,
  label,
  items,
  ...props
}: RadioGroupControlProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <FormItem className="space-y-2">
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              name={name}
              className="flex w-full items-center"
              value={value}
              onValueChange={onChange}
              {...props}
            >
              {items.map((item) => (
                <FormItem
                  key={`radio-group-item-${item.value}`}
                  className="flex flex-1 items-center justify-center gap-x-2 space-y-0 rounded-md border px-4 py-2"
                >
                  <FormControl>
                    <RadioGroupItem value={item.value} />
                  </FormControl>
                  <FormLabel className="mt-0 font-normal">
                    {item.label}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
