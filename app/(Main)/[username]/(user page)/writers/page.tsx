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
import { Metadata } from "next";
import UserHoverCard from "@/components/user-hover-card";

export async function generateMetadata(
     {
          params,
     }: {
          params: {
               username: string;
          };
     }
): Promise<Metadata> {
     const decodedUsername = decodeURIComponent(params.username);
     const user = await db.user.findUnique({
          where: {
               username: decodedUsername.substring(1),
          },
          select: {
               name: true,
               username: true,
               bio: true,
               image: true,
               lists: {
                    select: { name: true },
                    take: 3,
               },
          },
     });
     if (!user) {
          return {
               title: `Not Found - FalseNotes`,
               description: `The page you were looking for doesn't exist.`,
               openGraph: {
                    title: `Not Found - FalseNotes`,
                    description: `The page you were looking for doesn't exist.`,
               },
               twitter: {
                    card: "summary",
                    title: `Not Found - FalseNotes`,
                    description: `The page you were looking for doesn't exist.`,
               },
          };
     }

     return {
          title: `${user.name || user.username} on FalseNotes assembled some lists`,
          description: `Explore ${user.lists.map((list) => list.name).join(", ")} and more on FalseNotes.`,
          openGraph: {
               siteName: "FalseNotes",
               title: `${user.name || user.username} on FalseNotes assembled some lists`,
               description: `Explore ${user.lists.map((list) => list.name).join(", ")} and more on FalseNotes.`,
               ...user?.image && {
                    images: [
                         {
                              url: user?.image,
                              alt: `${user.username} - FalseNotes`,
                         }
                    ],
               },
          },
          twitter: {
               card: "summary",
               title: `${user.name || user.username} on FalseNotes assembled some lists`,
               description: `Explore ${user.lists.map((list) => list.name).join(", ")} and more on FalseNotes.`,
          },
     };
}

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
               <Tabs user={user} defaultValue="writers" />
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
          </>
     );
}
