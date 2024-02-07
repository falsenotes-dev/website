'use server';
import { redirect } from 'next/navigation';
import { fetchFollowingTags } from '@/components/get-following-tags';
import { getSessionUser } from '@/components/get-session-user';
import Landing from '@/components/landing/landing';
import db from '@/lib/db';
import { getFeaturedPosts, getPosts } from '@/lib/prisma/posts';
import { SiteFooter } from '@/components/footer';
import { fetchUsers } from '@/components/feed/fetch-user';

export default async function Home() {

  const session = await getSessionUser();
  const userFollowingsTags = await fetchFollowingTags({ id: session?.id })

  if (session) {
    if (userFollowingsTags.length === 0) {
      redirect('/get-started')
    } else if (userFollowingsTags.length > 0) {
      redirect('/feed')
    }
  }

  // Use Promise.all to run both fetch operations in parallel
  const [tags, popularPosts] = await Promise.all([
    db.tag.findMany({
      select: {
        name: true,
        id: true
      },
      take: 10,
      orderBy: {
        posts: {
          _count: "desc"
        }
      }
    }),
    getPosts({ limit: 6 })
  ]);

  //latest post of the day
  const { posts: popular } = popularPosts;
  const topData = await fetchUsers({ limit: 10 })
  const topUsers = topData?.users;

  const usersNumber = await db.user.count();
  const postsNumber = await db.post.count(
    {
      where: {
        published: true
      }
    }
  );
  const readNumber = await db.readingHistory.count();
  const stats = {
    users: usersNumber,
    posts: postsNumber,
    reads: readNumber
  }

  return (
    <>
      <Landing
        tags={tags}
        popular={popular}
        topUsers={topUsers}
        stats={stats}
      />
      <SiteFooter />
    </>
  );
}
