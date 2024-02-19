import { getSessionUser } from "@/components/get-session-user";
import { notFound, redirect } from "next/navigation";
import db from "@/lib/db";
import { getUserPost } from "@/lib/prisma/posts";
import { getLists } from "@/lib/prisma/session";
import { MobileBottomNavbar } from "@/components/navbar/mobile-bottom-navbar";
import PostCard from "@/components/blog/post-card-v3";
import Tabs from "@/components/user/tab";
import { UserAbout } from "@/components/user/about";
import { Metadata } from "next";
import { formatNumberWithSuffix } from "@/components/format-numbers";

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
               _count: {
                    select: {
                         posts: {
                              where: {
                                   published: true,
                              },
                         },
                    },
               }
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
          title: `About - ${user.name || user.username} - FalseNotes`,
          description: `Read writing from ${user.name || user.username} on FalseNotes. ${user?.bio === null || user?.bio === "" ? `${user?.username} has ${formatNumberWithSuffix(
               user?._count.posts
          )} posts. Follow their to keep up with their activity on FalseNotes.` : user?.bio}`,
          openGraph: {
               siteName: "FalseNotes",
               title: `About - ${user.name || user.username} - FalseNotes`,
               description: `Read writing from ${user.name || user.username} on FalseNotes. ${user?.bio === null || user?.bio === "" ? `${user?.username} has ${formatNumberWithSuffix(
                    user?._count.posts
               )} posts. Follow their to keep up with their activity on FalseNotes.` : user?.bio}`,
               ...user?.image && {
                    images: [
                         {
                              url: user?.image,
                              alt: `${user.username} - FalseNotes`,
                         },
                    ],
               }
          },
          twitter: {
               card: "summary",
               title: `About - ${user.name || user.username} - FalseNotes`,
               description: `Read writing from ${user.name || user.username} on FalseNotes. ${user?.bio === null || user?.bio === "" ? `${user?.username} has ${formatNumberWithSuffix(
                    user?._count.posts
               )} posts. Follow their to keep up with their activity on FalseNotes.` : user?.bio}`,
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

     const search =
          typeof searchParams.search === "string" ? searchParams.search : undefined;
     if (!user) {
          return notFound();
     }

     let pinnedPost = await db.post.findFirst({
          where: {
               publicationId: user.id,
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
                         _count: { select: { Followers: true, Followings: true } },
                    },
               },
               publication: {
                    include: {
                         _count: { select: { Followers: true, Followings: true } },
                    },
               },
          },
     });

     if (pinnedPost === null) {
          pinnedPost = await db.post.findFirst({
               where: {
                    authorId: user.id,
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
                              _count: { select: { Followers: true, Followings: true } },
                         },
                    },
                    publication: {
                         include: {
                              _count: { select: { Followers: true, Followings: true } },
                         },
                    },
               },
          });
     }

     return (
          <>
               <Tabs user={user} defaultValue="about" />
               <UserAbout user={user} session={sessionUserName} />
          </>
     );
}
