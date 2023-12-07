import * as React from "react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"
import { Separator } from "./ui/separator"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
     return (
          <>
               <footer className={cn("container md:flex items-center gap-4 w-full flex-row justify-between py-6 border-t hidden text-sm text-muted-foreground", className)}>
                    <div className="copyright">
                         <p className="text-inherit  pb-0 mx-auto">
                              &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
                         </p>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-inherit">
                         <Link href="https://beta.faslenotes.dev">Beta</Link>
                         <Link target="_blank" href="https://github.com/falsenotes-dev/">GitHub</Link>
                         <Link target="_blank" href="https://twitter.com/falsenotesteam/">Twitter</Link>
                         <Link target="_blank" href="https://instagram.com/falsenotes.dev/">Instagram</Link>
                    </div>
                    <div className="">
                         <ModeToggle />
                    </div>
               </footer>
          </>
     )
}