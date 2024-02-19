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
import { PostCreateButton } from "@/components/user/post-create-button";
import { UserPosts } from "@/components/user";
import { getLists } from "@/lib/prisma/session";

export const metadata: Metadata = {
     title: "Drafts",
     description: "Your drafts",
};

export default async function DraftsPage() {
     const session = await getSessionUser();

     const drafts = await db.post.findMany({
          where: {
               authorId: session?.id,
               published: false,
          },
          include: {
               author: {
                    include: {
                         _count: { select: { posts: true, Followers: true, Followings: true } },
                    },
               },
               savedUsers: true,
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
                    include: {
                         tag: true,
                    },
               },
               publication: {
                    include: {
                         _count: { select: { posts: true, Followers: true, Followings: true } },
                    },
               },
          },
     });

     const user = await db.user.findFirst({
          where: {
               id: session?.id,
          },
     });
     const list = await getLists({ id: session?.id });
     return (
          <>
               <div className="flex-auto w-full px-4">
                    <div className="pb-14">
                         <div className="flex justify-center">
                              <div className="my-6 w-full">
                                   <div className="mt-6 md:mt-12 mb-10">
                                        <div className="flex justify-between">
                                             <h1 className="font-medium line-clamp-1 break-all text-4xl">
                                                  Your Drafts
                                             </h1>
                                             <PostCreateButton />
                                        </div>
                                   </div>
                                   <div className="flex flex-col gap-10">
                                        <UserPosts posts={drafts} user={user} sessionUser={session} list={list} />
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </>
     );
}
