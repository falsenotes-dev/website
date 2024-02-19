"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import { Icons } from "../icon"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string,
    disabled?: boolean
    new?: boolean
    icon: keyof typeof Icons
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  const router = useRouter()
  return (
    <Tabs defaultValue={pathname} className={cn("w-full gap-6 items-start mt-16", className)} orientation="vertical">
      <TabsList
        className={cn(
          "flex gap-2 flex-col w-full bg-transparent p-0",
          className
        )}
        {...props}
      >
        {items.map((item, index) => {
          const Icon = Icons[item.icon]
          return (
            <TabsTrigger
              value={item.href}
              key={index}
              disabled={item.disabled}
              onClick={() => {
                if (item.disabled) return
                router.push(item.href)
              }
              }
              className="w-full justify-between rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 py-2.5 px-5"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5" />  {item.title}</div> {item.new && <Badge>New</Badge>}
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}