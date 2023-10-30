import React from "react";
import {
     Card,
     CardContent,
     CardDescription,
     CardFooter,
     CardHeader,
     CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Bookmark, BookmarkPlus, CalendarDays, Check, Eye, Heart, MessageCircle, User } from "lucide-react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import UserHoverCard from "../user-hover-card";
import { Icons } from "../icon";
import TagBadge from "../tags/tag";


function formatDate(dateString: string | number | Date) {
     const date = new Date(dateString);
     const currentYear = new Date().getFullYear();
     const year = date.getFullYear();

     let formattedDate = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
     });

     if (year !== currentYear) {
          formattedDate = date.toLocaleDateString('en-US', {
               year: 'numeric',
               month: 'short',
               day: 'numeric',
               hour: 'numeric',
               minute: 'numeric',
               hour12: true,
          });
     }

     return formattedDate;
}

function dateFormat(dateString: string | number | Date) {
     const date = new Date(dateString)
     const currentDate = new Date()
     const currentYear = currentDate.getFullYear()
     const currentDay = currentDate.getDate()
     const currentHour = currentDate.getHours()
     const currentMinute = currentDate.getMinutes()
     const currentSecond = currentDate.getSeconds()

     const year = date.getFullYear()
     const month = date.getMonth()
     const day = date.getDate()
     const hour = date.getHours()
     const minute = date.getMinutes()
     const second = date.getSeconds()

     const dayDifference = currentDay - day
     const hourDifference = currentHour - hour
     const minuteDifference = currentMinute - minute
     const secondDifference = currentSecond - second

     //when posted ex: 1 hour ago 1 day ago
     if (dayDifference === 0) {
          if (hourDifference === 0) {
               if (minuteDifference === 0) {
                    return `${secondDifference} seconds ago`
               }
               return `${minuteDifference} minutes ago`
          }
          return `${hourDifference} hours ago`
     }
     //if more than 30 days ago, show date ex: Apr 4, 2021
     if (dayDifference > 30) {
          if (year !== currentYear) {
               return `${date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
               })}`
          }
          return `${date.toLocaleDateString('en-US', {
               month: 'short',
               day: 'numeric',
          })}`
     } else {
          return `${dayDifference} days ago`
     }
}

export default function TagPostCard(
     { className, ...props }: React.ComponentPropsWithoutRef<typeof Card> & {
          post: any;
          className?: string;
     }
) {
     return (
          <Card {...props} className={cn('rounded-lg feedArticleCard bg-background hover:bg-card', className)}>
               <CardContent className="p-4 md:p-6 h-full">
                    <div className="grid grid-cols-12 gap-y-8 h-full">
                         <div className="col-span-12">
                              <Link href={`/${props.post.author?.username}/${props.post.url}`}>
                                   <div className="w-full !relative !pb-0 aspect-[4/3] md:aspect-[3/2]" >
                                        {props.post.cover ? (
                                             <Image
                                                  src={props.post.cover}
                                                  fill
                                                  alt={props.post.title}
                                                  className="rounded-md object-cover bg-muted"
                                             />
                                        ) : (
                                             <Icons.noThumbnail className="w-full h-full rounded-md" />
                                        )}
                                   </div>
                              </Link>
                         </div>
                         <div className="col-span-12 flex flex-col justify-center space-y-4">
                              <div className="flex items-center space-x-1">
                                   <UserHoverCard user={props.post.author} className="mr-1 md:mr-1.5" >
                                        <Link href={`/${props.post.author?.username}`} className="flex items-center">
                                             <Avatar className="h-6 w-6 mr-1 md:mr-1.5">
                                                  <AvatarImage src={props.post.author?.image} alt={props.post.author?.username} />
                                                  <AvatarFallback>{props.post.author?.name?.charAt(0) || props.post.author?.username?.charAt(0)}</AvatarFallback>
                                             </Avatar>
                                             {
                                                  props.post.author?.name === null ? (
                                                       <div>
                                                            <p className="text-sm font-normal leading-none">{props.post.author?.username} {props.post.author?.verified && (
                                                                 <Badge className="h-3 w-3 !px-0">
                                                                      <Check className="h-2 w-2 mx-auto" />
                                                                 </Badge>
                                                            )}</p>
                                                       </div>
                                                  ) : (
                                                       <div>
                                                            <p className="text-sm font-normal leading-none">{props.post.author?.name} {props.post.author?.verified && (
                                                                 <Badge className="h-3 w-3 !px-0">
                                                                      <Check className="h-2 w-2 mx-auto" />
                                                                 </Badge>
                                                            )}</p>
                                                       </div>
                                                  )
                                             }
                                        </Link>
                                   </UserHoverCard>
                              </div>
                              <div className="flex">
                                   <div className="flex-initial w-full">
                                        <Link href={`/${props.post.author?.username}/${props.post.url}`}>
                                             <div>
                                                  <div className="pb-2">
                                                       <h2 className="text-base md:text-xl font-bold text-ellipsis overflow-hidden post__title custom">{props.post.title}</h2>
                                                  </div>
                                                  <div className="post-subtitle hidden md:block">
                                                       <p className="text-ellipsis overflow-hidden post__subtitle">{props.post.subtitle}</p>
                                                  </div>
                                             </div>
                                        </Link>
                                   </div>
                              </div>
                              <div className="">
                                   <div className="flex justify-between items-center">
                                        <div className="flex flex-1 items-center space-x-1.5 text-muted-foreground text-sm">
                                             <span>
                                                  {dateFormat(props.post.createdAt)}
                                             </span>
                                             <span>·</span>
                                             <span>{props.post.views} views</span>
                                        </div>
                                   </div>
                              </div>
                              <div className="">
                                   <div className="flex justify-between items-center">
                                        <div className="flex flex-1 items-center space-x-2.5">
                                             <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                                                  <Button variant="ghost" size={"icon"} className="h-8 w-8 text-muted-foreground">
                                                       <Heart className="w-5 h-5" />
                                                  </Button>
                                                  <span>{props.post._count.likes}</span>
                                             </div>
                                             <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                                                  <Button variant="ghost" size={"icon"} className="h-8 w-8 text-muted-foreground">
                                                       <MessageCircle className="w-5 h-5" />
                                                  </Button>
                                                  <span>{props.post._count.comments}</span>
                                             </div>
                                        </div>
                                        <div className="stats flex items-center justify-around gap-2">

                                             <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                                                  <Button variant="ghost" size={"icon"} className="h-8 w-8 text-muted-foreground">
                                                       <BookmarkPlus className="h-5 w-5" />
                                                  </Button>
                                                  <span>{props.post._count.savedUsers}</span>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </CardContent>
          </Card>
     );
}

