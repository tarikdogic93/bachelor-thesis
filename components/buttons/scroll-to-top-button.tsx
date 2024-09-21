"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function toggleVisibility() {
      window.scrollY > 500 ? setIsVisible(true) : setIsVisible(false);
    }

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    isVisible &&
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
  };

  return (
    <>
      {isVisible && (
        <Button
          className="fixed bottom-6 right-4 rounded-full transition sm:right-14"
          size="icon"
          onClick={scrollToTop}
        >
          <ChevronUp size={64} />
        </Button>
      )}
    </>
  );
}
