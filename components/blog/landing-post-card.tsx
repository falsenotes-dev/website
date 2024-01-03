import React from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { BlurImage as Image } from "../image";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import UserHoverCard from "../user-hover-card";
import { Icons } from "../icon";
import TagBadge from "../tags/tag";
import LoginDialog from "../login-dialog";
import { dateFormat } from "@/lib/format-date";
import { Skeleton } from "../ui/skeleton";
import { shimmer, toBase64 } from "@/lib/image";

export default function LandingPostCard(
  props: React.ComponentPropsWithoutRef<typeof Card> & {
    post: any;
    className?: string | undefined;
  }
) {
  return (
    <Card {...props} className={cn("rounded-lg feedArticleCard bg-transparent w-full", props.className)}>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start justify-between gap-3 md:gap-5">
          <div className="flex-initial w-full">
            <div className="flex items-center space-x-1 mb-2">
              <UserHoverCard user={props.post.author} >
                <Link href={`/@${props.post.author?.username}`} className="flex items-center space-x-0.5">
                  <Avatar className="h-6 w-6 mr-0.5 border">
                    <AvatarImage src={props.post.author?.image} alt={props.post.author?.username} />
                    <AvatarFallback>{props.post.author?.name?.charAt(0) || props.post.author?.username?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-normal leading-none">{props.post.author?.name || props.post.author?.username} {props.post.author?.verified && (
                    <Icons.verified className="h-3 w-3 inline fill-verified align-middle" />
                  )}</p>
                </Link>
              </UserHoverCard>
              {
                props.post.publication && (
                  <UserHoverCard user={props.post.publication} >
                    <Link href={`/@${props.post.publication?.username}`} className="flex items-center space-x-0.5">
                      <span className="text-muted-foreground text-sm"> in </span>
                      <p className="text-sm font-normal leading-none">{props.post.publication?.name || props.post.publication?.username}</p>
                    </Link>
                  </UserHoverCard>
                )
              }
            </div>
            <Link href={`/@${props.post.publicationId === null ? props.post.author.username : props.post.publication.username}/${props.post.url}`}>
              <div>
                <div className="pb-2">
                  <h2 className="text-base md:text-xl font-bold text-ellipsis overflow-hidden post__title">{props.post.title}</h2>
                </div>
                <div className="post-subtitle hidden md:block">
                  <p className="text-ellipsis overflow-hidden line-clamp-2 text-muted-foreground">{props.post.subtitle}</p>
                </div>
              </div>
            </Link>
            <div className="mt-4 md:mt-6">
              <div className="flex justify-between items-center">
                <div className="flex flex-1 items-center space-x-1.5">

                  <span className="!text-muted-foreground text-xs">
                    {dateFormat(props.post.publishedAt)}
                  </span>
                  <span>·</span>
                  <p className="card-text mb-0 text-muted-foreground text-xs">{props.post.readingTime}</p>
                  {
                    props.post.tags?.length > 0 && (
                      <>
                        <span className="hidden md:inline">·</span>
                        <Link href={`/tags/${props.post.tags[0].tag?.name}`} className="hidden md:block" key={props.post.tags[0].tag?.id}>
                          <TagBadge variant={"secondary"} className="flex">
                            {
                              //replace - with space
                              props.post.tags[0].tag?.name.replace(/-/g, " ")
                            }
                          </TagBadge>
                        </Link>
                      </>
                    )
                  }

                </div>
                <div className="flex items-center space-x-1 text-muted-foreground text-sm">
                  <LoginDialog>
                    <Button variant="ghost" size={"icon"} className="text-muted-foreground">
                      <Icons.bookmark className={`h-5 w-5 `} />
                      <span className="sr-only">Save</span>
                    </Button>
                  </LoginDialog>
                </div>
              </div>
            </div>
          </div>
          {props.post.cover && (
            <div className="flex-none">
              <Link href={`/@${props.post.publicationId === null ? props.post.author.username : props.post.publication.username}/${props.post.url}`} aria-label={`Link to ${props.post.title} by ${props.post.author?.username}`}>
                <div className="h-[100px] md:h-36 rounded-md bg-muted !relative !pb-0 md:aspect-[4/3] aspect-square overflow-hidden" >

                  <>
                    <Image
                      src={props.post.cover}
                      fill
                      alt={props.post.title}
                      placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`}
                      className="object-cover max-w-full h-auto z-[1] rounded-md"
                    />
                    <Skeleton className="w-full h-full rounded-md" />
                  </>

                </div>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

