import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      {children}
    </div>
  );
}
