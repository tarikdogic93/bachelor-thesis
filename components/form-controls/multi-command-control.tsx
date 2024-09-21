"use client";

import { Control, FieldValues, Path } from "react-hook-form";
import { Check, ChevronDown, X, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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

type MultiCommandControlProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  items: string[];
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
};

export default function MultiCommandControl<T extends FieldValues>({
  control,
  name,
  label,
  items,
  placeholder,
  autoFocus,
  disabled,
}: MultiCommandControlProps<T>) {
  function toggleItem(
    values: string[],
    item: string,
    onChange: (value: string[]) => void,
  ) {
    const newItems = values.includes(item)
      ? values.filter((value) => value !== item)
      : [...values, item];

    onChange(newItems);
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value: values, onChange } }) => (
        <FormItem>
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <Popover modal={true}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  className={cn("h-auto min-h-10 w-full px-3")}
                  id={name}
                  variant="outline"
                  autoFocus={autoFocus}
                  disabled={disabled}
                >
                  <div className="flex w-full justify-between gap-x-2">
                    {values.length > 0 ? (
                      <div className="flex flex-wrap gap-x-2 gap-y-1">
                        {values.map((value: string) => (
                          <Badge
                            key={`selected-item-${value}`}
                            className="flex items-center gap-x-2"
                            onClick={(event) => {
                              event.stopPropagation();
                            }}
                          >
                            {value}
                            <XCircle
                              className="h-4 w-4 shrink-0"
                              onClick={() => {
                                toggleItem(values, value, onChange);
                              }}
                            />
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className={cn("text-sm text-muted-foreground")}>
                        {placeholder}
                      </span>
                    )}
                    <div className="flex items-center justify-between gap-x-1">
                      {values.length > 0 && (
                        <>
                          <X
                            className="h-4 w-4 shrink-0 text-muted-foreground"
                            onClick={(event) => {
                              event.stopPropagation();
                              onChange([]);
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
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search" />
                <CommandList className="max-h-[135px]">
                  <CommandEmpty>Not found.</CommandEmpty>
                  <CommandGroup>
                    {items.length > 0 &&
                      items.map((item) => {
                        const isSelected = values.includes(item);

                        return (
                          <CommandItem
                            key={`item-${item}`}
                            className="cursor-pointer gap-x-2"
                            onSelect={() => toggleItem(values, item, onChange)}
                          >
                            <Check
                              className={cn("h-4 w-4 shrink-0", {
                                "opacity-0": !isSelected,
                              })}
                            />
                            <span>{item}</span>
                          </CommandItem>
                        );
                      })}
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
