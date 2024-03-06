'use client'

import React from "react"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { Button } from "../ui/button"
import { Icons } from "../icon"
import { motion } from "framer-motion"

export default function SidebarSheet({ children, ...props }: { children: React.ReactNode } & React.ComponentPropsWithoutRef<typeof Sheet>) {
  return (
    <Sheet {...props}>
      <SheetTrigger asChild className="">
        <Button variant="default" size="icon" className="h-10 w-10 hover:shadow-md hidden md:inline-flex cursor-pointer fixed bottom-10 right-10 z-50 shadow-lg hover:backdrop-blur-md" asChild>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Icons.menu className="h-6 w-6" />
          </motion.div>
        </Button>
      </SheetTrigger>
      <SheetContent className="hidden md:flex w-full max-w-xs flex-col gap-4 overflow-y-scroll">{children}</SheetContent>
    </Sheet>
  )
}