'use client';
import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icon"
import Balancer from "react-wrap-balancer"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils";

export default function NotFound() {
     const pathname = usePathname()
     return (
          <div className="flex flex-col items-center justify-center bg-background gap-6 w-full h-screen">
               <Icons.errorLogo className="-mt-[90px]" />
               <h2 className="font-bold text-5xl">404</h2>
               <p className="text-muted-foreground font-light text-center">
                    <Balancer>
                         Sorry 😔 — we couldn&apos;t find what you were looking for. If you think this is a mistake, please <Link href={`mailto:supp@bkhtdev.com?subject=Error%20404:%20https://${process.env.NEXT_PUBLIC_ENV === "beta" ? 'beta.' : ''}falsenotes.dev${pathname}`} className={cn(buttonVariants({ variant: 'link' }), "text-muted-foreground font-light px-0 text-base")}>contact us</Link>.
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