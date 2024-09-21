import { ComponentPropsWithoutRef } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { LucideIcon } from "lucide-react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { Switch } from "@/components/ui/switch";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

type SwithControlProps<T extends FieldValues> = ComponentPropsWithoutRef<
  typeof SwitchPrimitives.Root
> & {
  control: Control<T>;
  name: Path<T>;
  icon?: LucideIcon;
  label: string;
};

export default function SwitchControl<T extends FieldValues>({
  control,
  name,
  icon: Icon,
  label,
  ...props
}: SwithControlProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <FormItem className="flex flex-row items-center justify-between gap-x-3 rounded-md border p-4">
          <div className="flex items-center gap-x-2">
            {Icon && <Icon className="h-5 w-5 shrink-0" />}
            <FormLabel htmlFor={name}>{label}</FormLabel>
          </div>
          <FormControl>
            <Switch
              name={name}
              checked={value}
              onCheckedChange={onChange}
              {...props}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
