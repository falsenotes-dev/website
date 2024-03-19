import { fetchFeed } from "@/components/feed/get-feed";
import InfinitiveScrollFeed from "@/components/feed/feed";
import { getSessionUser } from "@/components/get-session-user";
import FeedTabs from "@/components/feed/navbar/navbar";
import { redirect } from "next/navigation";
import { getLists } from "@/lib/prisma/session";
import { fetchUsers } from "@/components/feed/fetch-user";
import { fetchTags } from "@/components/feed/get-tags";
import {
  getPopularPostsOfTheMonth,
  getPopularPostsOfTheWeek,
} from "@/lib/prisma/posts";
import FeaturedDev from "@/components/feed/featured/featured-dev";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icon";

export default async function Feed({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getSessionUser();

  const tab =
    typeof searchParams.tab === "string" ? searchParams.tab : undefined;
  const feed = await fetchFeed({ page: 0, tab, limit: 10 });
  if (session) {
    if (feed.length === 0) {
      // redirect('/get-started')
    }
  } else {
    return redirect("/");
  }
  const userLists = await getLists({ id: session?.id });
  const topData = await fetchUsers({ id: session.id, limit: 5 });
  const topUsers = topData?.users;
  const popularTags = await fetchTags();
  const popularPostsOfTheWeek = await getPopularPostsOfTheWeek({ limit: 5 });
  const { posts } =
    popularPostsOfTheWeek.posts.length < 5
      ? await getPopularPostsOfTheMonth({ limit: 5 })
      : popularPostsOfTheWeek;
  return (
    <>
      <FeedTabs activeTab={tab} />
      <div className="px-4">
        {feed.length === 0 ? (
          <div className="w-full min-w-[500px] flex flex-col gap-6">
            <FeaturedDev data={topUsers} key="featuredDev" className="w-full" />
            {
              popularTags?.length > 0 && (
                <Card key="popularTagsCard" className="feed__content_featured_card bg-background">
                  <CardHeader className="p-4">
                    <CardTitle className="feed__content_featured_card_title text-lg text-center">Popular tags</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-0">
                    <div className="w-full flex-col flex gap-3">
                      {popularTags?.map((tag: any) => (
                        <Link href={`/tags/${tag.name}`} className='inline-flex gap-1.5 items-center' key={tag.id}>
                          <Badge className='h-8 w-8 px-2 rounded-sm' variant='secondary'><Icons.hash className='h-3 w-3' /></Badge>
                          <span>{tag.name}</span>
                        </Link>
                      ))}
                    </div>
                    <CardFooter className="flex items-center justify-center pt-4 px-0">
                      <Link href={`/tags`} className={cn(buttonVariants({ variant: 'secondary' }), 'w-full')}>
                        See more
                      </Link>
                    </CardFooter>
                  </CardContent>
                </Card>
              )
            }
          </div>
        ) : (
          <InfinitiveScrollFeed
            initialFeed={feed}
            tag={tab}
            session={session}
            list={userLists}
            popularTags={popularTags}
            topUsers={topUsers}
            trending={posts}
          />
        )}
      </div>
    </>
  );
}
