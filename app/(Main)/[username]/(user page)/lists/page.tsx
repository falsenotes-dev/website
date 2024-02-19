import { getSessionUser } from "@/components/get-session-user";
import { notFound, redirect } from "next/navigation";
import db from "@/lib/db";
import { getUserPost } from "@/lib/prisma/posts";
import { getLists } from "@/lib/prisma/session";
import { MobileBottomNavbar } from "@/components/navbar/mobile-bottom-navbar";
import PostCard from "@/components/blog/post-card-v3";
import Tabs from "@/components/user/tab";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/icon";
import { formatNumberWithSuffix } from "@/components/format-numbers";
import Image from "next/image";
import ListCard from "@/components/list-card-v3";
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
               urls: true,
               _count: {
                    select: {
                         posts: {
                              where: {
                                   published: true,
                              },
                         },
                         publicationsPosts: {
                              where: {
                                   published: true,
                              },
                         },
                         Followers: true,
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
               writers: {
                    where: {
                         visibility: "public",
                    },
                    select: {
                         author: {
                              include: {
                                   _count: { select: { Followers: true, Followings: true } },
                              },
                         },
                    }
               },
               publications: {
                    where: {
                         visibility: "public",
                    },
                    select: {
                         publication: {
                              include: {
                                   _count: { select: { Followers: true, Followings: true } },
                              },
                         },
                    },
                    take: 5,
               }
          },
          where: {
               username: decodedUsername.substring(1),
          },
     });

     if (!user) {
          return notFound();
     }

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

     return (
          <>
               <Tabs user={user} defaultValue="lists" />
               <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-6">
                    {lists.map((list) => (
                         <div key={list.id}>
                              <ListCard list={list} session={sessionUserName} className="w-full" />
                         </div>
                    ))}
                    {
                         sessionUserName?.id !== user.id && lists.length === 0 && (
                              <EmptyPlaceholder className="w-full">
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
               {/* <div className="md:container mx-auto px-4 pt-5 md:mb-0 mb-20">
        <div className="gap-5 lg:gap-6 flex flex-col md:flex-row items-start xl:px-4 pt-5">
          <div
            className="user__header md:hidden w-full sm:h-fit lg:min-w-[352px] lg:border-r lg:max-w-[352px] md:px-8 xl:min-w-[368px] xl:max-w-[368px] lg:pl-10 lg:flex flex-col md:sticky top-[115px]"
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
            <SiteFooter className="text-xs flex-col justify-start items-start mb-0 mt-4 !px-0" size="sm" />
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
                {
                  user?.writers?.length > 0 && (
                    <TabsTrigger value="writers">Writers</TabsTrigger>
                  )
                }
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
                
              </TabsContent>
              <TabsContent value="writers">
                <div className="flex flex-col gap-6 my-6">
                  {user?.writers?.map(({ author }) => (
                    <div className="flex gap-4 w-full items-center" key={author.id}>
                      <div className="space-y-3">
                        <UserHoverCard user={author} >
                          <Link href={`/@${author.username}`} className="flex items-center">
                            <Avatar className="h-10 w-10 mr-2 md:mr-3">
                              <AvatarImage src={author.image || ''} alt={author.username} />
                              <AvatarFallback>{author.name?.charAt(0) || author.username?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {
                              author.name === null ? (
                                <div>
                                  <p className="text-sm font-medium leading-none">{author.username} {author.verified && (
                                    <Icons.verified className="h-3 w-3 inline fill-verified align-middle" />
                                  )}</p>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-sm font-medium leading-none">{author.name} {author.verified && (
                                    <Icons.verified className="h-3 w-3 inline fill-verified align-middle" />
                                  )}</p>
                                  <p className="text-sm text-muted-foreground">{author.username}</p>
                                </div>
                              )
                            }
                          </Link>
                        </UserHoverCard>
                      </div>
                    </div>
                  ))}
                </div >
              </TabsContent>
              <TabsContent value="about">
                <UserAbout user={user} session={sessionUserName} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div> */}
               <MobileBottomNavbar />
          </>
     );
}
