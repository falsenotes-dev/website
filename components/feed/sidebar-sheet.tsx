'use client'

import React from "react"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { Button } from "../ui/button"
import { Icons } from "../icon"

export default function SidebarSheet({ children, ...props }: { children: React.ReactNode } & React.ComponentPropsWithoutRef<typeof Sheet>) {
  return (
    <Sheet {...props}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10 relative hover:shadow-md hover:!bg-accent/10 hover:backdrop-blur-md">
          <div className="w-6 h-6">
            <Icons.menu />
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full max-w-xs">{children}</SheetContent>
    </Sheet>
  )
}