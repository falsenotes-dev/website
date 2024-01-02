import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icon"
import Balancer from "react-wrap-balancer"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center bg-background gap-6 w-full" style={{ minHeight: 'calc(100vh - 100px)' }}>
      <Icons.errorLogo className="-mt-[90px]" />
      <h2 className="font-bold text-5xl">404</h2>
      <p className="text-muted-foreground font-light text-center w-full">
        <Balancer>
          This post cound not be found or has been deleted. Please try again.
        </Balancer>
      </p>
      <Button size={"lg"} asChild>
        <Link href="/">
          Go back home
        </Link>
      </Button>
    </div>
  )
}