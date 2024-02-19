'use client'

import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"

export default function Tab({ user, className, ...props }: React.ComponentPropsWithoutRef<typeof Tabs> & { user: any }) {
     const router = useRouter()
     return (
          <Tabs defaultValue="home" {...props}>
               <TabsList className="mb-8">
                    <TabsTrigger onClick={
                         () => router.push(`/@${user.username}`)
                    } value="home">Home</TabsTrigger>
                    <TabsTrigger onClick={
                         (e) => router.push(`/@${user.username}/posts`)
                    } value="posts">Posts</TabsTrigger>
                    <TabsTrigger onClick={
                         (e) => router.push(`/@${user.username}/lists`)
                    } value="lists">Lists</TabsTrigger>
                    {
                         user?.writers?.length > 0 && (
                              <TabsTrigger onClick={
                                   (e) => router.push(`/@${user.username}/writers`)
                              } value="writers">Writers</TabsTrigger>
                         )
                    }
                    <TabsTrigger onClick={
                         (e) => router.push(`/@${user.username}/about`)
                    } value="about">About</TabsTrigger>
               </TabsList>
          </Tabs>
     )
}