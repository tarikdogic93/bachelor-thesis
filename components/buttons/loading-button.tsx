import { ButtonHTMLAttributes } from "react";
import { VariantProps } from "class-variance-authority";

import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type LoadingButtonProps = {
  text?: string;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function LoadingButton({
  className,
  text,
  variant,
  size,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      className={className}
      variant={variant}
      size={size}
      disabled
      {...props}
    >
      <Spinner className="mr-2" type="circular" size="icon" />
      {text ? text : "Please wait"}
    </Button>
  );
}
