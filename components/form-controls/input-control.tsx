"use client";

import { InputHTMLAttributes, useRef, useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { Eye, EyeOff, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type InputControlProps<T extends FieldValues> =
  InputHTMLAttributes<HTMLInputElement> & {
    control: Control<T>;
    name: Path<T>;
    label: string;
    trigger?: (name?: Path<T> | Path<T>[]) => void;
  };

export default function InputControl<T extends FieldValues>({
  control,
  type = "text",
  name,
  label,
  trigger,
  ...props
}: InputControlProps<T>) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <FormItem>
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <FormControl>
            {type === "password" ? (
              <div className="relative">
                <Input
                  className="pr-8"
                  id={name}
                  type={isPasswordVisible ? "text" : "password"}
                  autoComplete="off"
                  value={value}
                  onChange={(event) => {
                    onChange(event.currentTarget.value);

                    if (trigger) {
                      trigger();
                    }
                  }}
                  {...props}
                />
                {isPasswordVisible ? (
                  <Eye
                    className="absolute right-3 top-2 h-6 w-6 shrink-0 cursor-pointer text-muted-foreground"
                    onClick={() => setIsPasswordVisible(false)}
                  />
                ) : (
                  <EyeOff
                    className="absolute right-3 top-2 h-6 w-6 shrink-0 cursor-pointer text-muted-foreground"
                    onClick={() => setIsPasswordVisible(true)}
                  />
                )}
              </div>
            ) : type === "file" ? (
              <div className="relative">
                <Input
                  className="p-0 pr-8 file:mr-3 file:h-full file:bg-muted file:px-3 file:py-2 file:font-normal"
                  id={name}
                  ref={inputRef}
                  type="file"
                  onChange={(event) =>
                    onChange(event.target?.files?.[0] || undefined)
                  }
                  {...props}
                />
                {value && (
                  <X
                    className="absolute right-3 top-3 h-4 w-4 shrink-0 cursor-pointer text-muted-foreground"
                    onClick={() => {
                      onChange(undefined);

                      if (inputRef.current) {
                        inputRef.current.value = "";
                      }
                    }}
                  />
                )}
              </div>
            ) : (
              <Input
                id={name}
                type={type}
                autoComplete="off"
                value={value}
                onChange={(event) => {
                  onChange(event.currentTarget.value);

                  if (trigger) {
                    trigger();
                  }
                }}
                {...props}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
