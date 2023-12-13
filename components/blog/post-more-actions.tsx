import { Post } from "@prisma/client";
import { Dialog } from "../ui/dialog";
import { Facebook, Link2, Linkedin, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
} from "next-share";
import { Icons } from "../icon";
import React from "react";
import { handleDelete } from "../delete";
import { useRouter } from "next/navigation";
import PostDeleteDialog from "./post-delete-dialog";
import { addShare } from "@/lib/prisma/add-share";
import { toast } from "sonner";
import PostPinDialog from "./post-pin-dialog";
import { unPin } from "@/lib/prisma/pin";
import { validate } from "@/lib/revalidate";
import { allowComments } from "@/lib/prisma/comments";
import { allowLikes } from "@/lib/prisma/likes";

export default function PostMoreActions({
  post,
  session,
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenu> & {
  post: any;
  session: any;
  className?: string;
}) {
  const copylink = async (link: string) => {
    navigator.clipboard.writeText(link);
    toast("Link copied to clipboard");
    await addShare(post?.id);
  };
  const router = useRouter();
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false);
  const [showPinAlert, setShowPinAlert] = React.useState<boolean>(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {session?.id === post?.authorId && (
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={`/editor/${post?.id}`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit post</span>
                </Link>
              </DropdownMenuItem>
              {post.pinned ? (
                <DropdownMenuItem
                  onSelect={async () => {
                    const res = await unPin(post?.id);
                    await validate(`/@${post.author.username}`);
                    if (res.status !== 200) {
                      toast.error("Something went wrong");
                    }
                  }}
                >
                  <Icons.pinOff className="mr-2 h-4 w-4" />
                  <span>Unpin post</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onSelect={() => setShowPinAlert(true)}>
                  <Icons.pin className="mr-2 h-4 w-4" />
                  <span>Pin to Top</span>
                </DropdownMenuItem>
              )}
              {post.allowComments ? (
                <DropdownMenuItem
                  onSelect={async () => {
                    const res = await allowComments(post?.id, false);
                    await validate(`/@${post.author.username}`);
                    if (res.status !== 200) {
                      toast.error("Something went wrong");
                    }
                  }}
                >
                  <Icons.commentOff className="mr-2 h-4 w-4" />
                  <span>Disable comments</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onSelect={async () => {
                    const res = await allowComments(post?.id, true);
                    await validate(`/@${post.author.username}`);
                    if (res.status !== 200) {
                      toast.error("Something went wrong");
                    }
                  }}
                >
                  <Icons.commentBubble className="mr-2 h-4 w-4" />
                  <span>Enable comments</span>
                </DropdownMenuItem>
              )}
              {post.allowLikes ? (
                <DropdownMenuItem
                  onSelect={async () => {
                    const res = await allowLikes(post?.id, false);
                    await validate(`/@${post.author.username}`);
                    if (res.status !== 200) {
                      toast.error("Something went wrong");
                    }
                  }}
                >
                  <Icons.likeOff className="mr-2 h-4 w-4" />
                  <span>Disable likes</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onSelect={async () => {
                    const res = await allowLikes(post?.id, true);
                    await validate(`/@${post.author.username}`);
                    if (res.status !== 200) {
                      toast.error("Something went wrong");
                    }
                  }}
                >
                  <Icons.like className="mr-2 h-4 w-4" />
                  <span>Enable likes</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="flex cursor-pointer items-center text-destructive focus:text-destructive"
                onSelect={() => setShowDeleteAlert(true)}
              >
                <Icons.delete className="mr-2 h-4 w-4" />
                <span>Delete post</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuGroup>
          )}
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() =>
                copylink(
                  `${process.env.DOMAIN}/@${post.author.username}/${post.url}`
                )
              }
            >
              <Icons.link className="mr-2 h-4 w-4" />
              <span>Copy link</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={async () => await addShare(post?.id)}>
              <TwitterShareButton
                url={`${process.env.DOMAIN}/@${post.author.username}/${post.url}`}
                title={post.title}
                via="FalseNotesTeam"
              >
                <div className="flex">
                  <Icons.twitter className="mr-2 h-4 w-4 fill-current stroke-none" />
                  <span>Share on Twitter</span>
                </div>
              </TwitterShareButton>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={async () => await addShare(post?.id)}>
              <FacebookShareButton
                url={`${process.env.DOMAIN}/@${post.author.username}/${post.url}`}
                quote={post.title}
              >
                <div className="flex">
                  <Facebook className="mr-2 h-4 w-4 fill-current stroke-none" />
                  <span>Share on Facebook</span>
                </div>
              </FacebookShareButton>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={async () => await addShare(post?.id)}>
              <LinkedinShareButton
                url={`${process.env.DOMAIN}/@${post.author.username}/${post.url}`}
              >
                <div className="flex">
                  <Linkedin className="mr-2 h-4 w-4 fill-current stroke-none" />
                  <span>Share on LinkedIn</span>
                </div>
              </LinkedinShareButton>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <PostDeleteDialog
        post={post}
        user={session}
        open={showDeleteAlert}
        onOpenChange={setShowDeleteAlert}
      />
      <PostPinDialog
        post={post}
        user={session}
        open={showPinAlert}
        onOpenChange={setShowPinAlert}
      />
    </>
  );
}
