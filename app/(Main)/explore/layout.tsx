'use server'
import ExploreTabs from "@/components/explore/navbar/navbar"
import { SiteFooter } from "@/components/footer"
import { getSessionUser } from "@/components/get-session-user"
import { MobileBottomNavbar } from "@/components/navbar/mobile-bottom-navbar"
import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Explore - FalseNotes',
    openGraph: {
      title: 'Explore - FalseNotes',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@falsenotesteam',
    },
  }
}

export default async function ExploreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSessionUser()
  return (
    <>
      <div className="mx-auto px-4 pt-5 md:mb-0 mb-20">
        {children}
      </div>
      <MobileBottomNavbar session={session} />
    </>
  )
}
