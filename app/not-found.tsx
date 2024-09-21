"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-y-10 p-6">
      <div className="flex flex-col items-center gap-y-2 text-center">
        <p className="text-6xl font-medium">Oops!</p>
        <p className="text-xl text-muted-foreground">
          The page you are looking for does not exist. It might have been moved
          or deleted.
        </p>
      </div>
      <Button
        className="text-base font-semibold"
        variant="outline"
        onClick={() => router.back()}
      >
        Go back
      </Button>
    </div>
  );
}
