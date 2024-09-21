import { Loader, Loader2, LucideIcon, Webhook } from "lucide-react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      default: "h-14 w-14",
      icon: "h-6 w-6",
      sm: "h-10 w-10",
      lg: "h-20 w-20",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

type SpinnerProps = VariantProps<typeof spinnerVariants> & {
  className?: string;
  type: "circular" | "radial" | "triad";
};

export const Spinner = ({ className, type, size }: SpinnerProps) => {
  let Icon: LucideIcon;

  switch (type) {
    case "circular":
      Icon = Loader2;
      break;
    case "radial":
      Icon = Loader;
      break;
    case "triad":
      Icon = Webhook;
      break;
    default:
      Icon = Loader2;
  }

  return <Icon className={cn(spinnerVariants({ size }), className)} />;
};
