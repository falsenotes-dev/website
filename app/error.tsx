"use client";

import { Icons } from "@/components/icon";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 h-screen w-screen bg-pattern">
      <Icons.errorLogo className="-mt-[90px]" />
      <h2 className="font-medium text-3xl">Something went wrong!</h2>
      <Button size={"lg"} onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
