import { getSession } from "next-auth/react";
import { getSessionUser } from "@/components/get-session-user";
import { notFound, redirect, useRouter } from "next/navigation";
import postgres from "@/lib/postgres";
import {
  UserDetails,
  UserPosts,
} from "@/components/user";
import UserTab from "@/components/user/tabs";
import { getPost } from "@/lib/prisma/posts";
import { getBookmarks, getHistory } from "@/lib/prisma/session";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import UserBookmarks from "@/components/user/bookmark";


export default async function Page({ params, searchParams }: {
  params: {
    username: string
  },
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const sessionUserName = await getSessionUser();
  const user = await postgres.user.findFirst({
    include: {
      posts: {
        orderBy: {
          createdAt: "desc"
        },
        include: {
          _count: {
            select: {
              likes: true,
              savedUsers: true,
            },
          },
          savedUsers: true,
          tags: {
            take: 1,
            include: {
              tag: true,
            },
          },
        },
        // if user is a session user, show all posts
        where: {
          OR: [
            {
              visibility: "public",
            },
            {
              authorId: sessionUserName?.id,
            },
          ],
        },
      },
      Followers: {
        include: {
          follower: true
        }
      },
      Followings: {
        include: {
          following: true
        }
      }
    },
    where: {
      username: params.username
    }
  })

  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined


  if (!user) notFound();

  const whereQuery = sessionUserName?.id === user?.id ? {} : { visibility: "public" };

  const { posts } = await getPost({ id: user?.id, search, whereQuery });


  const followers = user.Followers;
  const following = user.Followings;

  const tab = typeof searchParams.tab === 'string' ? searchParams.tab : undefined;
  const { bookmarks } = await getBookmarks({ id: sessionUserName?.id })
  const { history } = await getHistory({ id: sessionUserName?.id })
  return (
    <div className="md:container mx-auto px-4 pt-16">
      <div className="gap-5 lg:gap-6 py-5 flex flex-col md:flex-row items-start" >
        <UserDetails user={user} followers={followers} followings={following} session={sessionUserName} className="w-full md:w-1/3 lg:w-1/4" />
        {sessionUserName?.id === user?.id ? (
          <Tabs className="w-full" defaultValue={tab || "posts"}>
            <TabsList className="bg-transparent gap-2">
              <TabsTrigger value="posts" className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                Posts
              </TabsTrigger>
              <TabsTrigger value="bookmarks" className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                Bookmarks
              </TabsTrigger>
              <TabsTrigger value="reading-history" className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                Reading History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="w-full">
              <UserPosts posts={posts} user={user} sessionUser={sessionUserName} query={whereQuery} search={search} className="w-full" />
            </TabsContent>
            <TabsContent value="bookmarks" className="w-full">
              <UserBookmarks posts={bookmarks} user={user} sessionUser={sessionUserName} tab={`bookmarks`} className="w-full" />
            </TabsContent>
            <TabsContent value="reading-history">
              <UserBookmarks posts={history} user={user} sessionUser={sessionUserName} tab={`history`} className="w-full" />
            </TabsContent>
          </Tabs>) : (
          <UserPosts posts={posts} user={user} sessionUser={sessionUserName} query={whereQuery} search={search} className="w-full" />
        )}
      </div>
    </div>
  );
}