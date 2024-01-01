import { Separator } from "@/components/ui/separator"
import { getSessionUser } from "@/components/get-session-user"
import { notFound, redirect } from "next/navigation"
import { getPublcations } from "@/lib/prisma/session"
import { BlogsForm } from "@/components/settings/blog-form"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { MembersForm } from "@/components/settings/members-form"

export const metadata = {
     title: "Blogs - FalseNotes",
}

export default async function SettingsOrganizationPage() {
     const user = await getSessionUser()
     if (!user) {
          redirect("/signin")
     }
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
          </div>
     )
}