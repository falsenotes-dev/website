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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

  const sidebarNavItems: {
    title: string;
    href: string;
    new?: boolean;
    icon: keyof typeof Icons;
  }[] = [
      {
        title: "Profile",
        href: `/@${decodeURIComponent(params.username).substring(1)}/settings/profile`,
        icon: 'user',
      },
      {
        title: "Members",
        href: `/@${decodeURIComponent(params.username).substring(1)}/settings/members`,
        new: false,
        icon: "users",
      },
      // {
      //   title: "Appearance",
      //   href: `/@${decodeURIComponent(params.username).substring(1)}/settings/appearance`,
      // },
      {
        title: "Blogs",
        href: `/@${decodeURIComponent(params.username).substring(1)}/settings/blogs`,
        new: false,
        icon: "blogs",
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
    <div className="flex flex-col flex-auto items-center justify-center overflow-hidden" style={{ minHeight: "calc(100vh - 64px)" }}>
      <div className="flex flex-col flex-[1_0_auto] max-w-[1140px] min-w-[280px] w-full xl:px-0 px-3 py-8 relative">
        <div className="flex gap-6 flex-col-reverse md:flex-row w-full">
          <div className="flex-1 mt-16 w-full md:mt-0 md:w-max">{children}</div>
          <aside className="flex flex-col gap-6 w-full md:w-64">
            <div className="flex gap-2 flex-col items-center">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={user?.image || ''} alt={user?.name || user?.username} />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || user?.username?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant="secondary" className="h-8 w-8 bg-secondary/60 backdrop-blur-md hover:bg-secondary" asChild><Link href={`/@${user?.username}`} ><Icons.eye className="w-4 h-4" /></Link></Button>
                      </TooltipTrigger>
                      <TooltipContent>View Profile</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-xl font-bold leading-none flex flex-col justify-center items-center gap-1">{user?.name || user?.username} <span className="text-sm text-muted-foreground leading-none font-normal">
                  ({user?.username})
                </span></p>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm text-muted-foreground leading-none font-normal">
                    {session.id === user?.id ? 'Your personal account' : 'Blog'}
                  </p>
                  {
                    session.publications.some((publication: any) => publication.accessLevel === 'admin') && (
                      <DropdownMenu>
                        <DropdownMenuTrigger className="text-sm text-primary leading-none font-normal p-0 flex gap-1 items-center"><Icons.arrowDataTransferHorizontal className="h-4 w-4" /> <span>Switch settings context</span> </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-[250px]">
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
            <SidebarNav items={sidebarNavItems} />
          </aside>
        </div>
      </div>
      <SiteFooter className="mt-auto" />
    </div>
  )
}