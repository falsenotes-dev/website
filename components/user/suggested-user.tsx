"use client"
import { useEffect, useState } from "react";
import UserVerticalCard from "../user-vertical-card";
import {
     Carousel,
     CarouselContent,
     CarouselItem,
     CarouselNext,
     CarouselPrevious,
} from "@/components/ui/carousel";
import { User } from "@prisma/client";

export default function SuggestedUsers({ users: initialUsers, session }: { users: any, session: any }) {
     const [users, setUsers] = useState<Array<any>>(initialUsers);
     useEffect(() => {
          setUsers(initialUsers)
     }, [initialUsers])
     return (
          <div className="flex justify-center w-full">
               <div className="mb-20 w-full">
                    <Carousel opts={
                         {
                              align: 'start',

                         }
                    } >
                         <div className="my-10 flex justify-between items-center">
                              <h2 className="text-2xl font-medium tracking-tight w-full">Who to follow</h2>
                              <div className="flex gap-2">
                                   <CarouselPrevious className="static translate-y-0" />
                                   <CarouselNext className="static translate-y-0" />
                              </div>
                         </div>
                         <div className="mt-6 mb-10">

                              <CarouselContent>
                                   {
                                        users.map((user: any) => (
                                             <CarouselItem className="basis-full lg:basis-1/2 xl:basis-1/3 pl-6" key={user.id}><UserVerticalCard user={user} session={session} /></CarouselItem>
                                        ))
                                   }
                              </CarouselContent>
                         </div>
                    </Carousel>
               </div>
          </div>
     )
}