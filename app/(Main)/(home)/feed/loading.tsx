
import FeedTabsSkeleton from '@/components/feed/navbar/navbar-skeleton';
import PostCardSkeleton from '@/components/skeletons/feed-post-card';

export default async function Loading() {
  return (
    <div className='w-full'>
      <div className="feed__list px-4">
        <div className="flex flex-col lg:gap-6 md:gap-5 gap-4 flex-nowrap">
          <PostCardSkeleton className="rounded-lg bg-backgraound max-h-72 w-full" />
          <PostCardSkeleton className="rounded-lg bg-backgraound max-h-72 w-full" />
          <PostCardSkeleton className="rounded-lg bg-backgraound max-h-72 w-full" />
          <PostCardSkeleton className="rounded-lg bg-backgraound max-h-72 w-full" />
          <PostCardSkeleton className="rounded-lg bg-backgraound max-h-72 w-full" />
        </div>
      </div>
    </div>
  )
}
/* <div className="hidden lg:block md:my-4 lg:w-1/3 xl:pl-8 md:pl-4 border-l min-h-screen">
            <div className="relative w-full h-full inline-block">
              <div className="sticky space-y-4 top-16 w-full">
                <PopularPostsSkeleton />
                <TagsCardSkeleton />
                <FeaturedDevSkeleton />
                <BookmarksCardSkeleton />
              </div>
            </div>
          </div>
           */
