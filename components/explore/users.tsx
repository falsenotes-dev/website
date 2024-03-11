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
import UserHorizontalCard from '../user-horizontal-card';
import UserHoverCard from '../user-hover-card';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Icons } from '../icon';

export default function Users({ users: initialUser, search, session }: { users: any | undefined, search?: string | undefined, session: any }) {
     const [users, setUsers] = useState<Array<any>>(initialUser)
     const [page, setPage] = useState<number>(0)
     const [isLoading, setIsLoading] = useState<boolean>(false)
     const [isLast, setIsLast] = useState<boolean>(false)
     useEffect(() => {
          setUsers(initialUser)
          setIsLast(false)
     }, [initialUser])

     async function loadMorePosts() {
          const next = page + 1
          setIsLoading(true)
          const result = await fetch(`/api/users?page=${next}${search ? `&search=${search}` : ''}`).then(res => res.json())
          setIsLoading(false)
          const fetchedUsers = result?.users
          if (fetchedUsers?.length) {
               setPage(next)
               setUsers(prev => [...prev, ...fetchedUsers])
          } else {
               setIsLast(true)
          }
     }

     return users.length > 0 ? (
          <div className="feed__list md:w-[600px] w-full">
               <Card className='border-none shadow-none'>
                    <CardContent className="space-y-4 pt-6">
                         {users?.map(
                              (item: any, index: number) => (
                                   <div className="flex gap-4 w-full items-center justify-between" key={item.id}>
                                        <div className="space-y-3 w-full">
                                             <UserHorizontalCard className='w-full' user={item} session={session} />
                                        </div>
                                   </div>
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
                    <EmptyPlaceholder.Icon name="user" strokeWidth={1.25} />
                    <EmptyPlaceholder.Title>No users found</EmptyPlaceholder.Title>
                    <EmptyPlaceholder.Description>
                         Try searching for something else.
                    </EmptyPlaceholder.Description>
               </EmptyPlaceholder>
          </div>
     )
}