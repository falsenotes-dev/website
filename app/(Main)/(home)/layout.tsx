/* eslint-disable react/jsx-no-comment-textnodes */
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import FeaturedDev from "@/components/feed/featured/featured-dev";
import { fetchUsers } from "@/components/feed/fetch-user";
import { fetchTags } from "@/components/feed/get-tags";
import PopularPosts from "@/components/feed/popular-posts"
import SidebarSheet from "@/components/feed/sidebar-sheet";
import { SiteFooter } from "@/components/footer";
import { getSessionUser } from "@/components/get-session-user";
import { MobileBottomNavbar } from "@/components/navbar/mobile-bottom-navbar";
import TagBadge from "@/components/tags/tag";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPopularPostsOfTheMonth, getPopularPostsOfTheWeek } from "@/lib/prisma/posts";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomeLayout({
     children,
}: {
     children: React.ReactNode
}) {
     const session = await getSessionUser();
     if (!session) {
          return redirect('/')
     }
     const topData = await fetchUsers({ id: session.id })
     const topUsers = topData?.users;
     const popularTags = await fetchTags();
     const popularPostsOfTheWeek = await getPopularPostsOfTheWeek({ limit: 3 });
     const { posts } = popularPostsOfTheWeek.posts.length < 3 ? await getPopularPostsOfTheMonth({ limit: 3 }) : popularPostsOfTheWeek;

     const sidebar = (
          <>
               <Link href="https://www.producthunt.com/posts/falsenotes?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-falsenotes" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=431912&theme=neutral" alt="FalseNotes - Explore&#0032;the&#0032;Creative&#0032;Horizon | Product Hunt" className="w-full my-2" width="250" height="54" /></Link>
               <PopularPosts posts={posts} />
               {
                    popularTags.length !== 0 && (
                         <Card className="feed__content_featured_card bg-background">
                              <CardHeader className="p-4">
                                   <CardTitle className="feed__content_featured_card_title text-lg text-center">Popular tags</CardTitle>
                              </CardHeader>
                              <CardContent className="px-4">
                                   <div className="w-2/3 md:w-1/4 lg:w-full flex-wrap pb-4">
                                        {popularTags?.map((tag: any) => (
                                             <Link href={`/tags/${tag.name}`} key={tag.id}>
                                                  <TagBadge className="my-1 mr-1" variant={"secondary"}>{tag.name}</TagBadge>
                                             </Link>
                                        ))}
                                   </div>
                                   <Link href={`/tags`} className="text-xs flex items-center font-medium">
                                        See more tags
                                   </Link>
                              </CardContent>
                         </Card>
                    )
               }
               {
                    topUsers && (
                         <FeaturedDev data={topUsers} />
                    )
               }
               <SiteFooter className='text-xs flex-col justify-start items-start mb-0' size="sm" />
          </>
     )
     return (
          <>
               <SidebarSheet> {sidebar} </SidebarSheet>
               <div className="mx-auto md:mb-0 mb-20">
                    <main className="flex flex-col items-center justify-between feed xl:px-4">
                         <div className="md:flex lg:flex-nowrap flex-wrap justify-center w-full xl:gap-8 md:pt-8">
                              <div className="flex-1">
                                   {children}
                              </div>
                              <aside className="hidden xl:block xl:w-64 min-h-screen">
                                   <div className="sticky flex flex-col gap-4 top-[100px]">
                                        {sidebar}
                                   </div>
                              </aside>
                         </div>
                    </main>
               </div>
               <MobileBottomNavbar session={session} />
          </>
     )
}
