"use client";

import { ChevronRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type UserInfoModalOptionProps = {
  heading: string;
  description: string;
  handleClick: () => void;
};

export default function UserInfoModalOption({
  heading,
  description,
  handleClick,
}: UserInfoModalOptionProps) {
  return (
    <Card className="group hover:bg-muted/20">
      <CardContent
        className="flex cursor-pointer items-center gap-x-2 p-3"
        onClick={handleClick}
      >
        <ChevronRight className="h-5 w-5 shrink-0 transition group-hover:translate-x-1" />
        <div className="flex flex-col">
          <h3>{heading}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
