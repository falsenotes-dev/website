"use client";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  ShareIcon,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import CommentsSheet from "./comments/comments-sheet";
import ShareList from "../share-list";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import PostDeleteDialog from "./post-delete-dialog";
import LoginDialog from "../login-dialog";
import { Separator } from "../ui/separator";
import { validate } from "@/lib/revalidate";
import { Post } from "@prisma/client";
import { Icons } from "../icon";
import PostAnalyticsDialog from "./post-analytics-dialog";
import ListPopover from "../list-popover";

export default function MobilePostTabs({
  post: initialPost,
  className,
  session,
  author,
  onClicked,
  list,
}: {
  post: any;
  className?: string;
  session: any;
  author: any;
  onClicked: () => void;
  list: any;
}) {
  const [post, setPost] = useState<any>(initialPost);
  useEffect(() => {
    setPost(initialPost);
  }, [initialPost]);
  const pathname = usePathname();
  const like = async (postId: Post["id"]) => {
    await fetch(`/api/post/${postId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId }),
    });
    await validate(pathname);
  };
  const save = async (postId: Post["id"]) => {
    await fetch(`/api/post/${postId}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId }),
    });
    await validate(pathname);
  };
  const isLiked = post?.likes?.some(
    (like: any) => like.authorId === session?.id
  );
  const [isSaved, setIsSaved] = useState<boolean>(false);
  useEffect(() => {
    const checkIsSaved = list.lists?.some((list: any) => list.posts?.some((p: any) => p.postId === post.id)) || list.bookmarks?.some((bookmark: any) => bookmark.postId === post.id);
    setIsSaved(checkIsSaved);
  }, [list.lists, list.bookmarks, post.id]);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  return (
    <>
      <div
        className={cn(
          "py-2 border-t shadow-2xl flex md:hidden mx-auto w-full left-0 fixed bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 z-50",
          className
        )}
      >
        <div className="flex items-center justify-between w-full gap-4 px-4">
          <div className="flex items-center justify-center flex-1">
            {session ? (
              <Button
                className="h-10 w-10 mr-0.5 rounded-full hover:!bg-primary hover:text-primary-foreground"
                size={"icon"}
                variant={"ghost"}
                onClick={() => like(post.id)}
                disabled={
                  session?.id == post.authorId ||
                  (post.allowLikes == null ? false : !post.allowLikes) ||
                  (session?.id == post.publicationId)
                }
              >
                <Icons.like
                  className={`w-6 h-6 ${isLiked && "fill-current"}`}
                />
                <span className="sr-only">Like</span>
              </Button>
            ) : (
              <LoginDialog>
                <Button
                  className="h-10 w-10 mr-0.5 rounded-full hover:!bg-primary hover:text-primary-foreground"
                  size={"icon"}
                  variant={"ghost"}
                >
                  <Icons.like className="w-6 h-6" />
                  <span className="sr-only">Like</span>
                </Button>
              </LoginDialog>
            )}
            {post.allowLikes && (
              <span className="text-sm">{post?._count.likes}</span>
            )}
          </div>
          <Separator orientation="vertical" />
          <div className="flex items-center justify-center flex-1">
            <Button
              className="h-10 w-10 mr-0.5 rounded-full hover:!bg-primary hover:text-primary-foreground"
              size={"icon"}
              variant={"ghost"}
              onClick={onClicked}
              disabled={
                post.allowComments == null ? false : !post.allowComments
              }
            >
              <Icons.commentBubble className="w-6 h-6" />
              <span className="sr-only">Comment</span>
            </Button>
            {post.allowComments && (
              <span className="text-sm">{post?._count.comments}</span>
            )}
          </div>
          <Separator orientation="vertical" />
          <div className="flex items-center justify-center flex-1">
            {session ? (
              <ListPopover lists={list.lists} session={session} postId={post.id} bookmarks={list.bookmarks} >
                <Button
                  className="h-10 w-10 mr-0.5 rounded-full hover:!bg-primary hover:text-primary-foreground"
                  size={"icon"}
                  variant={"ghost"}
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
                  className="h-10 w-10 mr-0.5 rounded-full hover:!bg-primary hover:text-primary-foreground"
                  size={"icon"}
                  variant={"ghost"}
                >
                  <Icons.bookmark className="w-5 h-5" />
                  <span className="sr-only">Save</span>
                </Button>
              </LoginDialog>
            )}
          </div>
          {session && (session?.id === post.authorId || session?.id === post.publication?.id) && (
            <>
              <Separator orientation="vertical" />
              <PostAnalyticsDialog
                post={post}
                className="rounded-full hover:!bg-primary hover:text-primary-foreground text-background-foreground"
              />
            </>
          )}
        </div>
      </div>
      <PostDeleteDialog
        post={post}
        user={session}
        open={showDeleteAlert}
        onOpenChange={setShowDeleteAlert}
      />
    </>
  );
}
