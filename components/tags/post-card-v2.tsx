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
import { BarChart2, MoreHorizontal } from "lucide-react";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import UserHoverCard from "../user-hover-card";
import { Icons } from "../icon";
import TagBadge from "../tags/tag";
import { dateFormat } from "@/lib/format-date";
import { usePathname } from "next/navigation";
import PostMoreActions from "../blog/post-more-actions";
import LoginDialog from "../login-dialog";
import { Skeleton } from "../ui/skeleton";
import { shimmer, toBase64 } from "@/lib/image";
import { validate } from "@/lib/revalidate";
import PostAnalyticsDialog from "../blog/post-analytics-dialog";
import ListPopover from "../list-popover";

export default function PostCard(
  props: React.ComponentPropsWithoutRef<typeof Card> & {
    post: any;
    session: any;
    user?: string;
    className?: string;
    list?: any;
  }
) {
  const pathname = usePathname();
  const save = async (postId: string) => {
    await fetch(`/api/post/${postId}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId }),
    });
    await validate(pathname);
  };
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
        "feedArticleCard bg-background max-h-72 w-full",
        props.className
      )}
    >
      <CardContent className="md:p-6 p-4">
        <CardHeader className={cn("pb-4 pt-0 px-0 gap-y-4 flex-row justify-between items-center")}>
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
            <span className="!text-muted-foreground text-sm mx-1 md:mx-1.5">
              ·
            </span>

            {
              props.post.publication && (
                <>
                  <Link
                    href={`/@${props.post.publication?.username}`}
                    className="flex items-center space-x-0.5"
                  >
                    <p className="text-sm font-normal leading-none">
                      <span className="text-muted-foreground">
                        {
                          props.user == "true" && (
                            "Published "
                          )
                        }
                        {"in "}
                      </span>
                      <span>{props.post.publication?.name || props.post.publication?.username}</span>
                    </p>
                  </Link>
                  <span className="!text-muted-foreground text-sm mx-1 md:mx-1.5">
                    ·
                  </span>
                </>
              )
            }
            <span className="!text-muted-foreground text-sm">
              {props.post.published
                ? dateFormat(props.post.publishedAt)
                : dateFormat(props.post.createdAt)}
            </span>
          </div>
          <div className="flex gap-1">
            {props.user == "true" &&
              props.session?.id === props.post.author?.id && (
                <Badge
                  variant={"outline"}
                  className="text-xs font-normal capitalize mr-1"
                >
                  {props.post.published === false ? "Draft" : "Published"}
                </Badge>
              )}
            {props.user == "true" && props.post.pinned && (
              <Icons.pin className="h-4 w-4 inline ml-auto text-muted-foreground align-middle" />
            )}
          </div>
        </CardHeader>
        <div className="flex">
          <div className="flex-initial w-full">
            <Link
              href={
                props.post.published === false
                  ? `/editor/${props.post.id}`
                  : `/@${!props.post.publication ? props.post.author.username : props.post.publication.username}/${props.post.url}`
              }
            >
              <div>
                <div className="pb-2">
                  <h2
                    className={`text-base md:text-xl font-bold text-ellipsis overflow-hidden ${props.user == "true" ? "line-clamp-2" : "line-clamp-3"
                      }`}
                  >
                    {props.post.title}
                  </h2>
                </div>
                <div className="post-subtitle hidden md:block">
                  <p
                    className={`text-ellipsis overflow-hidden line-clamp-3 text-muted-foreground`}
                  >
                    {props.post.subtitle}
                  </p>
                </div>
              </div>
            </Link>
            <div className="hidden pt-8 lg:block">
              <div className="flex justify-between items-center">
                <div className="flex flex-1 items-center space-x-2.5">
                  {props.post.tags?.length > 0 && (
                    <Link
                      href={`/tags/${props.post.tags[0].tag?.name}`}
                      key={props.post.tags[0].tag?.id}
                    >
                      <TagBadge variant={"secondary"} className="flex">
                        {props.post.tags[0].tag?.name.replace(/-/g, " ")}
                      </TagBadge>
                    </Link>
                  )}
                  <p className="card-text mb-0 py-0.5 text-muted-foreground text-xs">
                    {props.post.readingTime}
                  </p>
                </div>
                <div className="stats flex items-center justify-around gap-1">
                  {props.post.published &&
                    props.session?.id === props.post.authorId && (
                      <div className="flex items-center space-x-1">
                        <PostAnalyticsDialog post={props.post} />
                      </div>
                    )}
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
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
                        <Button variant="ghost" size={"icon"} className="">
                          <Icons.bookmark
                            className={`h-5 w-5`}
                          />
                          <span className="sr-only">Save</span>
                        </Button>
                      </LoginDialog>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <PostMoreActions post={props.post} session={props.session}>
                      <Button variant="ghost" size={"icon"} className="">
                        <MoreHorizontal className="h-5 w-5" />
                        <span className="sr-only">More</span>
                      </Button>
                    </PostMoreActions>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {props.post.cover && (
            <div className="flex-none ml-6 md:ml-8">
              <Link
                href={
                  props.post.published === false
                    ? `/editor/${props.post.id}`
                    : `/@${!props.post.publication ? props.post.author.username : props.post.publication.username}/${props.post.url}`
                }
              >
                <div
                  className={`h-14 md:h-28 !relative rounded-md bg-muted overflow-hidden !pb-0 ${props.user == "true" ? "aspect-[8/5]" : "aspect-[8/5]"
                    }`}
                >
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
                </div>
              </Link>
            </div>
          )}
        </div>
        <div className="pt-4 lg:hidden">
          <div className="flex justify-between items-center">
            <div className="flex flex-1 items-center space-x-2.5">
              {props.post.tags?.length > 0 && (
                <Link
                  href={`/tags/${props.post.tags[0].tag?.name}`}
                  key={props.post.tags[0].tag?.id}
                >
                  <TagBadge variant={"secondary"} className="flex">
                    {
                      //replace - with space
                      props.post.tags[0].tag?.name.replace(/-/g, " ")
                    }
                  </TagBadge>
                </Link>
              )}
              <p className="card-text mb-0 py-0.5 text-muted-foreground text-xs">
                {props.post.readingTime}
              </p>
            </div>
            <div className="stats flex items-center justify-around gap-1">
              {props.post.published &&
                props.session?.id === props.post.authorId && (
                  <div className="flex items-center space-x-1">
                    <PostAnalyticsDialog post={props.post} />
                  </div>
                )}
              <div className="flex items-center space-x-1 text-muted-foreground text-sm">
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
                    <Button variant="ghost" size={"icon"} className="">
                      <Icons.bookmark
                        className={`h-5 w-5`}
                      />
                    </Button>
                  </LoginDialog>
                )}
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground text-sm">
                <PostMoreActions post={props.post} session={props.session}>
                  <Button variant="ghost" size={"icon"} className="">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </PostMoreActions>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
