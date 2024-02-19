'use client';
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { shimmer, toBase64 } from "@/lib/image";
import { Skeleton } from "../ui/skeleton";
import { Icons } from "../icon";
import UserHoverCard from "../user-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { dateFormat } from "@/lib/format-date";
import { Button } from "../ui/button";
import React from "react";
import { validate } from "@/lib/revalidate";
import { usePathname } from "next/navigation";
import LoginDialog from "../login-dialog";
import { formatNumberWithSuffix } from "../format-numbers";
import PostAnalyticsDialog from "./post-analytics-dialog";
import ListPopover from "../list-popover";
import PostMoreActions from "./post-more-actions";

export default function PostCard({ post, author, session, isPinned, isFirst, className, list, ...props }: { post: any; session: any; author: any; isPinned?: boolean; isFirst?: boolean; list: any } & React.ComponentPropsWithoutRef<typeof Card>) {
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
     const isLiked = post?.likes?.some(
          (like: any) => like.authorId === session?.id
     );
     const [isSaved, setIsSaved] = React.useState(false);
     React.useEffect(() => {
          const checkIsSaved =
               list?.lists?.some((list: any) =>
                    list.posts?.some((post: any) => post.postId === post.id)
               ) ||
               list?.bookmarks?.some(
                    (bookmark: any) => bookmark.postId === post.id
               );
          setIsSaved(checkIsSaved);
     }, [list?.lists, list?.bookmarks, post.id]);
     return (
          <Card
               {...props}
               className={cn(
                    "rounded-lg feedArticleCard bg-transparent border-none shadow-none",
                    className
               )}
          >
               <CardContent className="p-0 h-full">
                    <div className="flex flex-col grid-cols-12 gap-y-8 items-start h-full">
                         <div className="w-full">
                              <Link href={`/@${!post.publication ? author.username : post.publication.username}/${post.url}`}>
                                   <div className="w-full h-auto bg-muted rounded-md !relative !pb-0 aspect-[2/1] overflow-hidden">
                                        {post.cover ? (
                                             <>
                                                  <Image
                                                       src={post.cover}
                                                       fill
                                                       alt={post.title}
                                                       placeholder={`data:image/svg+xml;base64,${toBase64(
                                                            shimmer(1920, 1080)
                                                       )}`}
                                                       className="object-cover max-w-full h-auto z-[1] hover:opacity-90 transition-all rounded-md"
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
                              {
                                   isPinned && (
                                        <div className="flex items-center space-x-1.5 text-muted-foreground text-sm">
                                             <Icons.pin className="w-4 h-4" />
                                             <span className="text-muted-foreground text-sm">Pinned</span>
                                        </div>
                                   )
                              }
                              <div className="flex">
                                   <div className="flex-initial w-full">
                                        <Link
                                             href={`/@${!post.publication ? post.author.username : post.publication.username}/${post.url}`}
                                        >
                                             <div>
                                                  <div className="pb-2">
                                                       <h2 className="text-base md:text-xl font-bold text-ellipsis overflow-hidden post__title custom">
                                                            {post.title}
                                                       </h2>
                                                  </div>
                                                  {
                                                       isFirst && (
                                                            <div className="post-subtitle hidden md:block">
                                                                 <p className="text-ellipsis text-base overflow-hidden post__subtitle text-muted-foreground">
                                                                      {post.subtitle}
                                                                 </p>
                                                            </div>
                                                       )
                                                  }
                                             </div>
                                        </Link>
                                   </div>
                              </div>
                              <div className="">
                                   <div className="flex justify-between items-center">
                                        <div className="flex flex-1 items-center space-x-1.5 text-muted-foreground text-sm">
                                             <span>{post.readingTime}</span>
                                             <span>·</span>
                                             <span>{dateFormat(post.publishedAt)}</span>
                                        </div>
                                   </div>
                              </div>
                              <div className="">
                                   <div className="flex justify-between items-center">
                                        <div className="flex flex-1 items-center space-x-2.5">
                                             <div className="flex items-center space-x-1 text-muted-foreground">
                                                  {session ? (
                                                       <Button
                                                            variant="ghost"
                                                            size={"icon"}
                                                            className="h-8 w-8 text-muted-foreground"
                                                            onClick={() => like(post.id)}
                                                            disabled={
                                                                 session.id === post.author.id ||
                                                                 (post.allowLikes == null
                                                                      ? false
                                                                      : !post.allowLikes)
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
                                                  {post.allowLikes && (
                                                       <span className="text-sm">
                                                            {formatNumberWithSuffix(post._count.likes)}
                                                       </span>
                                                  )}
                                             </div>
                                             <div className="flex items-center space-x-1 text-muted-foreground">
                                                  <Link
                                                       href={`/@${!post.publication ? post.author.username : post.publication.username}/${post.url}?commentsOpen=true`}
                                                  >
                                                       <Button
                                                            variant="ghost"
                                                            size={"icon"}
                                                            className="h-8 w-8 text-muted-foreground"
                                                            disabled={
                                                                 post.allowComments == null
                                                                      ? false
                                                                      : !post.allowComments
                                                            }
                                                       >
                                                            <Icons.commentBubble className="w-5 h-5" />
                                                            <span className="sr-only">Comment</span>
                                                       </Button>
                                                  </Link>
                                                  {post.allowComments && (
                                                       <span className="text-sm">
                                                            {formatNumberWithSuffix(post._count.comments)}
                                                       </span>
                                                  )}
                                             </div>
                                        </div>
                                        <div className="flex items-center justify-around gap-2">
                                             {post.published &&
                                                  (session?.id === post.authorId || session?.id === post.publicationId) && (
                                                       <div className="flex items-center space-x-1">
                                                            <PostAnalyticsDialog post={post} />
                                                       </div>
                                                  )}
                                             <div className="flex items-center space-x-1 text-muted-foreground">
                                                  {session ? (
                                                       <ListPopover
                                                            lists={list.lists}
                                                            session={session}
                                                            postId={post.id}
                                                            bookmarks={list.bookmarks}
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
                                                  <PostMoreActions post={post} session={session}>
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
     )
}