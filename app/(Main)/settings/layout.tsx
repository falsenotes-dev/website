import { Metadata } from "next"
import Image from "next/image"

import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/components/settings/sidebar-nav"
import { Toaster } from "@/components/ui/toaster"
import { SiteFooter } from "@/components/footer"

export const metadata: Metadata = {
  title: "Settings - FalseNotes",
  description: "Manage your account settings",
}

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/settings/profile",
  },
  {
    title: "Members",
    href: "/settings/members",
  },
  {
    title: "Account",
    href: "/settings/account",
    disabled: true,
  },
  // {
  //   title: "Appearance",
  //   href: "/settings/appearance",
  // },
  {
    title: "Blogs",
    href: "/settings/blogs",
  }
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex flex-col flex-auto max-w-screen" style={{ minHeight: "calc(100vh - 64px)" }}>
      <div className="space-y-6 md:p-10 pb-16 flex-1">
        <div className="space-y-0.5">

        </div>
        <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
          <aside className="-mx-4">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
              Manage your account.
            </p>
            <Separator className="my-6" />
            <SidebarNav items={sidebarNavItems} className="sticky top-24" />
          </aside>
          <div className="flex-1">{children}</div>
        </div>
      </div>
      <SiteFooter className="mt-auto" />
    </div>
  )
}