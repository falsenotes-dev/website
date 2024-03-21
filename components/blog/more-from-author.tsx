"use client"
import { formatNumberWithSuffix } from "../format-numbers";
import { AvatarFallback, AvatarImage, Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useSession } from "next-auth/react";
import LoginDialog from "../login-dialog";
import { useEffect, useState } from "react";
import TagPostCard from "../tags/post-card";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icons } from "../icon";
import { validate } from "@/lib/revalidate";
import UserHoverCard from "../user-hover-card";

export default function MoreFromAuthor({ author: initialAuthor, post: initialPost, sessionUser, list, publication }: { author: any, post: any, sessionUser: any, list: any, publication?: any }) {
     const { status } = useSession();

     const [author, setAuthor] = useState(initialAuthor);
     const [post, setPost] = useState(initialPost);
     useEffect(() => {
          setPost(initialPost);
     }, [initialPost])
     useEffect(() => {
          setAuthor(initialAuthor);
     }, [initialAuthor])
     const [isFollowing, setIsFollowing] = useState<boolean | null>(author?.Followers?.some((follower: any) => follower.followerId === sessionUser?.id) || false);
     useEffect(() => {
          setIsFollowing(author?.Followers?.some((follower: any) => follower.followerId === sessionUser?.id) || false);
     }, [author, sessionUser])
     const [isFollowingLoading, setIsFollowingLoading] = useState<boolean>(false);
     const path = usePathname();
     const router = useRouter();
     async function handleFollow(followeeId: string) {
          if (status === "authenticated") {
               setIsFollowingLoading(true);
               try {
                    setIsFollowing(!isFollowing);
                    const followerId = sessionUser.id;
                    const result = await fetch(`/api/follow?followeeId=${followeeId}&followerId=${followerId}`, {
                         method: "GET",
                    }).then((res) => res.json());
                    if (!result.ok) {
                         setIsFollowing(!isFollowing);
                    }
                    await validate(path)
                    setIsFollowingLoading(false);
               } catch (error) {
                    console.error(error);
                    setIsFollowingLoading(false);
               }
          }
     }
     return (
          <>
               <div className="max-w-[680px] lg:text-xl mx-auto">
                    <div className="author__details flex flex-col gap-y-4">
                         <div className="mx-2 md:mx-6">
                              <div className="flex justify-between items-end mb-4">
                                   <div className="flex items-baseline">
                                        <UserHoverCard user={author}>
                                             <Link href={`/@${author?.username}`}>
                                                  <Avatar className="article__author-avatar border h-20 w-20">
                                                       <AvatarImage src={author?.image} alt={author?.username} />
                                                       <AvatarFallback>
                                                            {author?.username.charAt(0)}
                                                       </AvatarFallback>
                                                  </Avatar>
                                             </Link>
                                        </UserHoverCard>
                                        {
                                             publication && (
                                                  <UserHoverCard user={publication} className="-ml-4">
                                                       <Link href={`/@${publication.username}`}>
                                                            <Avatar className="article__author-avatar border-2 !border-background h-9 w-9">
                                                                 <AvatarImage src={publication.image} alt={publication.username} />
                                                                 <AvatarFallback>
                                                                      {publication.username.charAt(0)}
                                                                 </AvatarFallback>
                                                            </Avatar>
                                                       </Link>
                                                  </UserHoverCard>
                                             )
                                        }
                                   </div>
                                   <div className="flex md:hidden">
                                        {sessionUser?.id !== author?.id && (
                                             status === "authenticated" ? (
                                                  <Button size={'lg'} onClick={() => handleFollow(author.id)} variant={isFollowing ? 'outline' : 'default'} disabled={isFollowingLoading}>{isFollowing ? "Following" : "Follow"}</Button>
                                             ) : (
                                                  <LoginDialog>
                                                       <Button size={'lg'} >Follow</Button>
                                                  </LoginDialog>
                                             ))
                                        }
                                   </div>
                              </div>
                              <div className="flex justify-between">
                                   <div className="gap-y-2">
                                        <div className="flex">
                                             <Link href={`/@${author?.username}`} className="flex items-center">
                                                  <h2 className="text-2xl font-medium">
                                                       Written by {author?.name || author?.username} {author?.verified &&
                                                            (
                                                                 <Icons.verified className="h-5 w-5 inline fill-verified align-middle" />
                                                            )}
                                                  </h2>
                                             </Link>

                                        </div>
                                        <div className="text-sm font-normal mt-2">
                                             <span className="text-muted-foreground">{formatNumberWithSuffix(author?._count.Followers || 0)} Followers</span>
                                             {
                                                  publication && (
                                                       <><span className="text-muted-foreground"> • Written for</span> {publication.name || publication.username}</>
                                                  )
                                             }
                                        </div>
                                        {author?.bio && (<div className="text-sm font-normal mt-4">{author?.bio}</div>)}
                                   </div>
                                   <div className="hidden md:flex">
                                        {sessionUser?.id !== author?.id && (
                                             status === "authenticated" ? (
                                                  <Button size={'lg'} onClick={() => handleFollow(author.id)} variant={isFollowing ? 'outline' : 'default'} disabled={isFollowingLoading}>{isFollowing ? "Following" : "Follow"}</Button>
                                             ) : (
                                                  <LoginDialog>
                                                       <Button size={'lg'} >Follow</Button>
                                                  </LoginDialog>
                                             ))
                                        }
                                   </div>
                              </div>
                         </div>
                    </div>
                    {
                         post?.length > 0 && (
                              <>
                                   <Separator className="my-10" />
                                   <div className="text-base font-medium mb-8 mx-2 md:mx-6">More From {author?.name || author?.username}</div>
                                   <div className="grid md:grid-cols-2 gap-4">
                                        {
                                             post.map((p: any) => (
                                                  <TagPostCard key={p.id} post={p} session={sessionUser} list={list} />
                                             ))
                                        }
                                   </div>
                                   <Separator className="mb-6" />
                                   <div className="flex gap-2">
                                        <Button variant={"outline"} className="w-full md:w-max" size={"lg"} asChild>
                                             <Link href={`/@${author?.username}`}>
                                                  See all from {author?.name || author?.username}
                                             </Link>
                                        </Button>
                                        {
                                             publication && (
                                                  <Button variant={"outline"} className="w-full md:w-max" size={"lg"} asChild>
                                                       <Link href={`/@${publication?.username}`}>
                                                            See all from {publication?.name || publication?.username}
                                                       </Link>
                                                  </Button>
                                             )
                                        }
                                   </div>
                              </>
                         )
                    }
               </div>
          </>
     )
}