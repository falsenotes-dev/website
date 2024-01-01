import { Separator } from "@/components/ui/separator"
import { getSessionUser } from "@/components/get-session-user"
import { notFound, redirect } from "next/navigation"
import { getPublcations } from "@/lib/prisma/session"
import { BlogsForm } from "@/components/settings/blog-form"
import { EmptyPlaceholder } from "@/components/empty-placeholder"

export const metadata = {
     title: "Blogs - FalseNotes",
}

export default async function SettingsOrganizationPage() {
     const user = await getSessionUser()
     if (!user) {
          redirect("/signin")
     }
     const { publications: blogs } = await getPublcations({ id: user.id })
     return (
          <div className="space-y-6">
               <div className="flex w-full justify-between">
                    <div>
                         <h3 className="text-lg font-medium">Blogs</h3>
                         <p className="text-sm text-muted-foreground">
                              Manage your blogs.
                         </p>
                    </div>
               </div>
               <Separator />
               {
                    blogs && blogs.length > 0 ? (
                         <BlogsForm data={blogs} />
                    ) : (
                         <EmptyPlaceholder>
                              <EmptyPlaceholder.Icon name="blogs" />
                              <EmptyPlaceholder.Title>
                                   You are not a member of any blogs.
                              </EmptyPlaceholder.Title>
                         </EmptyPlaceholder>
                    )
               }
          </div>
     )
}