import { ReactNode } from "react";

import AuthModal from "@/components/modals/auth-modal";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <AuthModal />
      {children}
    </>
  );
}
