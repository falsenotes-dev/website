import { CalendarDays, Github, Mail, MapPin, ShareIcon, Users2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Icons } from "../icon";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import UserHoverCard from "../user-hover-card";
import Link from "next/link";
import { formatNumberWithSuffix } from "../format-numbers";
import { EmptyPlaceholder } from "../empty-placeholder";

export function getRegistrationDateDisplay(date: string) {
     const dateObj = new Date(date);
     const day = dateObj.getDate();
     const month = dateObj.toLocaleString("default", { month: "short" });
     const year = dateObj.getFullYear();
     const thisYear = new Date().getFullYear();
     const thisMonth = new Date().getMonth();
     const thisDay = new Date().getDate();

     // Find the difference between today and the date of registration
     const diffYear = thisYear - year;
     const diffMonth = thisMonth - dateObj.getMonth();
     const diffDay = thisDay - day;
     const diffWeek = Math.floor(diffDay / 7);

     if (diffDay === 0 && diffMonth === 0 && diffYear === 0) {
          return "Today";
     } else if (diffDay === 1 && diffMonth === 0 && diffYear === 0) {
          return "Yesterday";
     } else if (diffWeek === 0 && diffMonth === 0 && diffYear === 0) {
          return "This week";
     } else if (diffWeek > 0 && diffWeek < 4 && diffMonth === 0 && diffYear === 0) {
          return `${diffWeek} week${diffWeek > 1 ? "s" : ""} ago`;
     } else {
          return `${month} ${day}, ${year}`;
     }
}

export function UserAbout({ user, className, session }: { user: any, className?: string, session: any }) {
     return (
          <>
               <div className="flex flex-col gap-2.5 w-full">
                    <h5 className="text-xl font-semibold">About me</h5>
                    {
                         user.bio && (
                              <p className="font-light text-sm">{user.bio}</p>
                         )
                    }
               </div>
               <div className="py-4 items-center flex gap-2 w-full">
                    <Icons.users className="h-5 w-5 text-muted-foreground" />
                    <Dialog>
                         <DialogTrigger><Button variant={"ghost"} size={"sm"} asChild>
                              <span>{formatNumberWithSuffix(user.Followers?.length)} <span className="text-muted-foreground ml-2">Followers</span></span>
                         </Button></DialogTrigger>
                         <DialogContent>
                              <DialogHeader>
                                   <DialogTitle>Followers</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                   {user.Followers?.map((follower: any) => (
                                        <div className="flex gap-4 w-full items-center justify-between" key={follower.id}>
                                             <div className="space-y-3">
                                                  <UserHoverCard user={follower.follower} >
                                                       <Link href={`/@${follower.follower?.username}`} className="flex items-center">
                                                            <Avatar className="h-10 w-10 mr-2 md:mr-3">
                                                                 <AvatarImage src={follower.follower?.image} alt={follower.follower?.username} />
                                                                 <AvatarFallback>{follower.follower?.name?.charAt(0) || follower.follower?.username?.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            {
                                                                 follower.follower?.name === null ? (
                                                                      <div>
                                                                           <p className="text-sm font-medium leading-none">{follower.follower?.username} {follower?.follower?.verified && (
                                                                                <Icons.verified className="h-3 w-3 inline fill-verified align-middle" />
                                                                           )}</p>
                                                                      </div>
                                                                 ) : (
                                                                      <div>
                                                                           <p className="text-sm font-medium leading-none">{follower.follower?.name} {follower?.follower?.verified && (
                                                                                <Icons.verified className="h-3 w-3 inline fill-verified align-middle" />
                                                                           )}</p>
                                                                           <p className="text-sm text-muted-foreground">{follower.follower?.username}</p>
                                                                      </div>
                                                                 )
                                                            }
                                                       </Link>
                                                  </UserHoverCard>
                                             </div>

                                        </div>
                                   ))
                                   }
                                   {
                                        user.Followers?.length === 0 && (
                                             <EmptyPlaceholder className="border-none">
                                                  <EmptyPlaceholder.Icon name="users" strokeWidth={1.25} />
                                                  <EmptyPlaceholder.Title>No followers</EmptyPlaceholder.Title>
                                                  <EmptyPlaceholder.Description>
                                                       {user?.id === session?.id ? "You don't have any followers yet." : " The user doesn't have any followers yet."}
                                                  </EmptyPlaceholder.Description>
                                             </EmptyPlaceholder>
                                        )
                                   }
                              </div>
                         </DialogContent>
                    </Dialog>
                    <Dialog>
                         <DialogTrigger><Button variant={"ghost"} size={"sm"} asChild>
                              <span>{formatNumberWithSuffix(user.Followings?.length)} <span className="text-muted-foreground ml-2">Followings</span></span>
                         </Button></DialogTrigger>
                         <DialogContent>
                              <DialogHeader>
                                   <DialogTitle>Followings</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                   {user.Followings?.map((following: any) => (
                                        <div className="flex gap-4 w-full items-center" key={following.id}>
                                             <div className="space-y-3">
                                                  <UserHoverCard user={following.following} >
                                                       <Link href={`/@${following.following.username}`} className="flex items-center">
                                                            <Avatar className="h-10 w-10 mr-2 md:mr-3">
                                                                 <AvatarImage src={following.following.image} alt={following.following.username} />
                                                                 <AvatarFallback>{following.following.name?.charAt(0) || following.following.username?.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            {
                                                                 following.following.name === null ? (
                                                                      <div>
                                                                           <p className="text-sm font-medium leading-none">{following.following.username} {following?.following.verified && (
                                                                                <Icons.verified className="h-3 w-3 inline fill-verified align-middle" />
                                                                           )}</p>
                                                                      </div>
                                                                 ) : (
                                                                      <div>
                                                                           <p className="text-sm font-medium leading-none">{following.following.name} {following?.following.verified && (
                                                                                <Icons.verified className="h-3 w-3 inline fill-verified align-middle" />
                                                                           )}</p>
                                                                           <p className="text-sm text-muted-foreground">{following.following.username}</p>
                                                                      </div>
                                                                 )
                                                            }
                                                       </Link>
                                                  </UserHoverCard>
                                             </div>

                                        </div>
                                   ))
                                   }

                                   {
                                        user.Followings?.length === 0 && (
                                             <EmptyPlaceholder className="border-none">
                                                  <EmptyPlaceholder.Icon name="users" strokeWidth={1.25} />
                                                  <EmptyPlaceholder.Title>No followings</EmptyPlaceholder.Title>
                                                  <EmptyPlaceholder.Description>
                                                       {user?.id === session?.id ? "You don't have any followings yet." : " The user doesn't have any followings yet."}
                                                  </EmptyPlaceholder.Description>
                                             </EmptyPlaceholder>
                                        )
                                   }
                              </div>
                         </DialogContent>
                    </Dialog>

               </div>
          </>
     )
}