"use client";

import { useRef, useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { useOnClickOutside } from "usehooks-ts";
import { Check, ChevronDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type CommandControlProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  items: string[];
  placeholder?: string;
  autoFocus?: boolean;
  trigger?: (name?: Path<T> | Path<T>[]) => void;
  disabled?: boolean;
};

export default function CommandControl<T extends FieldValues>({
  control,
  name,
  label,
  items,
  placeholder,
  autoFocus,
  trigger,
  disabled,
}: CommandControlProps<T>) {
  const ref = useRef(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  function toggleItem(
    value: string,
    item: string,
    onChange: (value: string) => void,
  ) {
    const newItem = value === item ? "" : item;

    onChange(newItem);

    if (trigger) {
      trigger();
    }

    setIsPopoverOpen(false);
  }

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
        <FormItem>
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <Popover modal={true} open={isPopoverOpen}>
            <PopoverTrigger onClick={() => setIsPopoverOpen(true)} asChild>
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
                  autoFocus={autoFocus}
                  disabled={disabled || isPopoverOpen}
                >
                  <div className="flex w-full justify-between gap-x-2">
                    <span>{value || placeholder}</span>
                    <div className="flex items-center justify-between gap-x-1">
                      {value && (
                        <>
                          <X
                            className="h-4 w-4 shrink-0 text-muted-foreground"
                            onClick={(event) => {
                              event.stopPropagation();

                              onChange("");

                              if (trigger) {
                                trigger();
                              }
                            }}
                          />
                          <Separator
                            className="h-full bg-muted-foreground"
                            orientation="vertical"
                          />
                        </>
                      )}
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>
                  </div>
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start" ref={ref}>
              <Command>
                <CommandInput placeholder="Search" />
                <CommandList className="max-h-[135px]">
                  <CommandEmpty>Not found.</CommandEmpty>
                  <CommandGroup>
                    {items.map((item) => (
                      <CommandItem
                        key={`item-${item}`}
                        className="cursor-pointer gap-x-2"
                        onSelect={() => toggleItem(value, item, onChange)}
                      >
                        <Check
                          className={cn("h-4 w-4 shrink-0", {
                            "opacity-0": item !== value,
                          })}
                        />
                        <span>{item}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
