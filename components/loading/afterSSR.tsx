"use client";

import { useEffect, useState, ReactNode } from "react";

type AfterSSRProps = {
  children: ReactNode;
};

export function AfterSSR({ children }: AfterSSRProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  if (!show) {
    return null;
  }

  return children;
}
