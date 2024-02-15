"use client";

import Link from "next/link";
import { Icons } from "../icon";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { PostCreateButton } from "./post-create-button";

export function MobileBottomNavbar() {
     const { data: session, status } = useSession() as any;
     const router = useRouter();
     const pathname = usePathname();
     return (
          <div className="sticky py-4 border shadow-xl flex md:hidden w-full bottom-0 bg-muted/95 backdrop-blur supports-[backdrop-filter]:bg-muted/80 z-50">
               <div className="flex items-center justify-between w-full gap-4 px-4">
                    <div className="flex items-center justify-center flex-1">
                         <Button
                              variant={"ghost"}
                              onClick={() => {
                                   router.push("/feed");
                              }}
                              size={"icon"}
                         >
                              <div className="flex items-center">
                                   <Icons.home
                                        className={`w-6 h-6 ${pathname == "/feed" ? "text-primary" : ""
                                             }`}
                                   />
                                   <span className="text-sm font-normal text-inherit sr-only">
                                        Home
                                   </span>
                              </div>
                         </Button>
                    </div>
                    <div className="flex items-center justify-center flex-1">
                         <Button
                              variant={"ghost"}
                              onClick={() => {
                                   router.push("/explore");
                              }}
                              size={"icon"}
                         >
                              <div className="flex items-center">
                                   <Icons.search
                                        className={`w-6 h-6 ${pathname == "/explore" ? "text-primary" : ""
                                             }`}
                                   />
                                   <span className="text-sm font-normal text-inherit sr-only">
                                        Explore
                                   </span>
                              </div>
                         </Button>
                    </div>

                    <div className="flex items-center justify-center flex-1">
                         <PostCreateButton
                              variant={"ghost"}
                              iconName="plusSquare"
                              size={"icon"}
                              iconCLassName="h-6 w-6"
                         />
                    </div>

                    <div className="flex items-center justify-center flex-1">
                         <Button
                              variant={"ghost"}
                              onClick={() => {
                                   router.push("/lists");
                              }}
                              size={"icon"}
                         >
                              <div className="flex items-center">
                                   <Icons.collection
                                        className={`w-6 h-6 ${pathname == "/lists" ? "text-primary" : ""
                                             }`}
                                   />
                                   <span className="text-sm font-normal text-inherit sr-only">
                                        Library
                                   </span>
                              </div>
                         </Button>
                    </div>
                    <div className="flex items-center justify-center flex-1">
                         <Button
                              variant={"ghost"}
                              size={"icon"}
                              onClick={() => {
                                   router.push(`/@${session?.user?.username}`);
                              }}
                         >
                              <div className="flex items-center gap-1.5">
                                   <Avatar
                                        className={`h-7 w-7 ${pathname == `/@${session?.user?.username}`
                                             ? "border-primary border-2"
                                             : ""
                                             }`}
                                   >
                                        <AvatarImage
                                             src={session?.user?.image || ""}
                                             alt={session?.user?.name || ""}
                                        />
                                        <AvatarFallback>
                                             <Icons.user className="w-6 h-6" />
                                        </AvatarFallback>
                                   </Avatar>
                                   <span className="text-sm font-normal text-inherit sr-only">
                                        Profile
                                   </span>
                              </div>
                         </Button>
                    </div>
               </div>
          </div>
     );
}
