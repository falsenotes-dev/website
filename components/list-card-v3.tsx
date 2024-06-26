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
        <CardContent className="p-0 h-full">
          <div className="flex flex-col h-full">
            <CardHeader className="w-full gap-4 h-full">
              <Link href={`/@${list.author.username}`} className="flex gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={list.author.image} />
                  <AvatarFallback>{list.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="text-sm flex items-center line-clamp-1">
                  {list.author.name || list.author.username}{" "}
                  {list.author.verified && (
                    <Icons.verified className="h-3.5 w-3.5 mx-0.5 fill-verified" />
                  )}
                </p>
              </Link>
              <Link href={`/@${list.author.username}/list/${list.slug}`}>
                <CardTitle className="line-clamp-1 my-2">{list.name}</CardTitle>
                {list.description && (
                  <CardDescription className="line-clamp-2">
                    {list.description}
                  </CardDescription>
                )}
              </Link>
              <div className="flex justify-between">
                <div className="flex my-1.5">
                  <p className="text-muted-foreground text-xs">
                    {formatNumberWithSuffix(list._count.posts)} posts
                  </p>
                  {list.visibility === "private" && (
                    <Icons.lock className="h-4 w-4 text-muted-foreground mx-2" />
                  )}
                </div>
                <div className="flex gap-1">
                  {
                    session ? (
                      <Button variant="ghost" size={'icon'} className="text-muted-foreground" disabled={list.authorId === session?.id} onClick={
                        async () => {
                          const res = await saveList({ id: list.id });
                          await validate(`/list/saved`);
                          if (res.success) {
                            toast(res.message)
                          } else {
                            toast.error(res.message)
                          }
                        }
                      }>
                        {saved ? (
                          <Icons.listSaveFill className="h-5 w-5" />
                        ) : (
                          <Icons.listSave className="h-5 w-5" />
                        )}
                      </Button>
                    ) : (
                      <LoginDialog>
                        <Button variant="ghost" size={'icon'} className="text-muted-foreground">
                          <Icons.listSave className="h-5 w-5" />
                        </Button>
                      </LoginDialog>
                    )
                  }
                  <ListMoreActions list={list} session={session}>
                    <Button variant="ghost" size={'icon'} className="text-muted-foreground">
                      <MoreHorizontalIcon className="h-5 w-5" />
                    </Button>
                  </ListMoreActions>
                </div>
              </div>
            </CardHeader>
            <Link href={`/list/${list.slug}`} className="pointer-events-none rounded-b-lg">
              <div className="relative flex justify-end w-full overflow-hidden h-full min-h-[8rem] max-h-48">
                <div className="relative bg-muted z-[3] border-r-[3px] border-background w-full pl-0 rounded-bl-lg min-h-[9rem] max-h-48 self-stretch">
                  <div className="absolute h-full w-full">
                    {
                      list.posts.filter((p: any) => p.post.cover)[0] && (
                        <Image
                          src={list.posts.filter((p: any) => p.post.cover)[0].post.cover!}
                          fill
                          alt={'Read Later'}
                          className="object-cover h-full rounded-bl-lg"
                        />
                      )
                    }
                  </div>
                </div>
                <div className="relative bg-muted w-full z-[2] border-r-[3px] border-background pl-2 -ml-20 min-h-[9rem] max-h-48 self-stretch">
                  <div className="h-full absolute w-full">
                    {
                      list.posts.filter((p: any) => p.post.cover)[1] && (
                        <Image
                          src={list.posts.filter((p: any) => p.post.cover)[1].post.cover!}
                          fill
                          alt={'Read Later'}
                          className="object-cover h-full"
                        />
                      )
                    }
                  </div>
                </div>
                <div className="relative bg-muted z-[1] border-none pl-2 -ml-32 w-full rounded-br-lg min-h-[9rem] max-h-48 self-stretch overflow-hidden">
                  <div className="h-full absolute w-full">
                    {
                      list.posts.filter((p: any) => p.post.cover)[2] && (
                        <Image
                          src={list.posts.filter((p: any) => p.post.cover)[2].post.cover!}
                          fill
                          alt={'Read Later'}
                          className="object-cover h-full !rounded-br-lg"
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
