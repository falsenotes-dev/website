import { CalendarDays, Github, Mail, MapPin, ShareIcon, Users2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Icons } from "../icon";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import UserHoverCard from "../user-hover-card";
import Link from "next/link";
import { formatNumberWithSuffix } from "../format-numbers";
import { EmptyPlaceholder } from "../empty-placeholder";

function getRegistrationDateDisplay(date: string) {
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

               <div className="details list-none grid md:grid-cols-2">
                    {user?.location && <div>
                         <Button variant={"link"} size={"sm"} asChild className="p-0 !text-sm hover:!no-underline text-foreground">
                              <span>
                                   <Icons.location className="mr-2 h-5 w-5 text-muted-foreground" />
                                   {user?.location}
                              </span>
                         </Button>
                    </div>}
                    {user?.email && <div>
                         <Button variant={"link"} size={"sm"} asChild className="p-0 text-foreground">
                              <Link href={`mailto:${user?.email}`} target="_blank" className="flex items-center font-light !text-sm">
                                   <Icons.at className="mr-2 h-5 w-5 text-muted-foreground" />
                                   {user?.email}
                              </Link>
                         </Button>
                    </div>}
                    {user?.githubprofile && (<div>
                         <Button variant={"link"} size={"sm"} asChild className="p-0 text-foreground" >
                              <Link href={user?.githubprofile} target="_blank" className="flex items-center font-light !text-sm">
                                   <Github className="mr-2 h-5 w-5 text-muted-foreground" />
                                   {user?.githubprofile?.replace("https://github.com/", "")}
                              </Link>
                         </Button>
                    </div>
                    )
                    }
                    {
                         user?.twitterProfile && (
                              <div>
                                   <Button variant={"link"} size={"sm"} asChild className="p-0 text-foreground" >
                                        <Link href={`https://twitter.com/${user?.twitterProfile}`} target="_blank" className="flex items-center font-light !text-sm">
                                             <Icons.twitter className="mr-2 h-5 w-5 text-muted-foreground" />
                                             {user?.twitterProfile}
                                        </Link>
                                   </Button>
                              </div>
                         )
                    }
                    {
                         user.urls && user.urls.length > 0 && (
                              user.urls.map((url: any) => (
                                   <div key={url.id}>
                                        <Button variant={"link"} size={"sm"} asChild className="p-0 text-foreground" >
                                             <Link href={url.value} target="_blank" className="flex items-center font-light !text-sm">
                                                  {
                                                       //if url.value contains github.com then show github icon if not then show link icon
                                                       url.value.includes("github.com") ? (
                                                            <>
                                                                 <Icons.gitHub className="mr-2 h-5 w-5 text-muted-foreground" />
                                                                 {url.value.replace("https://github.com/", "") || url.value.replace("http://github.com/", "")}
                                                            </>
                                                       ) : url.value.includes("twitter.com") ? (
                                                            <>
                                                                 <Icons.twitter className="mr-2 h-5 w-5 text-muted-foreground" />
                                                                 {url.value.replace("https://twitter.com/", "") || url.value.replace("http://twitter.com/", "")}
                                                            </>
                                                       ) : url.value.includes("facebook.com") ? (
                                                            <>
                                                                 <Icons.facebook className="mr-2 h-5 w-5 text-muted-foreground" />
                                                                 {url.value.replace("https://facebook.com/", "") || url.value.replace("http://facebook.com/", "")}
                                                            </>
                                                       ) : url.value.includes("fb.com") ? (
                                                            <>
                                                                 <Icons.facebook className="mr-2 h-5 w-5 text-muted-foreground" />
                                                                 {url.value.replace("https://fb.com/", "") || url.value.replace("http://fb.com/", "")}
                                                            </>
                                                       ) : url.value.includes("instagram.com") ? (
                                                            <>
                                                                 <Icons.instagram className="mr-2 h-5 w-5 text-muted-foreground" />
                                                                 {url.value.replace("https://instagram.com/", "") || url.value.replace("http://instagram.com/", "")}
                                                            </>
                                                       ) : url.value.includes("linkedin.com") ? (
                                                            <>
                                                                 <Icons.linkedIn className="mr-2 h-5 w-5 text-muted-foreground" />
                                                                 {url.value.replace("https://linkedin.com/", "") || url.value.replace("http://linkedin.com/", "")}
                                                            </>
                                                       ) : url.value.includes('youtube.com') ? (
                                                            <>
                                                                 <Icons.youtube className="mr-2 h-5 w-5 text-muted-foreground" />
                                                                 {url.value.replace("https://youtube.com/", "") || url.value.replace("http://youtube.com/", "")}
                                                            </>
                                                       )
                                                            : url.value.includes('www.youtube.com') ? (
                                                                 <>
                                                                      <Icons.youtube className="mr-2 h-5 w-5 text-muted-foreground" />
                                                                      {url.value.replace("https://www.youtube.com/", "") || url.value.replace("http://www.youtube.com/", "")}
                                                                 </>
                                                            ) : (
                                                                 <>
                                                                      <Icons.link className="mr-2 h-5 w-5 text-muted-foreground" />
                                                                      {url.value.replace("https://", "") || url.value.replace("http://", "")}
                                                                 </>
                                                            )
                                                  }
                                             </Link>
                                        </Button>
                                   </div>
                              ))
                         )
                    }
                    <div>
                         <Button variant={"link"} size={"sm"} asChild className="p-0 !text-sm hover:!no-underline text-foreground" >
                              <span>
                                   <Icons.calendarDays className="mr-2 h-5 w-5 text-muted-foreground" />
                                   Joined {getRegistrationDateDisplay(user?.createdAt)}
                              </span>
                         </Button>
                    </div>
               </div>
          </>
     )
}