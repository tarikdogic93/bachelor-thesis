"use client";

import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/nextjs";

import { AfterSSR } from "@/components/loading/afterSSR";

type ConvexWithClerkProviderProps = {
  children: ReactNode;
};

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string,
);

export default function ConvexWithClerkProvider({
  children,
}: ConvexWithClerkProviderProps) {
  return (
    <AfterSSR>
      <ClerkProvider>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          {children}
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </AfterSSR>
  );
}
