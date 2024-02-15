import CreateListButton from "@/components/create-list-button";
import { formatNumberWithSuffix } from "@/components/format-numbers";
import { getSessionUser } from "@/components/get-session-user";
import { Icons } from "@/components/icon";
import ListCard from "@/components/list-card";
import ListsTabs from "@/components/lists-tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { shimmer, toBase64 } from "@/lib/image";
import db from "@/lib/db";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lists",
  description: "Your lists",
};

export default async function ListsPage() {
  const session = await getSessionUser();

  const lists = await db.list.findMany({
    where: {
      authorId: session?.id,
    },
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
      userId: session?.id,
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

  const user = await db.user.findFirst({
    where: {
      id: session?.id,
    },
  });
  return (
    <>
      <div className="flex-auto w-full px-4">
        <div className="pb-14">
          <div className="flex justify-center">
            <div className="my-6 w-full">
              <div className="mt-6 md:mt-12 mb-10">
                <div className="flex justify-between">
                  <h1 className="font-medium line-clamp-1 break-all text-4xl">
                    Your Library
                  </h1>
                  <CreateListButton />
                </div>
              </div>
              <ListsTabs />
              <div className="flex flex-col gap-10">
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
                              {
                                bookmarks.filter((p: any) => p.post.cover)[0] && (
                                  <Image
                                    src={bookmarks.filter((p: any) => p.post.cover)[0].post.cover!}
                                    fill
                                    alt={'Read Later'}
                                    className="object-cover !relative h-full rounded-bl-lg md:rounded-none"
                                  />
                                )
                              }
                            </div>
                          </div>
                          <div className="relative bg-muted self-stretch w-full z-[2] border-r-[3px] border-background pl-2 -ml-20 min-h-[8rem]">
                            <div className="h-full w-full">
                              {
                                bookmarks.filter((p: any) => p.post.cover)[1] && (
                                  <Image
                                    src={bookmarks.filter((p: any) => p.post.cover)[1].post.cover!}
                                    fill
                                    alt={'Read Later'}
                                    className="object-cover !relative h-full"
                                  />
                                )
                              }
                            </div>
                          </div>
                          <div className="relative bg-muted self-stretch z-[1] border-none pl-2 -ml-32 w-full rounded-br-lg md:rounded-r-lg min-h-[8rem]">
                            <div className="h-full w-full">
                              {
                                bookmarks.filter((p: any) => p.post.cover)[2] && (
                                  <Image
                                    src={bookmarks.filter((p: any) => p.post.cover)[2].post.cover!}
                                    fill
                                    alt={'Read Later'}
                                    className="object-cover !relative h-full rounded-br-lg md:rounded-r-lg"
                                  />
                                )
                              }
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
                {lists.map((list) => (
                  <>
                    <ListCard list={list} session={session} />
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
