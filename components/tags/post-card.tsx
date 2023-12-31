"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BlurImage as Image } from "../image";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MessageCircle, MoreHorizontal, User } from "lucide-react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import UserHoverCard from "../user-hover-card";
import { Icons } from "../icon";
import TagBadge from "../tags/tag";
import { dateFormat } from "@/lib/format-date";
import { formatNumberWithSuffix } from "../format-numbers";
import { usePathname } from "next/navigation";
import PostMoreActions from "../blog/post-more-actions";
import LoginDialog from "../login-dialog";
import { Skeleton } from "../ui/skeleton";
import { shimmer, toBase64 } from "@/lib/image";
import { validate } from "@/lib/revalidate";
import PostAnalyticsDialog from "../blog/post-analytics-dialog";
import ListPopover from "../list-popover";
import { getLists } from "@/lib/prisma/session";

export default function TagPostCard({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Card> & {
  post: any;
  className?: string;
  session: any;
  list?: any;
}) {
  const pathname = usePathname();
  const like = async (postId: string) => {
    await fetch(`/api/post/${postId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId }),
    });
    await validate(pathname);
  };
  const isLiked = props.post?.likes?.some(
    (like: any) => like.authorId === props.session?.id
  );
  const [isSaved, setIsSaved] = React.useState(false);
  React.useEffect(() => {
    const checkIsSaved =
      props.list?.lists?.some((list: any) =>
        list.posts?.some((post: any) => post.postId === props.post.id)
      ) ||
      props.list?.bookmarks?.some(
        (bookmark: any) => bookmark.postId === props.post.id
      );
    setIsSaved(checkIsSaved);
  }, [props.list?.lists, props.list?.bookmarks, props.post.id]);
  return (
    <Card
      {...props}
      className={cn(
        "rounded-lg feedArticleCard bg-transparent md:mb-14",
        className
      )}
    >
      <CardContent className="md:p-6 p-4 h-full">
        <div className="flex flex-col grid-cols-12 gap-y-8 items-start h-full">
          <div className="w-full">
            <Link href={`/@${!props.post.publication ? props.post.author.username : props.post.publication.username}/${props.post.url}`}>
              <div className="w-full h-auto bg-muted rounded-md !relative !pb-0 aspect-[2/1] overflow-hidden">
                {props.post.cover ? (
                  <>
                    <Image
                      src={props.post.cover}
                      fill
                      alt={props.post.title}
                      placeholder={`data:image/svg+xml;base64,${toBase64(
                        shimmer(1920, 1080)
                      )}`}
                      className="object-cover max-w-full h-auto z-[1] rounded-md"
                    />
                    <Skeleton className="w-full h-full rounded-md" />
                  </>
                ) : (
                  <Icons.noThumbnail className="w-full h-full rounded-md" />
                )}
              </div>
            </Link>
          </div>
          <div className="col-span-12 flex flex-col justify-between space-y-4 h-full w-full">
            <div className="flex items-center space-x-1">
              <UserHoverCard user={props.post.author}>
                <Link
                  href={`/@${props.post.author?.username}`}
                  className="flex items-center space-x-0.5"
                >
                  <Avatar className="h-5 w-5 mr-0.5 border">
                    <AvatarImage
                      src={props.post.author?.image}
                      alt={props.post.author?.username}
                    />
                    <AvatarFallback>
                      {props.post.author?.name?.charAt(0) ||
                        props.post.author?.username?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-normal leading-none">
                    {props.post.author?.name || props.post.author?.username}
                  </p>
                  {props.post.author?.verified && (
                    <Icons.verified className="h-3 w-3 inline fill-verified align-middle" />
                  )}
                </Link>
              </UserHoverCard>
              {
                props.post.publication && (
                  <Link href={`/@${props.post.publication?.username}`}>
                    <div className="flex items-center space-x-0.5">
                      <span className="text-sm font-normal leading-none text-muted-foreground">
                        in
                      </span>
                      <p className="text-sm font-normal leading-none">
                        {props.post.publication?.name ||
                          props.post.publication?.username}
                      </p>
                    </div>
                  </Link>
                )
              }
            </div>
            <div className="flex">
              <div className="flex-initial w-full">
                <Link
                  href={`/@${!props.post.publication ? props.post.author.username : props.post.publication.username}/${props.post.url}`}
                >
                  <div>
                    <div className="pb-2">
                      <h2 className="text-base md:text-xl font-bold text-ellipsis overflow-hidden post__title custom">
                        {props.post.title}
                      </h2>
                    </div>
                    <div className="post-subtitle hidden md:block">
                      <p className="text-ellipsis text-base overflow-hidden post__subtitle text-muted-foreground">
                        {props.post.subtitle}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <div className="">
              <div className="flex justify-between items-center">
                <div className="flex flex-1 items-center space-x-1.5 text-muted-foreground text-sm">
                  <span>{props.post.readingTime}</span>
                  <span>·</span>
                  <span>{dateFormat(props.post.publishedAt)}</span>
                </div>
              </div>
            </div>
            <div className="">
              <div className="flex justify-between items-center">
                <div className="flex flex-1 items-center space-x-2.5">
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    {props.session ? (
                      <Button
                        variant="ghost"
                        size={"icon"}
                        className="h-8 w-8 text-muted-foreground"
                        onClick={() => like(props.post.id)}
                        disabled={
                          props.session.id === props.post.author.id ||
                          (props.post.allowLikes == null
                            ? false
                            : !props.post.allowLikes)
                        }
                      >
                        <Icons.like
                          className={`w-5 h-5 ${isLiked && "fill-current"}`}
                        />
                        <span className="sr-only">Like</span>
                      </Button>
                    ) : (
                      <LoginDialog>
                        <Button
                          variant="ghost"
                          size={"icon"}
                          className="h-8 w-8 text-muted-foreground"
                        >
                          <Icons.like className={`w-5 h-5`} />
                          <span className="sr-only">Like</span>
                        </Button>
                      </LoginDialog>
                    )}
                    {props.post.allowLikes && (
                      <span className="text-sm">
                        {formatNumberWithSuffix(props.post._count.likes)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Link
                      href={`/@${!props.post.publication ? props.post.author.username : props.post.publication.username}/${props.post.url}?commentsOpen=true`}
                    >
                      <Button
                        variant="ghost"
                        size={"icon"}
                        className="h-8 w-8 text-muted-foreground"
                        disabled={
                          props.post.allowComments == null
                            ? false
                            : !props.post.allowComments
                        }
                      >
                        <Icons.commentBubble className="w-5 h-5" />
                        <span className="sr-only">Comment</span>
                      </Button>
                    </Link>
                    {props.post.allowComments && (
                      <span className="text-sm">
                        {formatNumberWithSuffix(props.post._count.comments)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-around gap-2">
                  {props.post.published &&
                    (props.session?.id === props.post.authorId || props.session?.id === props.post.publicationId) && (
                      <div className="flex items-center space-x-1">
                        <PostAnalyticsDialog post={props.post} />
                      </div>
                    )}
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    {props.session ? (
                      <ListPopover
                        lists={props.list.lists}
                        session={props.session}
                        postId={props.post.id}
                        bookmarks={props.list.bookmarks}
                      >
                        <Button
                          variant="ghost"
                          size={"icon"}
                          className="text-muted-foreground"
                        >
                          {isSaved ? (
                            <Icons.bookmarkFill className="h-5 w-5" />
                          ) : (
                            <Icons.bookmark className="h-5 w-5" />
                          )}
                          <span className="sr-only">Save</span>
                        </Button>
                      </ListPopover>
                    ) : (
                      <LoginDialog>
                        <Button
                          variant="ghost"
                          size={"icon"}
                          className="h-8 w-8 text-muted-foreground"
                        >
                          <Icons.bookmark className={`h-5 w-5`} />
                          <span className="sr-only">Save</span>
                        </Button>
                      </LoginDialog>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <PostMoreActions post={props.post} session={props.session}>
                      <Button
                        variant="ghost"
                        size={"icon"}
                        className="text-muted-foreground"
                      >
                        <Icons.moreHorizontal className="h-5 w-5" />
                        <span className="sr-only">More</span>
                      </Button>
                    </PostMoreActions>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
