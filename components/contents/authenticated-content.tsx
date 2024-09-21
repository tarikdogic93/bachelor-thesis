"use client";

import { ReactNode } from "react";
import { Authenticated } from "convex/react";
import NextTopLoader from "nextjs-toploader";

import ModalsProvider from "@/providers/modals-provider";
import NavigationEvents from "@/components/layouts/navigation-events";
import DashboardLayout from "@/components/layouts/dashboard-layout";

type AuthenticatedContentProps = {
  children: ReactNode;
};

export default function AuthenticatedContent({
  children,
}: AuthenticatedContentProps) {
  return (
    <Authenticated>
      <NextTopLoader
        color={`var(--zinc-500)`}
        showSpinner={false}
        initialPosition={0.3}
      />
      <NavigationEvents />
      <ModalsProvider>
        <div className="flex min-h-screen">
          <DashboardLayout>{children}</DashboardLayout>
        </div>
      </ModalsProvider>
    </Authenticated>
  );
}
