'use client'

import { Button } from "@/components/ui/button"

 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-screen w-screen">
      <h2 className="font-medium text-xl">Something went wrong!</h2>
      <Button size={'lg'} onClick={() => reset()}>Try again</Button>
    </div>
  )
}