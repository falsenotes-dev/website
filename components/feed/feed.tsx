"use client";
import React, { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Skeleton } from "../ui/skeleton";
import FeedPostCard from "../blog/feed-post-card";
import { fetchFeed } from './get-feed';
import { Card, CardContent, CardHeader } from '../ui/card';
import { cn } from '@/lib/utils';
import { Separator } from '@radix-ui/react-context-menu';
import { EmptyPlaceholder } from '../empty-placeholder';
import PostCardSkeleton from '@/components/skeletons/feed-post-card';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TagPostCard from '../tags/post-card';
import useWindowDimensions from '../window-dimensions';

export default function InfinitiveScrollFeed({ initialFeed, tag, session, list }: { initialFeed: any | undefined, tag: string | undefined, session: any, list: any }) {
  const [feed, setFeed] = useState<Array<any>>(initialFeed)
  const [page, setPage] = useState<number>(0)
  const [ref, inView] = useInView()
  const [mainRef, mainInView] = useInView()
  const router = useRouter()
  //when tab change, feed is not updated yet so when when tab change it must be set feed to initialFeed
  useEffect(() => {
    setFeed(initialFeed)
  }, [initialFeed])

  async function loadMoreFeed() {
    console.log('loading more feed')
    const next = page + 1
    const result = await fetchFeed({ page: next, tab: tag, limit: 10 })
    if (result?.length) {
      setPage(next)
      setFeed(prev => [...prev, ...result])
    }
  }

  useEffect(() => {
    console.log('inView', inView);
    if (inView || mainInView) {
      loadMoreFeed()
    }
  }, [inView, mainInView])

  const safeFeed = feed || [];

  const [cols, setCols] = useState<number>(3)
  const { width } = useWindowDimensions()

  useEffect(() => {
    if (width && width <= 1024) {
      setCols(2)
    }
    if (width && width < 640) {
      setCols(0)
    }
  }, [width])


  const [firstCol, setFirstCol] = useState<any[]>([])
  const [secondCol, setSecondCol] = useState<any[]>([])
  const [thirdCol, setThirdCol] = useState<any[]>([])


  useEffect(() => {
    console.log(feed.length, cols);
    setFirstCol(feed.filter((_, index) => index % cols === 0))
    setSecondCol(feed.filter((_, index) => index % cols === 1))
    setThirdCol(feed.filter((_, index) => index % cols === 2))
  }, [feed, cols])

  useEffect(() => {
    addEmptyPost()
  }, [firstCol, secondCol, thirdCol])

  function addEmptyPost() {
    console.log(firstCol.length, secondCol.length, thirdCol.length)
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
    console.log(firstCol.length, secondCol.length, thirdCol.length)
  }

  return safeFeed.length > 0 ? (
    <div className="feed__list mb-14 flex flex-col gap-6 lg:gap-8">

      <div className='grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 grid-flow-row gap-6 lg:gap-8 auto-rows-auto'>
        <div className="flex-col gap-8 hidden md:flex">
          {firstCol.map((post: any, index) => (
            <React.Fragment key={post.id}>
              <FeedPostCard
                post={post}
                session={session}
                list={list}
                className='md:mb-0'
              />
            </React.Fragment>
          ))}
        </div>
        <div className="hidden md:flex flex-col gap-8">
          {secondCol.map((post: any, index) => (
            post.id ? (
              <React.Fragment key={post.id}>
                <FeedPostCard
                  post={post}
                  session={session}
                  list={list}
                  className='md:mb-0'
                />
              </React.Fragment>
            ) : (
              <div className="feed__list_loadmore !py-0 h-max" ref={ref} key={index}>
                <PostCardSkeleton className="rounded-lg bg-backgreound w-full mt-0" />
              </div>
            )
          ))}
        </div>
        <div className="flex-col gap-8 hidden xl:flex">
          {thirdCol.map((post: any, index) => (
            post.id ? (
              <React.Fragment key={post.id}>
                <FeedPostCard
                  post={post}
                  session={session}
                  list={list}
                  className='md:mb-0'
                />
              </React.Fragment>
            ) : (
              <div className="feed__list_loadmore !py-0 h-max" ref={ref} key={index}>
                <PostCardSkeleton className="rounded-lg bg-backgreound w-full mt-0" />
              </div>
            )
          ))}
        </div>
        <div className="md:hidden flex flex-col gap-8" >{
          feed.map((post: any, index) => (

            <FeedPostCard
              post={post}
              session={session}
              list={list}
              className='md:mb-0'
              key={post.id}
            />

          ))
        }
        </div>
        {
          feed.length > 0 && (
            <div className="md:hidden" ref={mainRef}>
              <PostCardSkeleton className="rounded-lg bg-backgreound w-full mt-0 " />

            </div>
          )
        }
      </div>
      {
        firstCol.length > 0 && (
          feed.length % cols == 0 && (
            <div className='w-full h-10' ref={mainRef}></div>
          )
        )
      }
    </div>
  ) :
    (
      tag == 'following' ? (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name='post' strokeWidth={1.5} />
          <EmptyPlaceholder.Title>No posts yet</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>When you follow someone, their posts will show up here.</EmptyPlaceholder.Description>
          <Button className="mt-4" onClick={
            () => {
              router.push('/feed')
            }
          }>Browse recommended posts</Button>
        </EmptyPlaceholder>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name='post' strokeWidth={1.5} />
          <EmptyPlaceholder.Title>No posts yet</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Either posts haven&apos;t been created yet or you don&apos;t have access to them.
          </EmptyPlaceholder.Description>
          <Button className="mt-4" onClick={
            () => {
              router.push('/feed')
            }
          }>Browse recommended posts</Button>
        </EmptyPlaceholder>
      )
    )

}
