import { Metadata } from "next"
import Image from "next/image"

import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/components/settings/sidebar-nav"
import { Toaster } from "@/components/ui/toaster"
import { SiteFooter } from "@/components/footer"
import { getSessionUser } from "@/components/get-session-user";
import db from "@/lib/db"
import { redirect } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Icons } from "@/components/icon"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Settings - FalseNotes",
  description: "Manage your account settings",
}

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default async function SettingsLayout({ children, params }: SettingsLayoutProps & { params: { username: string } }) {
  const session = await getSessionUser()
  if (!session) {
    return redirect(`/`)
  }

  const sidebarNavItems = [
    {
      title: "Profile",
      href: `/@${decodeURIComponent(params.username).substring(1)}/settings/profile`,
    },
    {
      title: "Members",
      href: `/@${decodeURIComponent(params.username).substring(1)}/settings/members`,
      new: false,
    },
    {
      title: "Account",
      href: `/@${decodeURIComponent(params.username).substring(1)}/settings/account`,
      disabled: true,
    },
    // {
    //   title: "Appearance",
    //   href: `/@${decodeURIComponent(params.username).substring(1)}/settings/appearance`,
    // },
    {
      title: "Blogs",
      href: `/@${decodeURIComponent(params.username).substring(1)}/settings/blogs`,
      new: false,
    }
  ]

  const user = await db.user.findFirst({
    where: { username: decodeURIComponent(params.username).substring(1) },
    include: {
      writers: {
        select: { authorId: true, accessLevel: true }
      }
    }
  })

  if (!user) {
    return redirect(`/`)
  }

  if (!user.writers.some((writer: any) => writer.authorId === session.id && writer.accessLevel === 'admin') && (user.id !== session.id)) {
    return redirect(`/`)
  }

  return (
    <div className="flex flex-col flex-auto max-w-screen" style={{ minHeight: "calc(100vh - 64px)" }}>
      <div className="space-y-6 pt-12 pb-16 flex-1 px-3">
        <div className="space-y-1">
          <div>
            <div className="flex justify-between flex-wrap gap-4">
              <div className="flex gap-2">
                <Avatar>
                  <AvatarImage src={user?.image || ''} alt={user?.name || user?.username} />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || user?.username?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="text-xl font-bold leading-none">{user?.name || user?.username} <span className="text-sm text-muted-foreground leading-none font-normal">
                    ({user?.username})
                  </span></p>
                  <div className="flex gap-2 items-start">
                    <p className="text-sm text-muted-foreground leading-none font-normal">
                      {session.id === user?.id ? 'Your personal account' : 'Blog'}
                    </p>
                    {
                      session.publications.some((publication: any) => publication.accessLevel === 'admin') && (
                        <DropdownMenu>
                          <DropdownMenuTrigger className="text-sm text-primary leading-none font-normal p-0 flex gap-1 items-center"><Icons.arrowDataTransferHorizontal className="h-4 w-4" /> <span>Switch settings context</span> </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="min-w-[250px]">
                            {
                              session.id !== user?.id && (
                                <DropdownMenuItem asChild>
                                  <Link href={`/@${session?.username}/settings/profile`} className="flex items-center">
                                    <Avatar className="h-6 w-6 mr-2 border">
                                      <AvatarImage src={session?.image || ''} alt={session?.name || session?.username} />
                                      <AvatarFallback>
                                        {session?.name?.charAt(0) || session?.username?.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col space-y-1">
                                      <p className="leading-none">@{session?.username}</p>
                                    </div>
                                    <DropdownMenuShortcut>
                                      <ChevronRight className="h-5 w-5" />
                                    </DropdownMenuShortcut>
                                  </Link>
                                </DropdownMenuItem>
                              )}
                            {session.publications.map((publication: any, index) => (
                              publication.accessLevel === 'admin' && (
                                publication.publicationId !== user.id && (
                                  <DropdownMenuItem asChild key={publication.id}>
                                    <Link href={`/@${publication.publication.username}/settings/profile`} className="flex items-center">
                                      <Avatar className="h-6 w-6 mr-2 border">
                                        <AvatarImage src={publication.publication.image} alt={publication.publication.name} />
                                        <AvatarFallback>
                                          {publication.publication.name?.charAt(0) || publication.publication.username?.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex flex-col space-y-1">
                                        <p className="leading-none">@{publication.publication.username}</p>
                                      </div>
                                      <DropdownMenuShortcut>
                                        <ChevronRight className="h-5 w-5" />
                                      </DropdownMenuShortcut>
                                    </Link>
                                  </DropdownMenuItem>
                                )
                              )
                            ))

                            }
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )
                    }
                  </div>
                </div>
              </div>
              <Button variant="outline" size={'sm'} asChild >
                <Link href={`/@${user.username}`} className="flex items-center">
                  <span>
                    {session.id === user?.id ? 'View your personal profile' : 'View blog profile'}
                  </span>
                </Link>
              </Button>
            </div>
            <Separator className="my-6" />
          </div>

        </div>
        <div className="grid flex-1 gap-12 md:grid-cols-[200px_1fr] w-full">
          <aside className="flex flex-col gap-6">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 mt-16 md:mt-0">{children}</div>
        </div>
      </div>
      <SiteFooter className="mt-auto" />
    </div>
  )
}