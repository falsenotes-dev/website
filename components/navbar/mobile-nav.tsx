'use client'
import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { Icons } from "../icon";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

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
          <div className="menu-container py-2 px-4 bg-background/95 backdrop-blur border md:rounded-2xl shadow-xl xl:mx-8 supports-[backdrop-filter]:bg-background/60">
               <Button variant={"ghost"} size={"icon"} className="h-10 w-10 relative hover:shadow-md hover:!bg-accent/10 hover:backdrop-blur-md">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                         <Icons.menu className="w-6 h-6" />
                    </motion.div>
               </Button>

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
                              <Button
                                   variant={"ghost"}
                                   size={"icon"}
                                   className="h-10 w-10 relative hover:shadow-md hover:!bg-accent/10 hover:backdrop-blur-md"
                                   onClick={() => router.replace("/notifications")}
                              >
                                   <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.9 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                   >
                                        <Icons.notification className="w-6 h-6" />
                                        {notification > 0 && (
                                             <Badge className="left-5 font-normal px-1.5 py-0 absolute top-0 h-5 min-w-[1.25rem] max-w-max">
                                                  {numberFormat(notification)}
                                             </Badge>
                                        )}
                                   </motion.div>
                              </Button>
                         </>
                    ) : (
                         <motion.div
                              className="flex items-center gap-2 md:gap-4"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.9 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                         >
                              <Button onClick={() => signIn()}>Join</Button>
                         </motion.div>
                    )}
               </div>
          </div>
     </div>
     )
}