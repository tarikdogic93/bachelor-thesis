import { TextareaHTMLAttributes } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type TextAreaControlProps<T extends FieldValues> =
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    control: Control<T>;
    name: Path<T>;
    label: string;
    labelSrOnly?: boolean;
  };

export default function TextAreaControl<T extends FieldValues>({
  control,
  name,
  label,
  labelSrOnly = false,
  ...props
}: TextAreaControlProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn({
            "space-y-0": labelSrOnly,
          })}
        >
          <FormLabel
            className={cn({
              "sr-only": labelSrOnly,
            })}
            htmlFor={name}
          >
            {label}
          </FormLabel>
          <FormControl>
            <Textarea id={name} {...field} {...props} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
