import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "@/components/settings/profile-form"
import { getSessionUser } from "@/components/get-session-user"
import postgres from "@/lib/db"
import { notFound, redirect } from "next/navigation"

export const metadata = {
     title: "Blogs - FalseNotes",
}

export default async function SettingsOrganizationPage() {
     const user = await getSessionUser()
     if (!user) {
          redirect("/signin")
     }
     const userData = await postgres.user.findFirst({
          where: { id: user.id },
          include: { urls: true }
     })
     if (!userData) {
          return notFound()
     }
     return (
          <div className="space-y-6">
               <div>
                    <h3 className="text-lg font-medium">Blogs</h3>
               </div>
               <Separator />
               <ProfileForm data={userData as any} />
          </div>
     )
}