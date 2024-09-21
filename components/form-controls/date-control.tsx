"use client";

import { useRef, useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { useOnClickOutside } from "usehooks-ts";
import { CalendarDays, X } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type DateControlProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  autoFocus?: boolean;
  trigger?: (name?: Path<T> | Path<T>[]) => void;
  disabledPastDates?: boolean;
  disabled?: boolean;
};

export default function DateControl<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  autoFocus,
  trigger,
  disabledPastDates = false,
  disabled,
}: DateControlProps<T>) {
  const ref = useRef(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  function handleClickOutside() {
    if (isPopoverOpen) {
      setIsPopoverOpen(false);
    }
  }

  useOnClickOutside(ref, handleClickOutside);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="w-fit" htmlFor={name}>
            {label}
          </FormLabel>
          <Popover open={isPopoverOpen}>
            <PopoverTrigger
              onClick={() => setIsPopoverOpen(true)}
              autoFocus={autoFocus}
              disabled={disabled}
              asChild
            >
              <FormControl>
                <Button
                  id={name}
                  className={cn(
                    "h-auto min-h-10 w-full px-3 font-normal text-accent-foreground",
                    {
                      "text-muted-foreground": !value,
                      "cursor-default disabled:opacity-100": isPopoverOpen,
                    },
                  )}
                  variant="outline"
                  disabled={disabled || isPopoverOpen}
                >
                  <div className="flex w-full justify-between gap-x-2">
                    <span>{value ? format(value, "PPP") : placeholder}</span>
                    <div className="flex items-center justify-between gap-x-1">
                      {value && (
                        <>
                          <X
                            className="h-4 w-4 shrink-0 text-muted-foreground"
                            onClick={(event) => {
                              event.stopPropagation();
                              onChange("");
                            }}
                          />
                          <Separator
                            className="h-full bg-muted-foreground"
                            orientation="vertical"
                          />
                        </>
                      )}
                      <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>
                  </div>
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" ref={ref}>
              <Calendar
                mode="single"
                selected={new Date(value)}
                onSelect={(selectedDate) => {
                  onChange(selectedDate?.toISOString());

                  if (trigger) {
                    trigger();
                  }

                  setIsPopoverOpen(false);
                }}
                disabled={(date) =>
                  disabledPastDates
                    ? date <= new Date()
                    : date > new Date() || date < new Date("1970-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
