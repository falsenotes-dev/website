'use client'

import Image from "next/image";
import { Icons } from "../icon";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { formatNumberWithSuffix } from "../format-numbers";
import { getRegistrationDateDisplay } from "./about";
import Link from "next/link";
import { Button } from "../ui/button";
import ShareList from "./share";
import LoginDialog from "../login-dialog";
import { useEffect, useState } from "react";
import { validate } from "@/lib/revalidate";

export default function Header({ user, session, followers }: { user: any; session: any; followers: any; }) {
     const [isFollowing, setIsFollowing] = useState<boolean | null>(
          followers.find((follower: any) => follower.followerId === session?.id)
     );
     const [isFollowingLoading, setIsFollowingLoading] = useState<boolean>(false);

     useEffect(() => {
          setIsFollowing(
               followers.find((follower: any) => follower.followerId === session?.id)
          );
     }, [followers, session]);

     const [followersCount, setFollowersCount] = useState<number>(user._count.Followers);

     async function handleFollow(followeeId: string) {
          if (session) {
               setIsFollowingLoading(true);
               try {
                    setIsFollowing(!isFollowing);
                    const result = await fetch(
                         `/api/follow?followeeId=${followeeId}&followerId=${session.id}`,
                         {
                              method: "GET",
                         }
                    );
                    if (!result.ok) {
                         setIsFollowing(!isFollowing);
                    }
                    setIsFollowingLoading(false);
                    setIsFollowing(!isFollowing);
                    setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
               } catch (error) {
                    console.error(error);
                    setIsFollowingLoading(false);
               }
          }
     }

     const [isAdmin, setIsAdmin] = useState<boolean>(false);

     useEffect(() => {
          // if session publications includes user id and it is has admin accessLevel then set isAdmin to true
          setIsAdmin(
               session?.publications?.some(
                    (publication: any) =>
                         publication.publicationId === user.id &&
                         publication.accessLevel === "admin"
               )
          );
     }, [isAdmin, session?.publications, user.id]);

     return (
          <div className="relative flex-[0_0_auto] h-[424px] max-w-[1140px] min-w-[280px] w-full overflow-visible">
               {
                    <div className="rounded-3xl xl:bottom-[174px] bottom-[212px] bg-secondary≈ lg:bottom-0 lg:h-[59%] flex-[0_0_auto] left-0 overflow-visible absolute top-0 w-full">
                         <div className="absolute inset-0">
                              {
                                   user.cover ? (
                                        <Image
                                             src={user?.cover}
                                             alt={`${user?.name || user?.username} cover`}
                                             layout="fill"
                                             objectFit="cover"
                                             className="rounded-3xl"
                                        />
                                   ) : (
                                        <Icons.noThumbnail className="w-full object-cover h-full rounded-3xl bg-secondary" />
                                   )
                              }
                         </div>
                         <div className="flex items-center gap-1 absolute top-3 right-4">
                              {session ? (
                                   session?.id === user?.id ? (
                                        <Button variant={'secondary'} size={'sm'} className="!bg-secondary/60 backdrop-blur hover:!bg-secondary px-4 rounded-full" asChild>
                                             <Link href={`/@${user.username}/settings/profile`}>
                                                  Edit Profile
                                             </Link>
                                        </Button>
                                   ) : (
                                        <>
                                             {isAdmin && (
                                                  <Button variant={'secondary'} className="!bg-secondary/60 backdrop-blur hover:!bg-secondary px-4 rounded-full" size={'sm'} asChild>
                                                       <Link href={`/@${user.username}/settings/profile`}>Edit Profile</Link>
                                                  </Button>
                                             )}
                                             <Button
                                                  className={`${isFollowing ? '!bg-secondary/60 hover:!bg-secondary' : '!bg-primary/60 hover:!bg-primary'} backdrop-blur px-4 rounded-full`}
                                                  variant={isFollowing ? 'secondary' : 'default'}
                                                  onClick={() => {
                                                       handleFollow(user?.id);
                                                  }}
                                                  size={'sm'}
                                                  disabled={isFollowingLoading}
                                             >
                                                  {isFollowingLoading ? (
                                                       <>
                                                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />{" "}
                                                            {isFollowing ? "Following" : "Follow"}
                                                       </>
                                                  ) : (
                                                       <>{isFollowing ? "Following" : "Follow"}</>
                                                  )}
                                             </Button>
                                        </>
                                   )
                              ) : (
                                   <LoginDialog>
                                        <Button className="px-4 rounded-full" variant={'default'} size={'sm'}>Follow</Button>
                                   </LoginDialog>
                              )}
                              <ShareList
                                   url={`${process.env.DOMAIN}/@${user?.username}`}
                                   text={`Check ${user.name || user.username
                                        }'s profile on @FalseNotesTeam`}
                              >
                                   <Button variant={"secondary"} className="px-2 h-8 w-8 !bg-secondary/60 backdrop-blur hover:!bg-secondary rounded-full">
                                        <Icons.share className="w-5 h-5" />
                                   </Button>
                              </ShareList>
                         </div>
                    </div>
               }
               <div className="flex flex-col justify-center items-center lg:items-start bottom-0 gap-4 lg:gap-3 left-1/2 h-min max-w-5xl min-w-[280px] absolute overflow-hidden w-[92%] lg:w-[94%] -translate-x-1/2">
                    <Avatar className="h-28 w-28 !border-background border-4">
                         <AvatarImage src={user?.image!} />
                         <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex lg:justify-between justify-center w-full gap-2">
                         <div className="flex flex-col items-center lg:items-start">
                              <div className="flex items-center gap-1.5"><h1 className="text-3xl lg:text-4xl font-extrabold line-clamp-1">{user.name || user.username}</h1>
                                   {
                                        user.verified && (
                                             <TooltipProvider>
                                                  <Tooltip>
                                                       <TooltipTrigger><Icons.verified className="h-6 lg:h-7 w-6 lg:w-7 text-muted-foreground fill-verified" /></TooltipTrigger>
                                                       <TooltipContent>Verified Author</TooltipContent>
                                                  </Tooltip>
                                             </TooltipProvider>
                                        )
                                   }
                                   {
                                        user.falsemember && (
                                             <TooltipProvider>
                                                  <Tooltip>
                                                       <TooltipTrigger><Image src="/assets/falsemember.png" alt="False Member" width={28} height={28} className="h-6 lg:h-7 w-6 lg:w-7" /></TooltipTrigger>
                                                       <TooltipContent>The False Staff</TooltipContent>
                                                  </Tooltip>
                                             </TooltipProvider>
                                        )
                                   }
                              </div>
                              <div className="items-center justify-center lg:justify-start flex gap-2 w-full">
                                   <div className="inline-flex items-center justify-center font-medium transition-colors h-8 rounded-md text-sm">
                                        {formatNumberWithSuffix(followersCount)}{" "}
                                        <span className="text-muted-foreground ml-2">Followers</span>
                                   </div>
                                   <div className="inline-flex items-center justify-center font-medium transition-colors h-8 rounded-md text-sm">
                                        {formatNumberWithSuffix(user._count.posts + user._count.publicationsPosts)}{" "}
                                        <span className="text-muted-foreground ml-2">Posts</span>
                                   </div>
                              </div>
                         </div>
                    </div>
                    <div className="flex justify-center lg:justify-between items-center w-full flex-col lg:flex-row gap-2">
                         <div className="flex gap-3 h-4 text-sm relative text-muted-foreground items-center">
                              {
                                   user.location && (
                                        <div className="flex items-center gap-1">
                                             <Icons.location className="h-4 w-4" />
                                             {user.location}
                                        </div>
                                   )
                              }
                              <div className="flex items-center gap-1">
                                   <Icons.calendarDays className="h-4 w-4" />
                                   Joined {getRegistrationDateDisplay(user.createdAt.toISOString())}
                              </div>
                         </div>
                         <div className="flex gap-4 items-center">
                              {/* user social links */}
                              <div className="flex gap-4 items-center">
                                   {
                                        user.urls && user.urls.length > 0 && (
                                             user.urls.map((url: any) => (
                                                  <>
                                                       <Button variant={"link"} size={"sm"} asChild className="p-0 text-foreground" key={url.id}>
                                                            <Link href={url.value} target="_blank" className="flex items-center font-light !text-sm">
                                                                 {
                                                                      //if url.value contains github.com then show github icon if not then show link icon
                                                                      url.value.includes("github.com") ? (
                                                                           <>
                                                                                <Icons.gitHub className="h-5 w-5 text-muted-foreground" />
                                                                           </>
                                                                      ) : url.value.includes("twitter.com") ? (
                                                                           <>
                                                                                <Icons.twitter className="h-5 w-5 text-muted-foreground" />
                                                                           </>
                                                                      ) : url.value.includes("facebook.com") ? (
                                                                           <>
                                                                                <Icons.facebook className="h-5 w-5 text-muted-foreground" />
                                                                           </>
                                                                      ) : url.value.includes("fb.com") ? (
                                                                           <>
                                                                                <Icons.facebook className="h-5 w-5 text-muted-foreground" />
                                                                           </>
                                                                      ) : url.value.includes("instagram.com") ? (
                                                                           <>
                                                                                <Icons.instagram className="h-5 w-5 text-muted-foreground" />
                                                                           </>
                                                                      ) : url.value.includes("linkedin.com") ? (
                                                                           <>
                                                                                <Icons.linkedIn className="h-5 w-5 text-muted-foreground" />
                                                                           </>
                                                                      ) : url.value.includes('youtube.com') ? (
                                                                           <>
                                                                                <Icons.youtube className="h-5 w-5 text-muted-foreground" />
                                                                           </>
                                                                      )
                                                                           : url.value.includes('www.youtube.com') ? (
                                                                                <>
                                                                                     <Icons.youtube className="h-5 w-5 text-muted-foreground" />
                                                                                </>
                                                                           ) : url.value.includes('t.me') ? (
                                                                                <>
                                                                                     <Icons.telegram className="h-5 w-5 text-muted-foreground" />
                                                                                </>
                                                                           ) : (
                                                                                <>
                                                                                     <Icons.link className="mr-1 h-5 w-5 text-muted-foreground" />
                                                                                     {
                                                                                          // display only the domain name
                                                                                          new URL(url.value).hostname.replace("www.", "")
                                                                                     }
                                                                                </>
                                                                           )
                                                                 }
                                                            </Link>
                                                       </Button>
                                                  </>
                                             ))
                                        )
                                   }
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     )
}