'use client';
import Image from "next/image";
import { Icons } from "../icon";
import Link from "next/link";
import { Button } from "../ui/button";
import LoginDialog from "../login-dialog";
import { validate } from "@/lib/revalidate";
import { useEffect, useState } from "react";
import ShareList from "./share";

export function UserCard({ user, session, className }: { user: any, session: any, className?: string }) {
     const [isFollowing, setIsFollowing] = useState<boolean | null>(user.Followers.find((follower: any) => follower.followerId === session?.id));
     const [isFollowingLoading, setIsFollowingLoading] = useState<boolean>(false);

     useEffect(() => {
          setIsFollowing(user.Followers.find((follower: any) => follower.followerId === session?.id));
     }, [user.Followers, session]);

     async function handleFollow(followeeId: string) {
          if (session) {
               setIsFollowingLoading(true);
               try {
                    setIsFollowing(!isFollowing);
                    const result = await fetch(`/api/follow?followeeId=${followeeId}&followerId=${session.id}`, {
                         method: "GET",
                    });
                    if (!result.ok) {
                         setIsFollowing(!isFollowing);
                    }
                    setIsFollowingLoading(false);
               } catch (error) {
                    console.error(error);
                    setIsFollowingLoading(false);
               }
               await validate(`/@${user?.username}`)
          }
     }
     return (
          <div className="flex justify-between w-full my-8">
               <Link href={`/@${user?.username}`} className="font-bold text-3xl flex items-center gap-1">
                         {user.name || user.username} {user?.verified && (
                              <Icons.verified className="h-5 lg:h-6 w-5 lg:w-6 inline fill-primary align-middle" />
                         )} {user?.falsemember && (
                              <Image src='/assets/falsemember.png' alt="False icon" height={30} width={30} className="h-5 lg:h-6 w-5 lg:w-6 inline rounded border align-middle" />
                         )}
                    </Link>
                    <div className="md:flex items-center gap-2 lg:hidden hidden">
                         {
                              session ? (
                                   session?.id !== user?.id && (
                                   <Button onClick={() => {
                                        handleFollow(user?.id);
                                   }} disabled={isFollowingLoading} >
                                        {
                                             isFollowingLoading ? (
                                                  <><Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> {isFollowing ? "Following" : "Follow"}</>
                                             ) : (
                                                  <>{isFollowing ? "Following" : "Follow"}</>
                                             )
                                        }
                                   </Button>
                                   )
                              ) : (
                                   <LoginDialog>
                                        <Button>Follow</Button>
                                   </LoginDialog>
                              )
                         }
                         <ShareList url={`${process.env.DOMAIN}/@${user?.username}`} text={`Check ${user.name || user.username}'s profile on @FalseNotesTeam`}>
                              <Button variant={"secondary"} className="px-2">
                                   <Icons.share className="w-6 h-6 text-muted-foreground" />
                              </Button>
                         </ShareList>
                    </div>
          </div>
     )
}