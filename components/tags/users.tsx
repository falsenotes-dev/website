"use client"
import { useSession } from "next-auth/react";
import FeedPostCard from "../blog/feed-post-card";
import TagPostCard from "./post-card";
import { Button } from "../ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import UserVerticalCard from "../user-vertical-card";
import { Swiper, SwiperSlide } from 'swiper/react';
import {
     Carousel,
     CarouselContent,
     CarouselItem,
     CarouselNext,
     CarouselPrevious,
} from "@/components/ui/carousel";


// Import Swiper styles
import 'swiper/css';


// import required modules
import { HashNavigation, Navigation, Pagination } from 'swiper/modules';

export default function TagFollowers({ followers: initialFollowers, tag, session }: { followers: any, tag: any, session: any }) {
     const [followers, setFollowers] = useState<Array<any>>(initialFollowers);
     useEffect(() => {
          setFollowers(initialFollowers)
     }, [initialFollowers])
     return (
          <div className="flex justify-center w-full">
               <div className="mb-20 w-full">
                    <div className="my-10">
                         <h2 className="text-2xl font-medium tracking-tight w-full">Who to follow</h2>
                    </div>
                    <div className="mt-6 mb-10">
                         <Carousel opts={
                              {
                                   align: 'start',

                              }
                         } >
                              <CarouselContent>
                                   {
                                        followers.map((follower: any) => (
                                             <CarouselItem className="basis-full md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-6" key={follower.id}><UserVerticalCard user={follower.follower} session={session} /></CarouselItem>
                                        ))
                                   }
                              </CarouselContent>
                              <CarouselPrevious />
                              <CarouselNext />
                         </Carousel>

                    </div>
               </div>
          </div>
     )
}