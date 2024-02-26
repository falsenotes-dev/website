import {
     CalendarDays,
     Github,
     Mail,
     MapPin,
     ShareIcon,
     Users2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Icons } from "../icon";
import {
     Dialog,
     DialogContent,
     DialogHeader,
     DialogTitle,
     DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import UserHoverCard from "../user-hover-card";
import Link from "next/link";
import { formatNumberWithSuffix } from "../format-numbers";
import { EmptyPlaceholder } from "../empty-placeholder";
import UserHorizontalCard from "../user-horizontal-card";
import UserListsDialog from "../users-list-dialog";

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
     } else if (
          diffWeek > 0 &&
          diffWeek < 4 &&
          diffMonth === 0 &&
          diffYear === 0
     ) {
          return `${diffWeek} week${diffWeek > 1 ? "s" : ""} ago`;
     } else {
          return `${month} ${day}, ${year}`;
     }
}

export function UserAbout({
     user,
     className,
     session,
}: {
     user: any;
     className?: string;
     session: any;
}) {
     return (
          <>
               <div className="flex flex-col gap-2.5 w-full">
                    <h5 className="text-xl font-semibold">About me</h5>
                    {user.bio && <p className="font-light text-sm">{user.bio}</p>}
               </div>
               <div className="py-4 items-center flex gap-2 w-full">
                    <Icons.users className="h-5 w-5 text-muted-foreground" />
                    <UserListsDialog
                         trigger={
                              <Button variant={"ghost"} size={"sm"} asChild>
                                   <span>
                                        {formatNumberWithSuffix(user.Followers?.length)}{" "}
                                        <span className="text-muted-foreground ml-2">Followers</span>
                                   </span>
                              </Button>
                         }
                         title={`${formatNumberWithSuffix(user.Followers?.length)} Followers`}
                    >
                         <div className="space-y-4">
                              {user.Followers?.map((follower: any) => (
                                   <>
                                        <UserHorizontalCard
                                             user={follower.follower}
                                             session={session}
                                        />
                                   </>
                              ))}
                              {user.Followers?.length === 0 && (
                                   <EmptyPlaceholder className="border-none">
                                        <EmptyPlaceholder.Icon name="users" strokeWidth={1.25} />
                                        <EmptyPlaceholder.Title>No followers</EmptyPlaceholder.Title>
                                        <EmptyPlaceholder.Description>
                                             {user?.id === session?.id
                                                  ? "You don't have any followers yet."
                                                  : " The user doesn't have any followers yet."}
                                        </EmptyPlaceholder.Description>
                                   </EmptyPlaceholder>
                              )}
                         </div>
                    </UserListsDialog>
                    <UserListsDialog
                         trigger={
                              <Button variant={"ghost"} size={"sm"} asChild>
                                   <span>
                                        {formatNumberWithSuffix(user.Followings?.length)}{" "}
                                        <span className="text-muted-foreground ml-2">Followings</span>
                                   </span>
                              </Button>
                         }
                         title={`${formatNumberWithSuffix(user.Followings?.length)} Followings`}
                    >
                         <div className="space-y-4">
                              {user.Followings?.map((following: any) => (
                                   <>
                                        <UserHorizontalCard
                                             user={following.following}
                                             session={session}
                                        />
                                   </>
                              ))}
                              {user.Followings?.length === 0 && (
                                   <EmptyPlaceholder className="border-none">
                                        <EmptyPlaceholder.Icon name="users" strokeWidth={1.25} />
                                        <EmptyPlaceholder.Title>No followings</EmptyPlaceholder.Title>
                                        <EmptyPlaceholder.Description>
                                             {user?.id === session?.id
                                                  ? "You don't have any followings yet."
                                                  : " The user doesn't have any followings yet."}
                                        </EmptyPlaceholder.Description>
                                   </EmptyPlaceholder>
                              )}
                         </div>
                    </UserListsDialog>
               </div>
          </>
     );
}
