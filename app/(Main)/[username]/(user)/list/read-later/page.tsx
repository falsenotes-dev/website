import { formatNumberWithSuffix } from "@/components/format-numbers";
import { getSessionUser } from "@/components/get-session-user";
import { Icons } from "@/components/icon";
import ReadLaterPosts from "@/components/read-later-posts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import db from "@/lib/db";
import { getLists } from "@/lib/prisma/session";
import Link from "next/link";


export default async function ListPage() {
  const session = await getSessionUser();
  const list = await db.bookmark.findMany({
    where: {
      userId: session?.id,
    },
    include: {
      user: true,

      post: {
        include: {
          author: {
            include: {
              Followers: true,
              Followings: true,
            },
          },
          likes: true,
          savedUsers: { select: { userId: true } },
          _count: {
            select: {
              likes: true,
              savedUsers: true,
              readedUsers: true,
              shares: true,
              comments: true,
            },
          },
          tags: {
            take: 1,
            select: {
              tag: true,
            },
          },
          publication: {
            include: {
              _count: { select: { Followers: true, Followings: true } },
            },
          },
        },
      }
    },
  });

  const user = await db.user.findFirst({
    where: {
      id: session?.id
    },
  });

  if (!list) return null;
  if (!session) return null;

  const userLists = await getLists({ id: session?.id });

  return (
    <>
      <div className="flex-auto w-full">
        <div className="min-h-screen flex flex-col">
          <div className="flex flex-col justify-center">
            <div className="w-full lg:mx-6">
              <div className="lg:mt-14 mt-8 mb-8">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <Link href={`/@${user?.username}`}>
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={user?.image!}
                          alt={user?.name || user?.username}
                        />
                        <AvatarFallback>
                          {user?.name?.charAt(0) || user?.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex flex-col">
                      <Link href={`/@${user?.username}`}>
                        <div className="line-clamp-1 inline-flex items-center">
                          {user?.name || user?.username}{" "}
                          {user?.verified && (
                            <Icons.verified className="h-4 w-4 mx-0.5 fill-verified" />
                          )}
                        </div>
                      </Link>
                      <div className="flex flex-wrap items-center">
                        <div className="inline-flex items-center text-xs text-muted-foreground">
                          <p className="text-inherit">
                            {formatNumberWithSuffix(list.length)} posts
                          </p>
                          <span className="mx-2 text-inherit">·</span>
                          <p className="text-inherit capitalize">
                            private
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="w-full lg:mx-6">
                <div className="pb-6">
                  <h2 className="text-3xl line-clamp-2 font-bold">
                    {user?.name || user?.username}&apos;s Read Later
                  </h2>
                </div>
              </div>
              <ReadLaterPosts list={list} session={session} lists={userLists} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
