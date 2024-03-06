import { fetchFeed } from '@/components/feed/get-feed';
import InfinitiveScrollFeed from '@/components/feed/feed';
import { getSessionUser } from '@/components/get-session-user';
import FeedTabs from '@/components/feed/navbar/navbar';
import { redirect } from 'next/navigation';
import { getLists } from '@/lib/prisma/session';

export default async function Feed({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getSessionUser();

  const feed = await fetchFeed({ page: 0, tab: 'following', limit: 10 });
  if (session) {
    if (feed.length === 0) {
      redirect('/get-started')
    }
  } else {
    return redirect('/')
  }
  const userLists = await getLists({ id: session?.id });

  return (
    <>
      <FeedTabs activeTab={'following'} />
      <div className="px-4">
        <InfinitiveScrollFeed initialFeed={feed} tag={'following'} session={session} list={userLists} />
      </div>
    </>
  )
}