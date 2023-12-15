'use client'
import Image from "next/image";
import { formatNumberWithSuffix } from "./format-numbers";
import { Icons } from "./icon";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { shimmer, toBase64 } from "@/lib/image";
import Link from "next/link";
import ListMoreActions from "./list-more-actions";
import { Button } from "./ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import LoginDialog from "./login-dialog";
import { saveList } from "@/lib/prisma/list";
import { validate } from "@/lib/revalidate";
import { toast } from "sonner";
import React from "react";

export default function ListCard({
  list,
  session,
  ...props
}: React.ComponentPropsWithoutRef<typeof Card> & { list: any, session: any }) {
  const [saved, setSaved] = React.useState(false);
     React.useEffect(() => {
          setSaved(list.savedUsers.find((user: any) => user.userId === session?.id))
     }, [list.savedUsers, session])
  return (
    <>
      <Card {...props}>
        <CardContent className="p-0">
          <div className="flex flex-col">
            <CardHeader className="h-full p-4">
              <Link href={`/@${list.author.username}/list/${list.slug}`}>
                <CardTitle className="line-clamp-1 text-base">{list.name}</CardTitle>
              </Link>
              <div className="flex justify-between">
                <div className="flex my-1.5">
                  <p className="text-muted-foreground text-xs">
                    {formatNumberWithSuffix(list._count.posts)} posts
                  </p>
                  <span className="mx-2 text-muted-foreground text-xs">
                    ·
                  </span>
                  <p className="text-muted-foreground text-xs">
                    {formatNumberWithSuffix(list._count.savedUsers)} saves
                  </p>
                </div>
              </div>
            </CardHeader>
            <Link href={`/list/${list.slug}`} className="pointer-events-none rounded-b-lg">
               <div className="relative flex flex-[0_0_auto] w-full overflow-hidden">
                    <div className="relative bg-muted z-[3] border-r-[3px] border-background pl-0 rounded-bl-lg w-full h-32">
                         <div className="h-full">
                              {
                                   list.posts.filter((p: any) => p.post.cover)[0] && (
                                        <Image
                                             src={list.posts.filter((p: any) => p.post.cover)[0].post.cover!}
                                             fill
                                             alt={'Read Later'}
                                             className="object-cover !relative h-full rounded-bl-lg"
                                        />
                                   )
                              }
                         </div>
                    </div>
                    <div className="relative bg-muted z-[2] border-r-[3px] border-background pl-2 -ml-20 w-full h-32">
                         <div className="h-full">
                         {
                              list.posts.filter((p: any) => p.post.cover)[1] && (
                                   <Image
                                        src={list.posts.filter((p: any) => p.post.cover)[1].post.cover!}
                                        fill
                                        alt={'Read Later'}
                                        className="object-cover !relative h-full"
                                   />
                              )
                         }
                         </div>
                    </div>
                    <div className="relative bg-muted z-[1] border-none pl-2 -ml-32 rounded-br-lg w-full h-32">
                         <div className="h-full">
                         {
                              list.posts.filter((p: any) => p.post.cover)[2] && (
                                   <Image
                                        src={list.posts.filter((p: any) => p.post.cover)[2].post.cover!}
                                        fill
                                        alt={'Read Later'}
                                        className="object-cover !relative h-full rounded-br-lg"
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
    </>
  );
}
