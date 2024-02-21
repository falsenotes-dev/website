'use client';
import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icon"
import Balancer from "react-wrap-balancer"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils";
import { SparklesCore } from "@/components/ui/sparkles";
import { useTheme } from "next-themes";
import { SiteFooter } from "@/components/footer";
import { ModeToggle } from "@/components/mode-toggle";
import { siteConfig } from "@/config/site";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
            Sorry 😔 — we couldn&apos;t find what you were looking for. If you think this is a mistake, please <Link href={`mailto:supp@falsenotes.dev?subject=Error%20404:%20https://${process.env.NEXT_PUBLIC_ENV === "beta" ? 'beta.' : ''}falsenotes.dev${pathname}`} className={cn(buttonVariants({ variant: 'link' }), "text-muted-foreground font-light px-0 text-base")}>contact us</Link>.
          </Balancer>
        </p>
        <Button size={"lg"} asChild>
          <Link href="/">
            Go back home
          </Link>
        </Button>
      </div>
      <footer className={cn("container md:flex items-center gap-4 w-full fixed bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-row justify-between py-6 border-t hidden text-sm text-muted-foreground font-normal")}>
        <div className="copyright">
          <p className="!text-inherit pb-0 mx-auto flex gap-1.5 items-center">
            <Icons.logoIcon className="w-5 h-5 text-inherit" /> &copy; {new Date().getFullYear()} {siteConfig.name}.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 !text-inherit">
          <Link href="/about" className={cn(buttonVariants({ variant: 'link' }), 'p-0 !text-inherit h-fit border-none focus-visible:ring-transparent font-normal')} >About</Link>
          <Link href="/privacy" className={cn(buttonVariants({ variant: 'link' }), 'p-0 !text-inherit h-fit border-none focus-visible:ring-transparent font-normal')} >Privacy</Link>
          <Link href="/terms" className={cn(buttonVariants({ variant: 'link' }), 'p-0 !text-inherit h-fit border-none focus-visible:ring-transparent font-normal')} >Terms</Link>
          <Link href="/beta" className={cn(buttonVariants({ variant: 'link' }), 'p-0 !text-inherit h-fit border-none focus-visible:ring-transparent font-normal')} >Beta</Link>
          <Link target="_blank" href="/store" className={cn(buttonVariants({ variant: 'link' }), 'p-0 !text-inherit h-fit border-none focus-visible:ring-transparent font-normal')} >Store</Link>
          <Link target="_blank" href="/github" className={cn(buttonVariants({ variant: 'link' }), 'p-0 !text-inherit h-fit border-none focus-visible:ring-transparent font-normal')} >GitHub</Link>
          <Link target="_blank" href="/twitter" className={cn(buttonVariants({ variant: 'link' }), 'p-0 !text-inherit h-fit border-none focus-visible:ring-transparent font-normal')} >Twitter</Link>
          <Link target="_blank" href="/instagram" className={cn(buttonVariants({ variant: 'link' }), 'p-0 !text-inherit h-fit border-none focus-visible:ring-transparent font-normal')} >Instagram</Link>
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: 'link' }), 'p-0 !text-inherit h-fit border-none focus-visible:ring-transparent font-normal')}>
              Donate
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link target="_blank" href="/donate">Buy Me A Coffee</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link target="_blank" href="https://patreon.com/FalseNotes">Patreon</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link target="_blank" href="https://paypal.me/falsenotes">PayPal</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link target="_blank" href="https://github.com/sponsors/falsenotes-dev">GitHub Sponsors</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex gap-x-4 gap-y-1 !text-inherit items-center">
          <ModeToggle />
        </div>
      </footer>
    </div>
  )
}