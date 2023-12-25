import { getSession } from "next-auth/react";
import { getSessionUser } from "@/components/get-session-user";
import { notFound, redirect, useRouter } from "next/navigation";
import db from "@/lib/db";
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
import ListCard from "@/components/list-card";
import { formatNumberWithSuffix } from "@/components/format-numbers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyPlaceholder } from "@/components/empty-placeholder";

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
  const user = await db.user.findFirst({
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

  const pinnedPost = await db.post.findFirst({
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

  const lists = await db.list.findMany({
    where:
      sessionUserName?.id === user?.id
        ? { authorId: user?.id }
        : { authorId: user?.id, visibility: "public" },
    include: {
      _count: { select: { posts: true } },
      posts: {
        include: {
          post: {
            select: {
              cover: true,
            },
          },
        },
        take: 3,
      },
      author: true,
      savedUsers: true,
    },
  });

  const bookmarks = await db.bookmark.findMany({
    where: {
      userId: sessionUserName?.id,
    },
    include: {
      post: {
        select: {
          cover: true,
        },
      },
      user: true,
    },
  });

  const whereQuery =
    sessionUserName?.id === user?.id
      ? { pinned: false }
      : { published: true, pinned: false };

  const { posts } = await getPost({ id: user?.id, search, whereQuery });

  const followers = user?.Followers;

  const tab =
    typeof searchParams.tab === "string" ? searchParams.tab : undefined;

  const list = await getLists({ id: sessionUserName?.id });
  return (
    <div className="md:container mx-auto px-4 pt-5">
      <div className="gap-5 lg:gap-6 flex flex-col md:flex-row items-start xl:px-4 pt-5">
        <div
          className="user__header md:hidden sm:h-fit lg:min-w-[352px] lg:border-r lg:max-w-[352px] md:px-8 xl:min-w-[368px] xl:max-w-[368px] lg:pl-10 lg:flex flex-col md:sticky top-[115px]"
          style={{
            minHeight: "calc(100vh - 125px)",
          }}
        >
          <div className="lg:flex-[1_0_auto]">
            <UserDetails
              user={user}
              followers={followers}
              session={sessionUserName}
            />
          </div>
          <SiteFooter className="text-xs flex-col justify-start items-start mb-0 mt-4 !px-0" />
        </div>
        <Separator
          className="block md:hidden lg:block h-full"
          orientation="vertical"
        />
        <div className="w-full">
          <UserCard user={user} session={sessionUserName} />
          <Tabs className="w-full" defaultValue={tab || "posts"}>
            <TabsList className="mb-4">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="lists">Lists</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
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
            <TabsContent value="lists">
              <div className="flex flex-col gap-10 my-6">
                {sessionUserName?.id === user?.id && (
                  <Card>
                    <CardContent className="p-0">
                      <div className="flex md:flex-row flex-col">
                        <CardHeader className="w-full gap-4 h-full">
                          <Link
                            href={`/@${user?.username}`}
                            className="flex gap-2"
                          >
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={user?.image!} />
                              <AvatarFallback>
                                {user?.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <p className="text-sm flex items-center line-clamp-1">
                              {user?.name || user?.username}{" "}
                              {user?.verified && (
                                <Icons.verified className="h-3.5 w-3.5 mx-0.5 fill-verified" />
                              )}
                            </p>
                          </Link>
                          <Link href={`/@${user?.username}/list/read-later`}>
                            <CardTitle className="line-clamp-1 my-2">
                              Read Later
                            </CardTitle>
                          </Link>
                          <div className="flex">
                            <div className="flex my-1.5">
                              <p className="text-muted-foreground text-xs">
                                {formatNumberWithSuffix(bookmarks.length)} posts
                              </p>
                              <Icons.lock className="h-4 w-4 text-muted-foreground mx-2" />
                            </div>
                          </div>
                        </CardHeader>
                        <Link
                          href={`/@${user?.username}/list/read-later`}
                          className="pointer-events-none rounded-b-lg"
                        >
                          <div className="relative flex justify-end md:w-80 w-full overflow-hidden h-full min-h-[8rem]">
                            <div className="relative bg-muted self-stretch z-[3] border-r-[3px] border-background w-full pl-0 rounded-bl-lg md:rounded-none min-h-[8rem]">
                              <div className="h-full w-full">
                                {bookmarks.filter(
                                  (p: any) => p.post.cover
                                )[0] && (
                                    <Image
                                      src={
                                        bookmarks.filter(
                                          (p: any) => p.post.cover
                                        )[0].post.cover!
                                      }
                                      fill
                                      alt={"Read Later"}
                                      className="object-cover !relative h-full rounded-bl-lg md:rounded-none"
                                    />
                                  )}
                              </div>
                            </div>
                            <div className="relative bg-muted self-stretch w-full z-[2] border-r-[3px] border-background pl-2 -ml-20 min-h-[8rem]">
                              <div className="h-full w-full">
                                {bookmarks.filter(
                                  (p: any) => p.post.cover
                                )[1] && (
                                    <Image
                                      src={
                                        bookmarks.filter(
                                          (p: any) => p.post.cover
                                        )[1].post.cover!
                                      }
                                      fill
                                      alt={"Read Later"}
                                      className="object-cover !relative h-full"
                                    />
                                  )}
                              </div>
                            </div>
                            <div className="relative bg-muted self-stretch z-[1] border-none pl-2 -ml-32 w-full rounded-br-lg md:rounded-r-lg min-h-[8rem]">
                              <div className="h-full w-full">
                                {bookmarks.filter(
                                  (p: any) => p.post.cover
                                )[2] && (
                                    <Image
                                      src={
                                        bookmarks.filter(
                                          (p: any) => p.post.cover
                                        )[2].post.cover!
                                      }
                                      fill
                                      alt={"Read Later"}
                                      className="object-cover !relative h-full rounded-br-lg md:rounded-r-lg"
                                    />
                                  )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {lists.map((list) => (
                  <>
                    <ListCard list={list} session={sessionUserName} />
                  </>
                ))}
                {
                  sessionUserName?.id !== user.id && lists.length === 0 && (
                    <EmptyPlaceholder>
                      <EmptyPlaceholder.Icon name="list" />
                      <EmptyPlaceholder.Title>
                        No lists yet
                      </EmptyPlaceholder.Title>
                      <EmptyPlaceholder.Description>
                        When user creates a list, it will show up here.
                      </EmptyPlaceholder.Description>
                    </EmptyPlaceholder>
                  )
                }
              </div>
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
