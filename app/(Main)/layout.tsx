
import { getSessionUser } from '@/components/get-session-user';
import Navbar from '@/components/navbar/navbar';
import postgres from '@/lib/postgres';
import { getNotifications } from '@/lib/prisma/session';
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
  const notifications = await postgres.notification.findMany({
    where: {
      receiverId: session?.id,
      read: false
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  
  return (
    <div className='min-h-screen'>
      <>
            <Navbar notifications={notifications} />
            {children}
          </>
    </div>
  )
}
