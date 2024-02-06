"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import UserHoverCard from "../user-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MoreHorizontal } from "lucide-react";
import LoginDialog from "../login-dialog";
import { BlurImage as Image } from "../image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import TagBadge from "../tags/tag";
import PostTabs from "./navbar";
import { dateFormat } from "@/lib/format-date";
import { usePathname, useRouter } from "next/navigation";
import { Icons } from "../icon";
import CommentsSheet from "./comments/comments-sheet";
import MobilePostTabs from "./mobile-navbar";
import PostMoreActions from "./post-more-actions";
import PublishDialog from "./publish-dialog";
import MarkdownCard from "../markdown-card";
import { validate } from "@/lib/revalidate";
import { remark } from 'remark'
import html from 'remark-html'
import { shimmer } from "@/lib/image";

export default function SinglePost({
  post: initialPost,
  author,
  sessionUser,
  tags,
  comments,
  published,
  list,
}: {
  post: any;
  author: any;
  sessionUser: any;
  tags: any;
  comments: boolean | undefined;
  published: boolean | undefined;
  list: any;
}) {
  const [isFollowing, setIsFollowing] = useState<boolean>(
    author.Followers?.some(
      (follower: any) => follower.followerId === sessionUser?.id
    )
  );
  const [isFollowingLoading, setIsFollowingLoading] = useState<boolean>(false);
  const { status } = useSession();
  const [session, setSession] = useState<any>(sessionUser);
  const [post, setPost] = useState<any>(initialPost);
  const [openComments, setOpenComments] = useState<boolean>(comments || false);
  const [openPublishDialog, setOpenPublishDialog] = useState<boolean>(
    typeof published === "undefined" ? false : published
  );

  useEffect(() => {
    setPost(initialPost);
  }, [initialPost]);

  useEffect(() => {
    setSession(sessionUser);
  }, [sessionUser]);

  useEffect(() => {
    setIsFollowing(
      author.Followers?.some(
        (follower: any) => follower.followerId === sessionUser?.id
      )
    );
  }, [author, sessionUser]);

  const router = useRouter();
  const pathname = usePathname();

  async function handleFollow(followeeId: string) {
    if (status === "authenticated") {
      setIsFollowingLoading(true);
      try {
        setIsFollowing(!isFollowing);
        const followerId = session.id;
        const result = await fetch(
          `/api/follow?followeeId=${followeeId}&followerId=${followerId}`,
          {
            method: "GET",
          }
        ).then((res) => res.json());
        if (!result.ok) {
          setIsFollowing(!isFollowing);
        }
        await validate(pathname);
        setIsFollowingLoading(false);
      } catch (error) {
        console.error(error);
        setIsFollowingLoading(false);
      }
    }
  }
  if (openPublishDialog === false && published === true) {
    router.replace(`/@${post.publicationId ? post.publication.username : post.author.username}/${post?.url}`);
  }

  //find first image in the content using remark
  //if first image in the content is equal to the cover image, then don't show it
  const processor = remark().use(() => {
    return (tree: any) => {
      for (const node of tree.children) {
        if (node.type === "image") {
          return node;
        } else {
          for (const child of node.children) {
            if (child.type === "image") {
              return child;
            }
          }
        }
      }
    };
  });
  const firstImage = processor.processSync(post?.content).toString();
  //firstImage is markdown image tag with src and alt, extract src from it
  const firstImageSrc = firstImage.match(/!\[.*\]\((.*)\)/)?.[1] || "";

  const [isFirstImageCover, setIsFirstImageCover] = useState<boolean>(false);
  useEffect(() => {
    if (post?.cover && firstImageSrc) {
      setIsFirstImageCover(post?.cover === firstImageSrc);
    }
  }, [firstImageSrc, post?.cover]);
  return (
    <>
      <PublishDialog
        post={post}
        user={post.author}
        open={openPublishDialog}
        onOpenChange={setOpenPublishDialog}
        session={session}
      />
      <div className="article max-w-[650px] lg:max-w-[680px] mx-auto">
        <div className="article__container space-y-6">
          <div className="article__header lg:text-xl">
            {
              //if first image of content is equal to the cover image, then don't show it
              //find the first image in the content and compare it with the cover image
              post?.cover && !isFirstImageCover && (
                <div className="article__cover-image">
                  <Image
                    src={post?.cover}
                    alt={post?.title}
                    layout="responsive"
                    width={1000}
                    height={500}
                    className="rounded-md"
                    placeholder="blur"
                    blurDataURL={shimmer(1000, 500)}
                    priority={true}
                  />
                </div>
              )
            }
            <h1 className="article__title">{post?.title}</h1>
            <div className="article__meta border-y py-2">
              <div className="flex items-baseline">
                <UserHoverCard user={author}>
                  <Link href={`/@${author?.username}`}>
                    <Avatar className="article__author-avatar border h-11 w-11">
                      <AvatarImage src={author?.image} alt={author?.username} />
                      <AvatarFallback>
                        {author?.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </UserHoverCard>
                {
                  post?.publicationId && (
                    <UserHoverCard user={post.publication} className="-ml-3">
                      <Link href={`/@${post.publication?.username}`}>
                        <Avatar className="article__author-avatar border-2 !border-background h-6 w-6">
                          <AvatarImage src={post.publication?.image} alt={post.publication?.username} />
                          <AvatarFallback>
                            {post.publication?.username.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                    </UserHoverCard>
                  )
                }
              </div>

              <div className="flex flex-col">
                <span className="article__author-name md:text-base text-sm">
                  <UserHoverCard user={author}>
                    <Link
                      href={`/@${author?.username}`}
                      className="inline-flex items-center"
                    >
                      {author?.name || author?.username}
                      {author?.verified && (
                        <Icons.verified className="h-4 w-4 mx-1 inline fill-verified align-middle" />
                      )}
                    </Link>
                  </UserHoverCard>

                  {session?.id !== post?.authorId &&
                    (status === "authenticated" ? (
                      <Button
                        variant="link"
                        className="py-0 h-6 px-1 text-foreground"
                        onClick={() => handleFollow(post?.authorId)}
                        disabled={isFollowingLoading}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                    ) : (
                      <LoginDialog className="py-0 h-6 px-0">
                        <Button
                          variant="link"
                          className="py-0 h-6 px-1 text-foreground"
                        >
                          Follow
                        </Button>
                      </LoginDialog>
                    ))}
                </span>
                <div className="article__date">
                  {
                    post.publicationId && (
                      <>
                        Published in{" "}
                        <Link href={`/@${post.publication.username}`} className="text-foreground">
                          {post?.publication?.name || post?.publication?.username}
                        </Link>
                        <span className="mx-1">·</span>
                      </>
                    )
                  }
                  <span className="">{post?.readingTime}</span>
                  <span className=" mx-1">·</span>
                  <span className="">{dateFormat(post?.publishedAt)}</span>
                  {post?.updated && (
                    <>
                      <span className=" mx-1">·</span>
                      <span className="">
                        Updated {dateFormat(post?.modifiedAt)}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <PostMoreActions post={post} session={session}>
                <Button
                  className="h-10 w-10 mr-0.5 ml-auto flex md:hidden"
                  size={"icon"}
                  variant={"outline"}
                >
                  <MoreHorizontal className="w-5 h-5" strokeWidth={1.75} />
                </Button>
              </PostMoreActions>
            </div>
          </div>

          <MarkdownCard code={post?.content} />

          {tags && (
            <>
              <div className="article__tags mx-auto">
                {tags.map((tag: any) => (
                  <Link href={`/tags/${tag.tag.name}`} key={tag.tag.id}>
                    <TagBadge className="my-1.5 mr-1.5" variant={"secondary"}>
                      {tag.tag.name.replace(/-/g, " ")}
                    </TagBadge>
                  </Link>
                ))}
              </div>
            </>
          )}
          <PostTabs
            post={post}
            session={session}
            author={author}
            onClicked={() => setOpenComments(!openComments)}
            list={list}
          />
          <MobilePostTabs
            post={post}
            session={session}
            author={author}
            className="mt-8"
            onClicked={() => setOpenComments(!openComments)}
            list={list}
          />
        </div>
      </div>
      <CommentsSheet
        post={post}
        comments={post?.comments}
        session={session}
        open={openComments}
        onOpenChange={setOpenComments}
      />
    </>
  );
}
