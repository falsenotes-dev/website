import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { BlurImage as Image } from "../image";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import UserHoverCard from "../user-hover-card";
import { Icons } from "../icon";
import TagBadge from "../tags/tag";
import { dateFormat } from "@/lib/format-date";
import ShareList from "../share-list";
import { usePathname } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { shimmer, toBase64 } from "@/lib/image";
import { validate } from "@/lib/revalidate";
import PostAnalyticsDialog from "./post-analytics-dialog";
import ListPopover from "../list-popover";
import PostMoreActions from "./post-more-actions";
import LoginDialog from "../login-dialog";
import { formatNumberWithSuffix } from "../format-numbers";


export default function FeedPostCard(
  props: React.ComponentPropsWithoutRef<typeof Card> & {
    post: any;
    session: any;
    className?: string;
    list: any;
  }
) {
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

  const [isSubtitlesOpen, setIsSubtitlesOpen] = React.useState(false);

  return (
    <Card
      {...props}
      className={cn(
        "feedArticleCard hover:shadow-xl transition-all md:mb-14",
        props.className
      )}
    >
      <CardContent className="md:p-6 p-4 h-full">
        <div className="flex flex-col grid-cols-12 gap-4 items-start h-full">
          <div className="flex justify-between w-full items-center">
            <div className="flex items-center gap-1">
              <UserHoverCard user={props.post.author}>
                <Link
                  href={`/@${props.post.author?.username}`}
                  className="flex items-center space-x-0.5"
                >
                  <Avatar className="h-9 w-9 mr-0.5 border">
                    <AvatarImage
                      src={props.post.author?.image}
                      alt={props.post.author?.username}
                    />
                    <AvatarFallback>
                      {props.post.author?.name?.charAt(0) ||
                        props.post.author?.username?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </UserHoverCard>
              <div className="flex flex-col gap-0.5">
                <UserHoverCard user={props.post.author}>
                  <Link
                    href={`/@${props.post.author?.username}`}
                    className="flex items-center space-x-0.5"
                  >
                    <p className="text-sm font-normal leading-none">
                      {props.post.author?.name || props.post.author?.username}
                    </p>
                    {props.post.author?.verified && (
                      <Icons.verified className="h-4 w-4 inline fill-verified align-middle" />
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
            </div>
            <div className="flex gap-1 items-center">
              <span className="text-muted-foreground text-sm">{dateFormat(props.post.publishedAt)}</span>
              {/* <div className="flex items-center space-x-1 text-muted-foreground">
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
              </div> */}
            </div>
          </div>
          <div className="flex flex-col gap-2">
<Link href={`/@${!props.post.publication ? props.post.author.username : props.post.publication.username}/${props.post.url}`}>
                <h2 className="text-lg md:text-xl font-bold line-clamp-3">
              {props.post.title}
            </h2>
              </Link>
            
            {props.post.cover && (<div className="w-full">
              <Link href={`/@${!props.post.publication ? props.post.author.username : props.post.publication.username}/${props.post.url}`}>
                <>
                  <Image
                    src={props.post.cover}
                    width={1920}
                    height={1080}
                    alt={props.post.title}
                    placeholder={`data:image/svg+xml;base64,${toBase64(
                      shimmer(1920, 1080)
                    )}`}
                    className="object-cover max-w-full h-auto z-[1] rounded-md"
                  />
                  {/* <Skeleton className="w-full h-full rounded-md" /> */}
                </>
              </Link>
            </div>)}
          </div>
          <div className="col-span-12 flex flex-col justify-between space-y-6 h-full w-full">
            <div className="flex">
              <div className="flex-initial w-full">
                <div className="flex flex-col gap-2">

                  <div className="inline m-0">
                    <span className={`text-ellipsis inline text-base ${isSubtitlesOpen ? "line-clamp-none" : "line-clamp-3"}`}>
                      {
                        isSubtitlesOpen ? props.post.subtitle : props.post.subtitle?.length > 150 ? props.post.subtitle.substring(0, 150) + "..." : props.post.subtitle
                      }
                    </span>
                    {
                      props.post.subtitle?.length > 150 && (
                        <span>
                          <Button
                            variant="link"
                            className="text-muted-foreground text-base inline font-normal px-1 pr-0 h-fit"
                            size={"sm"}
                            onClick={() => setIsSubtitlesOpen(!isSubtitlesOpen)}
                          >
                            {isSubtitlesOpen ? "hide" : "more"}
                          </Button>
                        </span>
                      )
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center space-x-1.5 text-muted-foreground text-sm">
                  {
                    props.post.tags?.length > 0 && (
                      <>
                        <Link href={`/tags/${props.post.tags[0].tag?.name}`} key={props.post.tags[0].tag?.id}>
                          <TagBadge variant={"secondary"} className="flex font-medium">
                            {
                              props.post.tags[0].tag?.name.replace(/-/g, " ")
                            }
                          </TagBadge>
                        </Link>
                        <span>·</span>
                      </>
                    )
                  }
                  <span>{props.post.readingTime}</span>
                </div>
              </div>
            </div>
            <div className="">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-6 mx-auto justify-between px-4">
                  <div className="flex items-center space-x-1 flex-1 text-muted-foreground">
                    {props.session ? (
                      <Button
                        variant="ghost"
                        size={"icon"}
                        className="h-9 w-9 text-muted-foreground"
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
                          className="h-9 w-9 text-muted-foreground"
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
                  <div className="flex items-center space-x-1 flex-1 text-muted-foreground">
                    <Link
                      href={`/@${!props.post.publication ? props.post.author.username : props.post.publication.username}/${props.post.url}?commentsOpen=true`}
                    >
                      <Button
                        variant="ghost"
                        size={"icon"}
                        className="h-9 w-9 text-muted-foreground"
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
                  <div className="flex items-center space-x-1 flex-1 text-muted-foreground">
                    {props.session ? (
                      <>
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
                        <span className="text-sm">
                          {formatNumberWithSuffix(props.post._count.savedUsers + props.post._count.lists)}
                        </span>
                      </>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

