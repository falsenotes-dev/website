import ExploreTabs from "@/components/explore/navbar/navbar"
import { SiteFooter } from "@/components/footer"
import { MobileBottomNavbar } from "@/components/navbar/mobile-bottom-navbar"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Explore - FalseNotes',
}

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="mx-auto px-4 pt-5 md:mb-0 mb-20">
        {children}
      </div>
      <MobileBottomNavbar />
    </>
  )
}
