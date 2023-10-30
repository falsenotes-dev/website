import { Icons } from '@/components/icon';
import PopularPosts from '@/components/feed/popular-posts';
import FeaturedDev from '@/components/feed/featured/featured-dev';
import { fetchFeed } from '@/components/feed/get-feed';
import InfinitiveScrollFeed from '@/components/feed/feed';
import { fetchUsers } from '@/components/feed/fetch-user';
import Link from 'next/link';
import TagBadge from '@/components/tags/tag';
import { fetchTags } from '@/components/feed/get-tags';
import { getServerSession } from 'next-auth';
import { config } from '../../auth';
import { redirect } from 'next/navigation';

export default async function Feed() {
  const feedData = await fetchFeed({ page: 0 });
  const feed = feedData?.feed;
  const topData = await fetchUsers()
  const topUsers = topData?.topUsers;
  const tagsData = await fetchTags();
  const popularTags = tagsData?.tags;

  const session = await getServerSession(config);


  if(!session) {
    return redirect('/')
  }

  return (
    <>
      <main className="flex flex-col items-center justify-between feed xl:px-8">
        <div className="md:flex lg:flex-nowrap flex-wrap md:mx-[-16px] w-full xl:gap-8 md:gap-4">
          <div className="md:my-4 w-full lg:w-2/3">
              {!feed || feed.length === 0 ? (
                <div className="w-full max-h-screen my-auto flex justify-center items-center bg-background">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <h1 className="text-2xl font-bold">No posts yet</h1>
                  <p className="text-muted-foreground">When you follow someone, their posts will show up here.</p>
                </div>
              </div>
              ) : (
                <InfinitiveScrollFeed initialFeed={feed} />
              )}
            </div>
          <div className="hidden lg:block md:my-4 lg:w-1/3 xl:px-8 md:px-4 border-l min-h-[calc(100vh - 5rem)]" style={
            {
              minHeight: "calc(100vh - 5rem)"
            }
          }>
            <div className="relative w-full h-full inline-block">
            <div className="sticky space-y-6 top-[70px]">
            <PopularPosts />
            <div className="tags">
            <h2 className="mb-2 font-semibold">Popular tags</h2>
                    {/* col-sm-6 col-md-4 col-lg-12 list-style-none flex-wrap */}
                    <div className="w-2/3 md:w-1/4 lg:w-full flex-wrap">
                         {popularTags?.map((tag: any) => (
                              <Link href={`/tags/${tag.name}`} key={tag.id}>
                                   <TagBadge className="my-1 mr-1" variant={"secondary"}>{tag.name}</TagBadge>
                              </Link>
                         ))}
                    </div>
            </div>
            {topUsers && (
              <FeaturedDev data={topUsers} />
            )}
            </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}