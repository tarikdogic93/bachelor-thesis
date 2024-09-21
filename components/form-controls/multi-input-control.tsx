"use client";

import { InputHTMLAttributes } from "react";
import { X } from "lucide-react";
import {
  Control,
  FieldValues,
  Path,
  ArrayPath,
  useFieldArray,
  FieldArray,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type MultiInputControlProps<T extends FieldValues> =
  InputHTMLAttributes<HTMLInputElement> & {
    control: Control<T>;
    name: Path<T>;
    label: string;
    buttonText: string;
    inputAutoFocus?: number;
    buttonAutoFocus?: boolean;
  };

export default function MultiInputControl<T extends FieldValues>({
  control,
  name,
  label,
  disabled,
  buttonText,
  inputAutoFocus,
  buttonAutoFocus,
  ...props
}: MultiInputControlProps<T>) {
  const { fields, append, remove } = useFieldArray({
    name: name as ArrayPath<T>,
    control,
  });

  return (
    <div>
      {fields.map(({ id }, index) => (
        <FormField
          key={id}
          control={control}
          name={`${name}.${index}.value` as Path<T>}
          render={({ field: { name, value, onChange } }) => (
            <FormItem>
              <FormLabel
                htmlFor={name}
                className={cn(index !== 0 && "sr-only")}
              >
                {label}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    id={name}
                    className="pr-6"
                    type="text"
                    autoComplete="off"
                    value={value}
                    onChange={(event) => onChange(event.currentTarget.value)}
                    autoFocus={inputAutoFocus === index}
                    disabled={disabled}
                    {...props}
                  />
                  <X
                    className="absolute right-2 top-3 h-4 w-4 shrink-0 cursor-pointer"
                    onClick={() => remove(index)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      <Button
        className={cn({ "mt-2": fields.length > 0 })}
        type="button"
        variant="outline"
        size="sm"
        autoFocus={buttonAutoFocus}
        disabled={disabled}
        onClick={() => append({ value: "" } as FieldArray<T, ArrayPath<T>>)}
      >
        {buttonText}
      </Button>
    </div>
  );
}
