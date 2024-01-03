import { Separator } from "@/components/ui/separator"
import { getSessionUser } from "@/components/get-session-user"
import { notFound, redirect } from "next/navigation"
import { getMembers } from "@/lib/prisma/session"
import { MembersForm } from "@/components/settings/members/members-form"
import { MembersList } from "@/components/settings/members/members-list"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import db from "@/lib/db"

export default async function SettingsOrganizationPage({ params }: { params: { username: string } }) {
     const user = await getSessionUser()
     if (!user) {
          redirect("/signin")
     }
     const userData = await db.user.findFirst({
          where: { username: decodeURIComponent(params.username).substring(1) },
          include: { urls: true }
     })
     if (!userData) {
          return notFound()
     }
     const { members } = await getMembers({ id: userData.id })
     return (
          <div className="space-y-6">
               <div className="flex w-full justify-between">
                    <div>
                         <h3 className="text-lg font-medium">Members</h3>
                         <p className="text-sm text-muted-foreground">
                              Manage your members of your blogs.
                         </p>
                    </div>
               </div>
               <Separator />
               <MembersForm session={user} />
               <Separator className="my-6" />
               {
                    members && members.length > 0 ? (
                         <MembersList data={members} />
                    ) : (
                         <EmptyPlaceholder>
                              <EmptyPlaceholder.Icon name="userGroup" />
                              <EmptyPlaceholder.Title>
                                   You don&apos;t have any members.
                              </EmptyPlaceholder.Title>
                         </EmptyPlaceholder>
                    )
               }
          </div>
     )
}