import { getSession } from "next-auth/react";
import { getSessionUser } from "@/components/get-session-user";
import { notFound, redirect, useRouter } from "next/navigation";
import postgres from "@/lib/postgres";
import { UserDetails, UserPosts } from "@/components/user";
import UserTab from "@/components/user/tabs";
import { getPost } from "@/lib/prisma/posts";
import { getBookmarks, getHistory, getLists } from "@/lib/prisma/session";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import UserBookmarks from "@/components/user/bookmark";
import { SiteFooter } from "@/components/footer";
import { UserAbout } from "@/components/user/about";
import { Icons } from "@/components/icon";
import Image from "next/image";
import { UserCard } from "@/components/user/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import UserHistory from "@/components/user/history";

export default async function Page({
  params,
  searchParams,
}: {
  params: {
    username: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const decodedUsername = decodeURIComponent(params.username);

  if (!decodedUsername.startsWith("@")) redirect("/404");

  const sessionUserName = await getSessionUser();
  const user = await postgres.user.findFirst({
    include: {
      posts: {
        orderBy: {
          createdAt: "desc",
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
              published: true,
            },
            {
              authorId: sessionUserName?.id,
            },
          ],
        },
      },
      _count: {
        select: {
          posts: {
            where: {
              published: true,
            },
          },
        },
      },
      Followers: {
        include: {
          follower: {
            include: {
              Followers: true,
              Followings: true,
            },
          },
        },
      },
      Followings: {
        include: {
          following: {
            include: {
              Followers: true,
              Followings: true,
            },
          },
        },
      },
    },
    where: {
      username: decodedUsername.substring(1),
    },
  });

  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;
  if (!user) {
    return notFound();
  }

  const pinnedPost = await postgres.post.findFirst({
    where: {
      authorId: user?.id,
      pinned: true,
    },
    include: {
      _count: {
        select: {
          comments: true,
          likes: true,
          savedUsers: true,
          shares: true,
        },
      },
      savedUsers: true,
      tags: {
        take: 1,
        include: {
          tag: true,
        },
      },
      author: {
        include: {
          Followers: true,
          Followings: true,
        },
      },
    },
  });

  const whereQuery =
    sessionUserName?.id === user?.id
      ? { pinned: false }
      : { published: true, pinned: false };

  const { posts } = await getPost({ id: user?.id, search, whereQuery });

  const followers = user?.Followers;
  const following = user?.Followings;

  const tab =
    typeof searchParams.tab === "string" ? searchParams.tab : undefined;
  const { bookmarks } = await getBookmarks({
    id: sessionUserName?.id,
    limit: 10,
  });
  const { history } = await getHistory({ id: sessionUserName?.id, limit: 10 });
  const list = await getLists({ id: sessionUserName?.id });
  return (
    <div className="md:container mx-auto px-4 pt-5">
      <div className="gap-5 lg:gap-6 flex flex-col md:flex-row items-start xl:px-4 pt-5">
        <div
          className="user__header md:hidden lg:min-w-[352px] lg:border-r lg:max-w-[352px] md:px-8 xl:min-w-[368px] xl:max-w-[368px] lg:pl-10 lg:flex flex-col md:sticky top-[115px]"
          style={{
            minHeight: "calc(100vh - 125px)",
          }}
        >
          <div className="md:flex-[1_0_auto]">
            <UserDetails
              user={user}
              followers={followers}
              session={sessionUserName}
            />
          </div>
          <SiteFooter className="text-xs flex-col justify-start items-start mb-0 mt-4 !px-0" />
        </div>
        <Separator className="block md:hidden lg:block h-full" orientation="vertical" />
        <div className="w-full">
          <UserCard user={user} session={sessionUserName} />
          <Tabs className="w-full" defaultValue={tab || "posts"}>
            <ScrollArea className="w-full">
              <TabsList>
                <TabsTrigger
                  value="posts"
                >
                  Posts
                </TabsTrigger>
                <TabsTrigger
                  value="about"
                  >
                  About
                </TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <TabsContent value="posts" className="w-full">
              <UserPosts
                pinned={pinnedPost}
                posts={posts}
                user={user}
                sessionUser={sessionUserName}
                query={whereQuery}
                search={search}
                list={list}
                className="w-full mt-6"
              />
            </TabsContent>
            <TabsContent value="about">
              <UserAbout user={user} session={sessionUserName} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
