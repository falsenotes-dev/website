
import FeedTabsSkeleton from '@/components/feed/navbar/navbar-skeleton';
import PostCardSkeleton from '@/components/skeletons/feed-post-card';

export default async function Loading() {
  return (
    <div className='w-full'>
      <div className="feed__list px-4">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 lg:gap-8">
          <div className="flex flex-col gap-4">
            <PostCardSkeleton className="rounded-lg bg-backgraound max-h-72 w-full" />
            <PostCardSkeleton className="rounded-lg bg-backgraound max-h-72 w-full" />
            <PostCardSkeleton className="rounded-lg bg-backgraound max-h-72 w-full" />
            <PostCardSkeleton className="rounded-lg bg-backgraound max-h-72 w-full" />
            <PostCardSkeleton className="rounded-lg bg-backgraound max-h-72 w-full" />
          </div>
          <div className="flex flex-col gap-4">
            <PostCardSkeleton className="rounded-lg bg-backgraound max-h-72 w-full" />
            <PostCardSkeleton className="rounded-lg bg-backgraound max-h-72 w-full" />
            <PostCardSkeleton className="rounded-lg bg-backgraound max-h-72 w-full" />
            <PostCardSkeleton className="rounded-lg bg-backgraound max-h-72 w-full" />
            <PostCardSkeleton className="rounded-lg bg-backgraound max-h-72 w-full" />
            <PostCardSkeleton className="rounded-lg bg-backgraound max-h-72 w-full" />
          </div>
          <div className="flex flex-col gap-4">
            <PostCardSkeleton className="rounded-lg bg-backgraound max-h-72 w-full" />
            <PostCardSkeleton className="rounded-lg bg-backgraound max-h-72 w-full" />
            <PostCardSkeleton className="rounded-lg bg-backgraound max-h-72 w-full" />
            <PostCardSkeleton className="rounded-lg bg-backgraound max-h-72 w-full" />
          </div>
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
