'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useInView } from "react-intersection-observer";
import { Plus } from "lucide-react";
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icon";
import { useEffect, useState } from "react";


export default function FeedTabs({ activeTab = 'foryou', children }: { activeTab?: string, children?: React.ReactNode }) {
     const router = useRouter()
     const [tab, setTab] = useState(activeTab)

     useEffect(() => {
          setTab(activeTab)
     }, [activeTab])

     return (
          <>
               <Tabs defaultValue={tab} className="w-full left-0 sticky top-[74px] z-20 md:hidden">
                    <TabsList className="grid w-full grid-cols-2 rounded-none bg-muted/95 backdrop-blur supports-[backdrop-filter]:bg-muted/60 h-auto">
                         <TabsTrigger onClick={
                              async () => {
                                   router.replace('/feed')
                              }
                         } className="py-3 rounded-lg" value="foryou">For You</TabsTrigger>
                         <TabsTrigger onClick={
                              async () => {
                                   router.replace('/feed?tab=following')
                              }
                         } className="py-3 rounded-lg" value="following">Following</TabsTrigger>
                    </TabsList>
               </Tabs>

               <Button variant={'secondary'} onClick={
                    async () => {
                         if (tab == 'foryou') {
                              router.replace('/feed?tab=following')
                         } else {
                              router.replace('/feed')
                         }
                    }
               } className="py-5 cursor-pointer fixed bottom-10 left-10 z-50 shadow-lg hidden md:inline-flex">
                    {
                         tab == 'foryou' ? 'For You' : 'Following'
                    }
                    <Icons.arrowDataTransferHorizontal className="h-5 w-5 ml-1.5" />
               </Button>
          </>
     );
}