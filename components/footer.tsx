import * as React from "react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"
import { Separator } from "./ui/separator"
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuLabel,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { StatusWidget } from "@openstatus/react";
import { buttonVariants } from "./ui/button"
import { Icons } from "./icon"

export function SiteFooter({ className, size }: React.HTMLAttributes<HTMLElement> & { size?: "sm" | "lg" }) {
     return (
          <>
               <footer className={cn("container md:flex items-center gap-4 w-full flex-row justify-between py-6 border-t hidden text-sm text-muted-foreground font-normal", className)}>
                    <div className="copyright">
                         <p className="!text-inherit pb-0 mx-auto flex gap-1.5 items-center">
                              <Icons.logoIcon className="w-5 h-5 text-inherit" /> &copy; {new Date().getFullYear()} {siteConfig.name}.
                         </p>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 !text-inherit">
                         <Link href="/about" className={cn(buttonVariants({ variant: 'link', size: size }), 'p-0 !text-inherit h-fit border-none focus-visible:ring-transparent font-normal')} >About</Link>
                         <Link href="/privacy" className={cn(buttonVariants({ variant: 'link', size: size }), 'p-0 !text-inherit h-fit border-none focus-visible:ring-transparent font-normal')} >Privacy</Link>
                         <Link href="/terms" className={cn(buttonVariants({ variant: 'link', size: size }), 'p-0 !text-inherit h-fit border-none focus-visible:ring-transparent font-normal')} >Terms</Link>
                         <Link href="/beta" className={cn(buttonVariants({ variant: 'link', size: size }), 'p-0 !text-inherit h-fit border-none focus-visible:ring-transparent font-normal')} >Beta</Link>
                         <Link target="_blank" href="/store" className={cn(buttonVariants({ variant: 'link', size: size }), 'p-0 !text-inherit h-fit border-none focus-visible:ring-transparent font-normal')} >Store</Link>
                         <Link target="_blank" href="/github" className={cn(buttonVariants({ variant: 'link', size: size }), 'p-0 !text-inherit h-fit border-none focus-visible:ring-transparent font-normal')} >GitHub</Link>
                         <Link target="_blank" href="/twitter" className={cn(buttonVariants({ variant: 'link', size: size }), 'p-0 !text-inherit h-fit border-none focus-visible:ring-transparent font-normal')} >Twitter</Link>
                         <Link target="_blank" href="/instagram" className={cn(buttonVariants({ variant: 'link', size: size }), 'p-0 !text-inherit h-fit border-none focus-visible:ring-transparent font-normal')} >Instagram</Link>
                         <DropdownMenu>
                              <DropdownMenuTrigger className={cn(buttonVariants({ variant: 'link', size: size }), 'p-0 !text-inherit h-fit border-none focus-visible:ring-transparent font-normal')}>
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
                         <div className="statuswidget">
                              <StatusWidget slug="falsenotes" />
                         </div>
                         <ModeToggle />
                    </div>
               </footer>
          </>
     )
}