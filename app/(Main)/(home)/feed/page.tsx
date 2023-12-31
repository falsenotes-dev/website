import { fetchFeed } from '@/components/feed/get-feed';
import InfinitiveScrollFeed from '@/components/feed/feed';
import { getSessionUser } from '@/components/get-session-user';
import FeedTabs from '@/components/feed/navbar/navbar';
import { redirect } from 'next/navigation';
import { fetchFollowingTags } from '@/components/get-following-tags';
import { getLists } from '@/lib/prisma/session';

export default async function Feed({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getSessionUser();
  const userFollowingsTags = await fetchFollowingTags({ id: session?.id })

  if (session) {
    if (userFollowingsTags.length === 0) {
      redirect('/get-started')
    }
  } else {
    return redirect('/')
  }

  const tab = typeof searchParams.tab === 'string' ? searchParams.tab : undefined
  const feed = await fetchFeed({ page: 0, tab, limit: 10 });
  const userLists = await getLists({ id: session?.id });

  return (
    <>
      <FeedTabs tabs={userFollowingsTags} activeTab={tab} />
      <div className="pt-10">
        <InfinitiveScrollFeed initialFeed={feed} tag={tab} session={session} list={userLists} />
      </div>
    </>
  )
}