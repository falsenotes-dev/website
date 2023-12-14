import { formatNumberWithSuffix } from "@/components/format-numbers";
import { getSessionUser } from "@/components/get-session-user";
import { Icons } from "@/components/icon";
import ListHeader from "@/components/list-header";
import ListMoreActions from "@/components/list-more-actions";
import ListPosts from "@/components/list-posts";
import LoginDialog from "@/components/login-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { dateFormat } from "@/lib/format-date";
import postgres from "@/lib/postgres";
import { getLists } from "@/lib/prisma/session";
import { MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";

export default async function ListPage({
  params,
}: {
  params: { slug: string };
}) {
  if (!params.slug) return null;
  const session = await getSessionUser();
  const list = await postgres.list.findFirst({
    where: {
      slug: params.slug,
    },
    include: {
      _count: { select: { posts: true, savedUsers: true } },
      author: true,
      posts: {
        select: {
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
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      savedUsers: true,
    },
  });

  if (!list) return null;
  if (list.visibility === "private" && list.authorId !== session?.id)
    return null;

    const lists = await getLists({ id: session?.id });

  return (
    <>
      <div className="flex-auto w-full">
        <div className="min-h-screen flex flex-col">
          <div className="flex flex-col justify-center">
            <div className="w-full lg:mx-6">
              <div className="lg:mt-14 mt-8 mb-8">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <Link href={`/@${list.author.username}`}>
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={list.author?.image!}
                        alt={list.author.name || list.author.username}
                      />
                      <AvatarFallback>
                        {list.author.name?.charAt(0) || list.author.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    </Link>
                    <div className="flex flex-col">
                      <Link href={`/@${list.author.username}`}>
                      <div className="line-clamp-1 inline-flex items-center">
                        {list.author.name || list.author.username}{" "}
                        {list.author.verified && (
                          <Icons.verified className="h-4 w-4 mx-0.5 fill-verified" />
                        )}
                      </div>
                      </Link>
                      <div className="flex flex-wrap items-center">
                        <div className="inline-flex items-center text-xs text-muted-foreground">
                          <p className="text-inherit">
                            {dateFormat(list.createdAt)}
                          </p>
                          <span className="mx-2 text-inherit">·</span>
                          <p className="text-inherit">
                            {formatNumberWithSuffix(list._count.posts)} posts
                          </p>
                          <span className="mx-2 text-inherit">·</span>
                          <p className="text-inherit capitalize">
                            {list.visibility}
                          </p>
                          <span className="mx-2 text-inherit">·</span>
                          <p className="text-inherit">
                            {formatNumberWithSuffix(list._count.savedUsers)}{" "}
                            saves
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <ListHeader list={list} session={session} lists={lists} />
              <ListPosts list={list} session={session} lists={lists} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
