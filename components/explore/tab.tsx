'use client'
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function ExploreTab({ activeTab = 'top', search, ...props }: { activeTab?: string, search?: string} & React.ComponentPropsWithoutRef<typeof Tabs>) {
     const [tab, setTab] = useState<string>(activeTab)
     useEffect(() => {
          setTab(activeTab)
     }, [activeTab])

     const router = useRouter()
     const pathname  = usePathname()

     return (
          <>
               <Tabs {...props} className="my-6 space-y-8">
                         <TabsList className="">
                              <TabsTrigger value={'top'} onClick={() => router.push(`/explore${search !== undefined ? `?search=${search}` : ''}`)}>
                              Trending
                              </TabsTrigger>
                              <TabsTrigger value={`posts`} onClick={() => router.push(`/explore/posts${search !== undefined ? `?search=${search}` : ''}`)}>
                              Posts
                              </TabsTrigger>
                              <TabsTrigger value={`users`} onClick={() => router.push(`/explore/users${search !== undefined ? `?search=${search}` : ''}`)}>
                              Users
                              </TabsTrigger>
                              <TabsTrigger value={`tags`} onClick={() => router.push(`/explore/tags${search !== undefined ? `?search=${search}` : ''}`)}>
                              Tags
                              </TabsTrigger>
                              <TabsTrigger value={`lists`} onClick={() => router.push(`/explore/lists${search !== undefined ? `?search=${search}` : ''}`)}>
                              Lists
                              </TabsTrigger>
                         </TabsList>
                    </Tabs>
          </>
     )
}