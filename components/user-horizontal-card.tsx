'use client'
import Link from "next/link";
import { Card, CardContent, CardHeader } from "./ui/card";
import UserHoverCard from "./user-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Icons } from "./icon";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { formatNumberWithSuffix } from "./format-numbers";
import React from "react";
import { Plus } from "lucide-react";
import LoginDialog from "./login-dialog";

export default function UserHorizontalCard({ user, className, session, ...props }: { user: any, session?: any } & React.ComponentPropsWithoutRef<typeof Card>) {
     const [following, setFollowing] = React.useState<boolean>(false)

     React.useEffect(() => {
          setFollowing(user.Followers?.some((follower: any) => follower.followerId === session?.id))
     }, [user, session])

     const follow = async () => {
          const followeeId = user.id
          const followerId = session?.id
          const res = await fetch(`/api/follow?followeeId=${followeeId}&followerId=${followerId}`)
          setFollowing(!following)
          if (!res.ok) {
               setFollowing(!following)
          }
     }
     return (
          <Card className={cn("rounded-lg feedArticleCard border-none shadow-none w-full flex-[1_1_20%] self-stretch", className)} {...props}>
               <CardContent className="flex p-0 gap-6 w-full">
                    <Link href={`/@${user.username}`}>
                         <Avatar className="w-12 h-12">
                              <AvatarImage src={user.image} alt={user.username} />
                              <AvatarFallback>{user.name?.charAt(0) || user.username?.charAt(0)}</AvatarFallback>
                         </Avatar>
                    </Link>
                    <div className="w-full flex justify-between">
                         <div className="flex flex-col">
                              <Link href={`/@${user.username}`}>
                                   <div className="flex items-center pb-1 w-full">
                                        <h2 className="line-clamp-1 text-ellipsis font-medium text-base">{user.name || user.username}
                                        </h2>
                                        {user.verified && (
                                             <Icons.verified className="h-4 w-4 mx-0.5 inline fill-verified align-middle" />
                                        )}
                                   </div>
                              </Link>
                              {
                                   user.bio && (
                                        <div className="max-w-full break-words whitespace-pre-wrap">
                                             <p className="text-muted-foreground line-clamp-3 text-ellipsis text-sm">{user.bio}</p>
                                        </div>
                                   )
                              }
                         </div>
                         <div className="pl-6">
                              {
                                   session ? (
                                        session?.id !== user.id ? (
                                             <Button onClick={
                                                  session?.id === user.id ? () => { } : follow
                                             } variant={following ? "outline" : "default"} className="min-w-[98.65px]">
                                                  {following ? "Following" : "Follow"}
                                             </Button>
                                        ) : (
                                             <div className="min-w-[98.65px]" />
                                        )
                                   ) : (
                                        <LoginDialog>
                                             <Button className="min-w-[98.65px]">
                                                  Follow
                                             </Button>
                                        </LoginDialog>
                                   )
                              }
                         </div>
                    </div>
               </CardContent>
          </Card>
     )
}