"use client";
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Skeleton } from "../ui/skeleton";
import FeedPostCard from "../blog/feed-post-card";
import { fetchFeed } from './get-feed';
import { Icons } from '../icon';
import { getSessionUser } from '../get-session-user';
import { Card, CardContent, CardHeader } from '../ui/card';
import { cn } from '@/lib/utils';

export default function InfinitiveScrollFeed({ initialFeed }: { initialFeed: any }) {
  const [feed, setFeed] = useState<Array<any>>(initialFeed)
  const [page, setPage] = useState<number>(0)
  const [ref, inView] = useInView()

  console.log("Feed", feed)

  async function loadMoreFeed() {
    console.log("Loading more feed")
    const next = page + 1
    console.log("Next page", next)
    const fetchedFeed = await fetch(`/api/feed?page=${next}&user=${(await getSessionUser())?.id}`).then(res => res.json())
    if (fetchedFeed?.feed.length) {
      setPage(next)
      setFeed(prev => [...prev, ...fetchedFeed.feed])
    }
  }

  useEffect(() => {
    if (inView) {
      loadMoreFeed()
    }
  }, [inView])

  return (
    <div className="feed__list">
      {/* {
        isLoaded && feed.length === 0 && (
          <div className="w-full max-h-screen my-auto flex justify-center items-center bg-background">
            <div className="flex flex-col items-center justify-center space-y-4">
              <h1 className="text-2xl font-bold">No posts yet</h1>
              <p className="text-muted-foreground">When you follow someone, their posts will show up here.</p>
            </div>
          </div>
        )
      } */}

      <div className="feed__list_item">
        {feed.map((post: any) => (
          <FeedPostCard
            key={post.id}
            post={post}
          />
        ))}

        <div className="feed__list_loadmore !py-0 h-max" ref={ref}>
        <Card className="rounded-lg bg-backgreound max-h-72">
        <CardContent className="px-4 md:px-6 py-0">
          <CardHeader className={cn("pt-4 pb-3 md:pt-6 px-0 gap-y-4")}>
            <div className="flex items-center space-x-1">
            <Skeleton className="h-6 w-6 mr-1 md:mr-1.5" />
              <Skeleton className="w-32 h-3" />
            </div>
          </CardHeader>
          <div className="flex">
            <div >
              <div>
                  <div className="pb-3">
                    <Skeleton className='w-52 h-4' />
                  </div>
                  <div className="space-y-2">
                  <Skeleton className='w-[400px] h-4' />
                  <Skeleton className='w-[400px] h-4' />
                  <Skeleton className='w-[400px] h-4' />
                  </div>
                  </div>
                <div className="py-8">
                  <div className="flex justify-between">
                    <Skeleton className='w-20 h-3' />
                    <div className="stats flex items-center justify-around gap-2">
                      <Skeleton className='w-14 h-3' />
                      <Skeleton className='w-14 h-3' />
                      <Skeleton className='w-14 h-3' />
                    </div>
                  </div>
                </div>
              </div>
              <Skeleton className="h-28 !relative !pb-0 md:aspect-[4/3] aspect-square ml-10" />
            </div>
              
        </CardContent>
    </Card>
        </div>
      </div>
    </div>
  )
}