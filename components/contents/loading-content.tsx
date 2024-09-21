"use client";

import { AuthLoading } from "convex/react";

import CustomLoading from "@/components/loading/custom-loading";

export default function LoadingContent() {
  return (
    <AuthLoading>
      <CustomLoading />
    </AuthLoading>
  );
}
