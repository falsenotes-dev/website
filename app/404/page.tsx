'use client';
import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icon"
import Balancer from "react-wrap-balancer"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils";
import { SparklesCore } from "@/components/ui/sparkles";
import { useTheme } from "next-themes";

export default function NotFound() {
  const pathname = usePathname()
  const theme = useTheme()
  return (
    <div className="flex flex-col items-center justify-center gap-6 h-screen w-full bg-background dark:bg-dot-white/[0.2] bg-dot-black/[0.2]" >
      <div className="w-full absolute inset-0 h-screen z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor={theme.resolvedTheme === "dark" ? "rgba(255, 255, 255, 1)" : "rgba(0, 0, 0, 1)"}
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-6 z-10">
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
    </div>
  )
}