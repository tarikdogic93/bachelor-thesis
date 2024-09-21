import { Control, FieldValues, Path } from "react-hook-form";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type SelectControlProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  items: { label: string; value: string }[];
  autoFocus?: boolean;
  placeholder?: string;
  trigger?: (name?: Path<T> | Path<T>[]) => void;
  disabled?: boolean;
};

export default function SelectControl<T extends FieldValues>({
  control,
  name,
  label,
  autoFocus,
  placeholder,
  items,
  trigger,
  disabled,
}: SelectControlProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <FormItem>
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <Select
            name={name}
            value={value}
            onValueChange={(selectedValue) => {
              onChange(selectedValue);

              if (trigger) {
                trigger();
              }
            }}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger
                id={name}
                className={cn(
                  "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  {
                    "text-accent-foreground": value,
                  },
                )}
                autoFocus={autoFocus}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <ScrollArea classNameViewport="max-h-40">
                <div className="w-full pr-4">
                  {items.map(({ label, value }) => (
                    <SelectItem
                      key={`select-item-${value}`}
                      className="cursor-pointer"
                      value={value}
                    >
                      {label}
                    </SelectItem>
                  ))}
                </div>
              </ScrollArea>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
