'use server'
import { getSessionUser } from "@/components/get-session-user"
import { MobileBottomNavbar } from "@/components/navbar/mobile-bottom-navbar"
import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
     return {
          title: "Home - FalseNotes",
          description: "The best place to share your thoughts",
     }
}

export default async function FeedLayout({
     children,
}: {
     children: React.ReactNode
}) {
     const session = await getSessionUser();
     return (
          <>
               <div className="md:flex content-center justify-center items-center flex-[0_0_auto] rounded-3xl gap-3 mb-4 h-min max-w-7xl min-w-[280px] w-full mx-auto md:mt-14 flex-col">
                    {children}
               </div>
               <MobileBottomNavbar session={session} />
          </>
     )
}
