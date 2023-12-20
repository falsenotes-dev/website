"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string,
    disabled?: boolean
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  const router = useRouter()
  return (
    <Tabs defaultValue={pathname} className={cn("flex w-full gap-6 items-start flex-1", className)}>
      <TabsList
        className={cn(
          "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 md:flex-col md:h-fit w-full bg-transparent",
          className
        )}
        {...props}
      >
        {items.map((item, index) => (
          <TabsTrigger
            value={item.href}
            key={index}
            disabled={item.disabled}
            onClick={() => {
              if (item.disabled) return
              router.push(item.href)
            }
            }
            className="w-full justify-start rounded-md data-[state=active]:bg-muted"
          >
            {item.title}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}