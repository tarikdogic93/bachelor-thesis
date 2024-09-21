import { Control, FieldValues, Path } from "react-hook-form";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type InputOTPControlProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  disabled?: boolean;
};

export default function InputOTPControl<T extends FieldValues>({
  control,
  name,
  label,
  disabled,
}: InputOTPControlProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <FormItem>
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <FormControl>
            <InputOTP
              id={name}
              maxLength={8}
              value={value}
              onChange={onChange}
              disabled={disabled}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
