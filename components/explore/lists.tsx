"use client";
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Skeleton } from "../ui/skeleton";
import FeedPostCard from "../blog/feed-post-card";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';
import { Separator } from '@radix-ui/react-context-menu';
import { Button } from '../ui/button';
import { EmptyPlaceholder } from '../empty-placeholder';
import ListCard from '../list-card';
import { searchLists } from '@/lib/prisma/list';

export default function Lists({ initialLists, search, session }: { initialLists: any | undefined, search?: string | undefined, session: any }) {
     const [lists, setLists] = useState<Array<any>>(initialLists)
     const [page, setPage] = useState<number>(0)
     const [isLoading, setIsLoading] = useState<boolean>(false)
     const [isLast, setIsLast] = useState<boolean>(false)
     useEffect(() => {
          setLists(initialLists)
          setIsLast(false)
     }, [initialLists])

     async function loadMorePosts() {
          const next = page + 1
          setIsLoading(true)
          const result = await searchLists({ page: next, search, limit: 10  })
          setIsLoading(false)
          const fetchedposts = result?.lists
          if (fetchedposts?.length) {
               setPage(next)
               setLists(prev => [...prev, ...fetchedposts])
          } else {
               setIsLast(true)
          }
     }

     return lists.length > 0 ? (
          <div className="feed__list md:w-[600px]">
               <Card>
                    <CardHeader>
                         <CardTitle className="feed__content_featured_card_title text-base">Lists</CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 flex flex-col gap-4">
                         {lists?.map((post: any) => (
                              <>
                                   <ListCard list={post} session={session} />
                                   <Separator />
                              </>
                         ))}
                    </CardContent>
                    <CardFooter>
                         <div className="w-full">
                              <Button className="w-full" variant="outline" onClick={loadMorePosts} disabled={isLast}>{
                                   isLoading ? "Loading..." : "Load more"
                              }</Button>
                         </div>
                    </CardFooter>
               </Card>

          </div>
     ) : (
          <div className="flex flex-col items-center justify-center w-full">
               <EmptyPlaceholder className='w-full'>
                    <EmptyPlaceholder.Icon name="list" strokeWidth={1.25} />
                    <EmptyPlaceholder.Title>No lists found</EmptyPlaceholder.Title>
                    <EmptyPlaceholder.Description>
                         Try searching for something else.
                    </EmptyPlaceholder.Description>
               </EmptyPlaceholder>
          </div>
     )
}