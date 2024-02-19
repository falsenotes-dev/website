import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Notifications - FalseNotes',
}

export default function NotificationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="px-4">
      {children}
    </div>
  )
}
