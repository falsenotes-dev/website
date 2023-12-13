import { formatNumberWithSuffix } from "@/components/format-numbers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { dateFormat } from "@/lib/format-date";
import postgres from "@/lib/postgres";

export default async function ListPage({
  params,
}: {
  params: { slug: string };
}) {
  if (!params.slug) return null;
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
    },
  });

  if (!list) return null;

  return (
     <>
          <div className="flex-auto w-full">
               <div className="min-h-screen flex flex-col">
                    <div className="flex flex-col justify-center">
                         <div className="w-full mx-6">
                              <div className="mt-14 mb-8">
                                   <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                      <Avatar className="w-12 h-12">
                                        <AvatarImage src={list.author?.image!} alt={list.author.name || list.author.username} />
                                        <AvatarFallback>
                                          {list.author.name?.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex flex-col">
                                      <div className="line-clamp-1">{list.author.name || list.author.username}</div>
                                      <div className="flex flex-wrap items-center">
                                        <div className="inline-flex items-center text-xs text-muted-foreground">
                                          <p className="text-inherit">{dateFormat(list.createdAt)}</p>
                                          <span className="mx-2 text-inherit">·</span>
                                          <p className="text-inherit">{formatNumberWithSuffix(list._count.posts)} posts</p>
                                          <span className="mx-2 text-inherit">·</span>
                                          <p className="text-inherit capitalize">{list.visibility}</p>
                                          <span className="mx-2 text-inherit">·</span>
                                          <p className="text-inherit">{formatNumberWithSuffix(list._count.savedUsers)} saves</p>
                                        </div>
                                      </div>
                                      </div>
                                    </div>
                                   </div>
                              </div>
                         </div>
                         <div>
                          <div className="pb-16">
                            <div className="w-full mx-6">
                              <div className="pb-6">
                                <h2 className="text-3xl line-clamp-2 font-bold">{list.name}</h2>
                              </div>
                            </div>
                          </div>
                         </div>
                    </div>
               </div>
          </div>
     </>
  )
}