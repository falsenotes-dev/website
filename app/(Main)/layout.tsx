import type { Metadata } from 'next'
import { ScrollArea } from '@/components/ui/scroll-area'
import LandingNavbar from '@/components/navbar/landing-navbar'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
     <LandingNavbar />
            <ScrollArea className='h-screen max-w-screen xl:px-36 2xl:px-64'>
              <div className='py-24 px-4 lg:px-8 md:px-6'>
                {children}
              </div>
            </ScrollArea>
    </>
  )
}
