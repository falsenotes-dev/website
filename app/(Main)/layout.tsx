
import { getSessionUser } from '@/components/get-session-user';
import { MobileBottomNavbar } from '@/components/navbar/mobile-bottom-navbar';
import { MobileHeaderNavbar } from '@/components/navbar/mobile-nav';
import Navbar from '@/components/navbar/navbar';
import db from '@/lib/db';
import { addSearchHistory } from '@/lib/prisma/search-history';
import { getNotifications, getSearchHistory } from '@/lib/prisma/session';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FalseNotes - Where Creativity Takes Flight',
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSessionUser();
  const notifications = await db.notification.count({
    where: {
      receiverId: session?.id,
      read: false,
    },
  })

  const { searchHistory } = await getSearchHistory({ id: session?.id })

  return (
    <>
      <div className='min-h-screen mb-20'>
        <>
          <Navbar notifications={notifications} searchHistory={searchHistory} />
          <MobileHeaderNavbar notification={notifications} />
          {children}
        </>
      </div>
      <MobileBottomNavbar />
    </>
  )
}
