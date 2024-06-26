'use client'
import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { Icons } from "../icon";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { Avatar } from "../ui/avatar";
import { ModeToggle } from "../mode-toggle";
import { Separator } from "@/components/ui/separator";

function numberFormat(number: number) {
     if (number > 9) {
          return "9+";
     } else {
          return number;
     }
}

export function MobileHeaderNavbar({ notification }: { notification: number }) {
     const { data: session, status } = useSession() as any;
     const router = useRouter();

     return (<div className="max-w-[1140px] min-w-[280px] block md:hidden mx-auto w-full sticky top-0 md:top-4 z-20 lg:px-6 md:px-2 xl:p-0">
          <div className="menu-container py-2 px-4 bg-background/95 backdrop-blur md:rounded-2xl shadow-xl xl:mx-8 supports-[backdrop-filter]:bg-background/60">
               {
                    status == "authenticated" && (
                         <Drawer>
                              <DrawerTrigger asChild>
                                   <Button variant={"ghost"} size={"icon"} className="h-10 w-10 relative hover:shadow-md hover:!bg-accent/10 hover:backdrop-blur-md">
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                                             <Icons.menu className="w-6 h-6" />
                                        </motion.div>
                                   </Button>
                              </DrawerTrigger>
                              <DrawerContent className="px-5 pb-5">
                                   <Link href={`/@${session?.user.username}/settings/profile`} className="relative flex cursor-default select-none items-center rounded-sm px-2.5 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                        <Icons.settings className="h-5 w-5 mr-2" />
                                        Settings
                                   </Link>
                                   <Separator className="my-2" />
                                   <Link href={`/drafts/`} className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                        <Icons.draft className="h-5 mr-2" />
                                        You drafts
                                   </Link>
                                   <Separator className="my-2" />
                                   <Link href={`/@${session?.user.username}/list/read-later/`} className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                        <Icons.bookmarks className="h-5 mr-2" />
                                        You saved posts
                                   </Link>
                                   <Separator className="my-2" />
                                   <Link
                                        href={`/@${session?.user.username}/settings/blogs`}
                                        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                   >
                                        <Icons.blogs className="h-5 mr-2" />
                                        Your Blogs
                                   </Link>
                                   <Separator className="my-2" />
                                   <div className="flex justify-between items-center my-2">
                                        <ModeToggle />
                                   </div>
                                   <div>

                                        <Separator className="my-2" />
                                        <Link href="/signout" className="relative flex cursor-default text-destructive select-none items-center rounded-sm px-2.5 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                             <Icons.logOut className="h-5 w-5 mr-2 text-destructive" />
                                             Log out
                                        </Link>
                                   </div>
                              </DrawerContent>
                         </Drawer>
                    )
               }

               <Link href={session ? "/feed" : "/"}>
                    <motion.div whileHover={{ scale: 1.02 }} className="flex items-center" whileTap={{ scale: 0.9 }}>
                         <Icons.logo className="h-5" />
                         <span className="sr-only">FalseNotes</span>
                         {process.env.NEXT_PUBLIC_ENV == "beta" && (
                              <Badge className="ml-1.5 md:ml-2" variant={"default"}>
                                   Beta
                              </Badge>
                         )}
                    </motion.div>
               </Link>

               <div className="flex items-center gap-1 md:gap-4">
                    {status == "authenticated" ? (
                         <>
                              <motion.div
                                   whileHover={{ scale: 1.02 }}
                                   whileTap={{ scale: 0.9 }}
                                   transition={{ type: "spring", stiffness: 400, damping: 17 }}
                              >
                                   <Button
                                        variant={"ghost"}
                                        size={"icon"}
                                        className="h-10 w-10 relative hover:shadow-md hover:!bg-accent/10 hover:backdrop-blur-md"
                                        onClick={() => router.replace("/notifications")}
                                   >

                                        <Icons.notification className="w-6 h-6" />
                                        {notification > 0 && (
                                             <Badge className="left-5 font-normal px-1.5 py-0 absolute top-0 h-5 min-w-[1.25rem] max-w-max">
                                                  {numberFormat(notification)}
                                             </Badge>
                                        )}
                                   </Button>
                              </motion.div>
                         </>
                    ) : (
                         <motion.div
                              className="flex items-center gap-2 md:gap-4"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.9 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                         >
                              <Button onClick={() => signIn()}>
                                   Get Started
                              </Button>
                         </motion.div>
                    )}
               </div>
          </div>
     </div>
     )
}