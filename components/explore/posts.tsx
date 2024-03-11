"use client";
import React, { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Skeleton } from "../ui/skeleton";
import FeedPostCard from "../blog/feed-post-card";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';
import { Separator } from '@radix-ui/react-context-menu';
import { Button } from '../ui/button';
import { EmptyPlaceholder } from '../empty-placeholder';
import { getPosts } from '@/lib/prisma/posts';
import PostCardSkeleton from '../skeletons/feed-post-card';
import { useRouter } from 'next/navigation';
import useWindowSize from '@/lib/hooks/use-windows-size';

export default function Posts({ initialPosts, search, session, list }: { initialPosts: any | undefined, search?: string | undefined, session: any, list: any }) {
     const [posts, setposts] = useState<Array<any>>(initialPosts)
     const [page, setPage] = useState<number>(0)
     const [isLoading, setIsLoading] = useState<boolean>(false)
     const [isLast, setIsLast] = useState<boolean>(false)
     const [ref, inView] = useInView()
     const [mainRef, mainInView] = useInView()
     const router = useRouter()
     async function loadMorePosts() {
          const next = page + 1
          setIsLoading(true)
          const { posts: fetchedposts } = await getPosts({ search, limit: 10, page: next })
          setIsLoading(false)
          if (fetchedposts?.length) {
               setPage(next)
               setposts(prev => [...prev, ...fetchedposts])
          } else {
               setIsLast(true)
          }
     }

     useEffect(() => {
          if (inView) {
               loadMorePosts()
          }
          if (mainInView) {
               loadMorePosts()
          }
     }, [inView, mainInView])

     const [cols, setCols] = useState<number>(3)
     const { isMobile, isDesktop, isTablet } = useWindowSize();

     useEffect(() => {
          if (isTablet) {
               setCols(2)
          }
          if (isMobile) {
               setCols(0)
          }
     }, [isMobile, isDesktop, isTablet])


     const [firstCol, setFirstCol] = useState<any[]>([])
     const [secondCol, setSecondCol] = useState<any[]>([])
     const [thirdCol, setThirdCol] = useState<any[]>([])

     useEffect(() => {
          setFirstCol(posts.filter((_, index) => index % cols === 0))
          setSecondCol(posts.filter((_, index) => index % cols === 1))
          setThirdCol(posts.filter((_, index) => index % cols === 2))
     }, [posts, cols])

     useEffect(() => {
          addEmptyPost()
     }, [firstCol, secondCol, thirdCol])

     function addEmptyPost() {
          if (firstCol.length > secondCol.length) {
               for (let i = 0; i < firstCol.length - secondCol.length; i++) {
                    setSecondCol(prev => [...prev, {}])
               }
          }
          if (firstCol.length > thirdCol.length) {
               for (let i = 0; i < firstCol.length - thirdCol.length; i++) {
                    setThirdCol(prev => [...prev, {}])
               }
          }
     }

     const colsContent = isTablet ? [firstCol, secondCol] : [firstCol, secondCol, thirdCol]
     useEffect(() => {
          setposts(initialPosts)
          setIsLast(false)
     }, [initialPosts])

     return posts.length > 0 ? (
          <div className="feed__list mb-14 flex flex-col gap-6 md:gap-8 max-w-7xl min-w-[280px] w-full">
               <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 grid-flow-row gap-6 md:gap-8 auto-rows-auto'>
                    {
                         colsContent.map((col, index) => (
                              <div className="flex-col gap-8 hidden md:flex" key={index}>
                                   {col.map((post: any, pIndex) => (
                                        <React.Fragment key={post.id || `placeholder-${pIndex}`}>
                                             {post.id ? (
                                                  <FeedPostCard
                                                       post={post}
                                                       session={session}
                                                       list={list}
                                                       className='md:mb-0'
                                                  />
                                             ) : (
                                                  <div className="feed__list_loadmore !py-0 h-max" ref={ref}>
                                                       <PostCardSkeleton className="rounded-lg bg-backgreound w-full mt-0" />
                                                  </div>
                                             )}

                                        </React.Fragment>
                                   )
                                   )}
                              </div>
                         ))
                    }
                    <div className="md:hidden flex flex-col gap-4" >{
                         posts.map((post: any, index) => (
                              <React.Fragment key={post.id || `placeholder-${index}`}>
                                   <FeedPostCard
                                        post={post}
                                        session={session}
                                        list={list}
                                        className='md:mb-0'
                                        key={post.id}
                                   />
                              </React.Fragment>
                         ))
                    }
                    </div>
                    {
                         posts.length > 0 && (
                              <div className="md:hidden" ref={mainRef}>
                                   <PostCardSkeleton className="rounded-lg bg-backgreound w-full mt-0 " />

                              </div>
                         )
                    }
               </div>
               {
                    firstCol.length > 0 && (
                         posts.length % cols == 0 && (
                              <div className='w-full h-10' ref={mainRef}></div>
                         )
                    )
               }
          </div>
     ) : (
          <div className="flex flex-col items-center justify-center w-full">
               <EmptyPlaceholder className='w-full'>
                    <EmptyPlaceholder.Icon name="post" strokeWidth={1.25} />
                    <EmptyPlaceholder.Title>No posts found</EmptyPlaceholder.Title>
                    <EmptyPlaceholder.Description>
                         Try searching for something else.
                    </EmptyPlaceholder.Description>
               </EmptyPlaceholder>
          </div>
     )
}