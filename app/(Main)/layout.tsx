
import { getSessionUser } from '@/components/get-session-user';
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
  const notifications = await db.notification.findMany({
    where: {
      receiverId: session?.id,
      read: false
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const { searchHistory } = await getSearchHistory({ id: session?.id })

  return (
    <div className='min-h-screen'>
      <>
        <Navbar notifications={notifications} searchHistory={searchHistory} />
        {children}
      </>
    </div>
  )
}
