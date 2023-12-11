import { formatNumberWithSuffix } from '@/components/format-numbers';
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
    const response = await fetch(`${process.env.DOMAIN}/api/users/${decodedUsername.substring(1)}`);
    if (!response.ok) {
      throw new Error(`Error fetching user data: ${response.statusText}`);
    }
    const data = await response.json();
    const user = data.user;
    return {
      metadataBase: new URL(`${process.env.DOMAIN}/${user.username}`),
      title: `${user.username} ${user?.name ? `(` + user?.name + `)` : ``} - FalseNotes`,
      description: user?.bio === null || user?.bio === "" ? `${user?.username} has ${user?._count.posts} posts. Follow their to keep up with their activity on FalseNotes.` : user?.bio,
      openGraph: {
        title: `${user.username} ${user?.name ? `(` + user?.name + `)` : ``} - FalseNotes`,
        description: user?.bio === null || user?.bio === "" ? `${user?.username} has ${formatNumberWithSuffix(user?.posts.length)} posts. Follow their to keep up with their activity on FalseNotes.` : user?.bio,
        url: `${process.env.DOMAIN}/${user.username}`,
        images: [
          {
            url: user?.image,
            alt: `${user.username} - FalseNotes`,
          }
        ],
      },
      twitter: {
        title: `${user.username} ${user?.name ? `(` + user?.name + `)` : ``} | FalseNotes`,
        description: user?.bio === null || user?.bio === "" ? `${user?.username} has ${user?.postsnum} posts. Follow their to keep up with their activity on FalseNotes.` : user?.bio,
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
