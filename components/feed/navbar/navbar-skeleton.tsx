'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton";


export default function FeedTabsSkeleton() {

     return (
          <>

               <div className="bg-background sticky top-[60px] z-10">
                    <Tabs defaultValue={''} className="">
                         <TabsList className="bg-transparent gap-2 flex-nowrap">
                              <Skeleton className="h-8 w-20" />
                         </TabsList>
                         <TabsList className="bg-transparent gap-2 flex-nowrap">
                              <Skeleton className="h-8 w-20" />
                         </TabsList>
                         <TabsList className="bg-transparent gap-2 flex-nowrap">
                              <Skeleton className="h-8 w-20" />
                         </TabsList>
                         <TabsList className="bg-transparent gap-2 flex-nowrap">
                              <Skeleton className="h-8 w-20" />
                         </TabsList>
                         <TabsList className="bg-transparent gap-2 flex-nowrap">
                              <Skeleton className="h-8 w-20" />
                         </TabsList>
                         <TabsList className="bg-transparent gap-2 flex-nowrap">
                              <Skeleton className="h-8 w-20" />
                         </TabsList>
                         <TabsList className="bg-transparent gap-2 flex-nowrap">
                              <Skeleton className="h-8 w-20" />
                         </TabsList>
                    </Tabs>

               </div>
          </>
     );
}