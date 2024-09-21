"use client";

import { ReactNode } from "react";
import { Undo2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ModalProps = {
  className?: string;
  headerClassName?: string;
  title: string;
  description: string;
  isOpen: boolean;
  children?: ReactNode;
  footer?: ReactNode;
  showBackButton?: boolean;
  handleBack?: () => void;
  handleClose: () => void;
};

export default function Modal({
  className,
  headerClassName,
  title,
  description,
  isOpen,
  children,
  footer,
  showBackButton,
  handleBack,
  handleClose,
}: ModalProps) {
  function handleChange(open: boolean) {
    if (!open) {
      handleClose();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleChange}>
      <DialogContent className={cn(className)}>
        {showBackButton && (
          <Button
            className="absolute right-10 top-3 h-fit w-fit p-1 text-accent-foreground opacity-70 transition-opacity hover:bg-transparent hover:opacity-100"
            variant="ghost"
            size="icon"
            onClick={handleBack}
          >
            <Undo2 className="h-[15px] w-[15px] shrink-0" />
          </Button>
        )}
        <DialogHeader className={cn(headerClassName)}>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
