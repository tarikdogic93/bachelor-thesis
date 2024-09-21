import { ReactNode } from "react";

import LoadingContent from "@/components/contents/loading-content";
import AuthenticatedContent from "@/components/contents/authenticated-content";

type LayoutProps = {
  children: ReactNode;
};

export async function generateMetadata() {
  return {
    title: "Dashboard",
  };
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <LoadingContent />
      <AuthenticatedContent>{children}</AuthenticatedContent>
    </>
  );
}
