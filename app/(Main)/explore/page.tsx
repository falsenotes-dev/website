'use server'
import Search from "@/components/explore/search"
import { getSessionUser } from "@/components/get-session-user"
import { getPosts } from "@/lib/prisma/posts"
import { getUsers } from "@/lib/prisma/users"
import { searchTags } from "@/lib/prisma/tags"
import ExploreComponent from "@/components/explore/tab-content"
import ExploreTab from "@/components/explore/tab"
import { searchLists } from "@/lib/prisma/list"
import Balancer from "react-wrap-balancer"
import Image from "next/image"

export default async function Explore({
     searchParams
}: {
     searchParams: { [key: string]: string | string[] | undefined }
}) {

     const search = typeof searchParams.search === 'string' ? searchParams.search : undefined

     const { posts } = await getPosts({ search, limit: 3 })
     const { users } = await getUsers({ search, limit: 3 })
     const { tags } = await searchTags({ search, limit: 3 })
     const { lists } = await searchLists({ search, limit: 3 })
     const session = await getSessionUser()

     return (
          <>
               <div className="flex flex-col min-h-screen w-auto justify-start content-center items-center h-min relative">
                    <div className="flex justify-between content-center items-center flex-col flex-[0_0_auto] rounded-3xl gap-10 h-min max-w-[1140px] min-w-[280px] overflow-hidden pt-14 w-full relative mt-4">
                         <div className="flex place-content-center items-center flex-col flex-[0_0_auto] gap-2.5 h-min overflow-visible relative lg:w-[50%] w-11/12 z-[3] perspective-1200">
                              <div className="flex outline-0 flex-col justify-start shrink-0 transform-none flex-[0_0_auto] h-auto relative w-full">
                                   <h1 className="text-3xl lg:text-5xl xl:text-6xl font-black text-primary-foreground text-center">
                                        Explore
                                   </h1>
                              </div>
                              <div className="flex outline-0 flex-col justify-start shrink-0 transform-none flex-[0_0_auto] h-12 relative w-full">
                                   <p className="text-center font-light text-primary-foreground">
                                        <Balancer>
                                             When you&apos;re searching for something new, you&apos;ll find it here.
                                        </Balancer>
                                   </p>
                              </div>
                         </div>
                         <Search search={search} />
                         <div className="background rounded-3xl bottom-[30px] flex-[0_0_auto] h-full left-0 overflow-hidden absolute w-full z-[1]">
                              <div className="absolute inset-0">
                                   <Image
                                        src="/assets/hero_bg.jpg"
                                        layout="fill"
                                        objectFit="cover"
                                        objectPosition="center"
                                        className="rounded-3xl h-full w-full "
                                        alt=""
                                   />
                              </div>
                         </div>
                    </div>
                    <ExploreTab defaultValue="top" search={search} />
                    <ExploreComponent users={users} posts={posts} tags={tags} lists={lists} session={session} search={search} className="md:w-[600px]" />
               </div>
          </>
     )
}