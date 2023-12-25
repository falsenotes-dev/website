import { formatNumberWithSuffix } from '@/components/format-numbers';
import postgres from '@/lib/postgres';
import type { Metadata } from 'next'

type Props = {
  params: { username: string }
  children: React.ReactNode
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  try {
    const decodedUsername = decodeURIComponent(params.username);
    const user = await postgres.user.findUnique({
      where: {
        username: decodedUsername.substring(1)
      },
      select: {
        name: true,
        username: true,
        bio: true,
        image: true,
        _count: {
          select: {
            posts: {
              where: {
                published: true
              }
            },
          }
        }
      }
    })

    if (!user) {
      return {
        title: `Not Found - FalseNotes`,
        description: `The page you were looking for doesn't exist.`,
        openGraph: {
          title: `Not Found - FalseNotes`,
          description: `The page you were looking for doesn't exist.`,

        },
        twitter: {
          card: 'summary',
          title: `Not Found - FalseNotes`,
          description: `The page you were looking for doesn't exist.`,
        },
      }
    }

    return {
      metadataBase: new URL(`${process.env.DOMAIN}/@${user.username}`),
      title: `${user.name || user.username} - FalseNotes`,
      description: `Read writing from ${user.name || user.username} on FalseNotes. ${user?.bio === null || user?.bio === "" ? `${user?.username} has ${formatNumberWithSuffix(user?._count.posts)} posts. Follow their to keep up with their activity on FalseNotes.` : user?.bio}`,
      openGraph: {
        siteName: 'FalseNotes',
        title: `${user.name || user.username} - FalseNotes`,
        description: `Read writing from ${user.name || user.username} on FalseNotes. ${user?.bio === null || user?.bio === "" ? `${user?.username} has ${formatNumberWithSuffix(user?._count.posts)} posts. Follow their to keep up with their activity on FalseNotes.` : user?.bio}`,
        url: `${process.env.DOMAIN}/@${user.username}`,
        ...user?.image && {
          images: [
            {
              url: user?.image,
              alt: `${user.username} - FalseNotes`,
            }
          ],
        },
        type: 'profile',
        username: user?.username,
        firstName: user?.name,
      },
      twitter: {
        title: `${user.name || user.username} - FalseNotes`,
        description: `Read writing from ${user.name || user.username} on FalseNotes. ${user?.bio === null || user?.bio === "" ? `${user?.username} has ${formatNumberWithSuffix(user?._count.posts)} posts. Follow their to keep up with their activity on FalseNotes.` : user?.bio}`,
        card: 'summary',
      },
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      title: `Not Found - FalseNotes`,
      description: `The page you were looking for doesn't exist.`,
      openGraph: {
        title: `Not Found - FalseNotes`,
        description: `The page you were looking for doesn't exist.`,

      },
      twitter: {
        card: 'summary',
        title: `Not Found - FalseNotes`,
        description: `The page you were looking for doesn't exist.`,
      },
    }
  }
}

export default function UserLayout(
  { children, params }: Props
) {

  return (
    <>
      {children}
    </>
  )
}
