'use client';

import { User } from "@prisma/client";
import { Icons } from "../icon";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Image from "next/image";
import { dateFormat } from "@/lib/format-date";
import { Button } from "../ui/button";
import useWindowDimensions from "../window-dimensions";
import { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";

export const VerificationBadgeDialog = ({
     trigger,
     user,
     session,
     ...props
}: {
     trigger: React.ReactNode;
     user: User;
     session?: any;
} & React.ComponentPropsWithoutRef<typeof Popover>) => {
     const [isDesktop, setIsDesktop] = useState(false);

     const { width } = useWindowDimensions();

     useEffect(() => {
          if (width && width > 768) setIsDesktop(true);
          else setIsDesktop(false);
     }, [width]);

     if (isDesktop) {
          return (
               <Popover {...props}>
                    <PopoverTrigger>{trigger}</PopoverTrigger>
                    <PopoverContent className="inline-flex p-5 gap-3 flex-col w-80">
                         <span className="text-2xl font-semibold">
                              Verified Blog
                         </span>
                         {
                              user.verified && (
                                   <div className="inline-flex gap-3">
                                        <Icons.verified className="w-10 h-10 fill-verified" />
                                        <span className="text-muted-foreground">
                                             This blog is verified
                                             {
                                                  user.falsemember ? " because it is associated with The False" : "."
                                             }
                                        </span>
                                   </div>
                              )
                         }
                         {
                              user.falsemember && (
                                   <div className="inline-flex gap-3">
                                        <Image src="/assets/falsemember.png" alt="False Member" width={28} height={28} className="w-5 h-5" />
                                        <span className="text-muted-foreground">
                                             This blog is associated with The False
                                        </span>
                                   </div>
                              )
                         }
                         {
                              user.verifiedAt && (
                                   <div className="inline-flex gap-3">
                                        <Icons.calendarDays className="w-5 h-5" />
                                        <span className="text-muted-foreground">
                                             Verified since {dateFormat(new Date(user.verifiedAt))}
                                        </span>
                                   </div>
                              )
                         }
                         {
                              session && !session.verified && (
                                   <Button
                                        variant="secondary"
                                        className="w-full"
                                        disabled
                                   >
                                        Upgrade to get verified
                                   </Button>
                              )
                         }
                    </PopoverContent>
               </Popover>
          );
     } else {
          return (
               <>
                    <Drawer {...props}>
                         <DrawerTrigger>{trigger}</DrawerTrigger>
                         <DrawerContent className="p-5 pt-0 gap-3 flex-col">
                              <DrawerHeader>
                                   <DrawerTitle>
                                        Verified Blog
                                   </DrawerTitle>
                              </DrawerHeader>
                              {
                                   user.verified && (
                                        <div className="inline-flex gap-3">
                                             <Icons.verified className="w-6 h-6 fill-verified" />
                                             <span className="text-muted-foreground">
                                                  This blog is verified
                                                  {
                                                       user.falsemember ? " because it is associated with The False" : "."
                                                  }
                                             </span>
                                        </div>
                                   )
                              }
                              {
                                   user.falsemember && (
                                        <div className="inline-flex gap-3">
                                             <Image src="/assets/falsemember.png" alt="False Member" width={28} height={28} className="w-5 h-5" />
                                             <span className="text-muted-foreground">
                                                  This blog is associated with The False
                                             </span>
                                        </div>
                                   )
                              }
                              {
                                   user.verifiedAt && (
                                        <div className="inline-flex gap-3">
                                             <Icons.calendarDays className="w-5 h-5" />
                                             <span className="text-muted-foreground">
                                                  Verified since {dateFormat(new Date(user.verifiedAt))}
                                             </span>
                                        </div>
                                   )
                              }
                              {
                                   session && !session.verified && (
                                        <Button
                                             variant="secondary"
                                             className="w-full"
                                             disabled
                                        >
                                             Upgrade to get verified
                                        </Button>
                                   )
                              }
                         </DrawerContent>
                    </Drawer>
               </>
          )
     }
}