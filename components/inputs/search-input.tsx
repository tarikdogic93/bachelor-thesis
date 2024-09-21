import { ChangeEvent } from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type SearchInputProps = {
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function SearchInput({
  className,
  placeholder,
  disabled,
  onChange,
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Label className="sr-only" htmlFor="search">
        Search
      </Label>
      <Input
        id="search"
        className="pr-10"
        type="text"
        disabled={disabled}
        autoComplete="off"
        placeholder={placeholder}
        onChange={onChange}
      />
      <Search className="absolute right-3 top-2.5 h-5 w-5 shrink-0 text-muted-foreground" />
    </div>
  );
}
