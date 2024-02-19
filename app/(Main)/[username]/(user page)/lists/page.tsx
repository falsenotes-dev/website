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
          </>
     );
}
