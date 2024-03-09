import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { formatNumberWithSuffix } from "../format-numbers";
import { Skeleton } from "../ui/skeleton";
import { fetchPosts } from "./get-posts";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import UserHoverCard from "../user-hover-card";
import { Check } from "lucide-react";
import { Badge } from "../ui/badge";
import { Icons } from "../icon";
import { getPopularPostsOfTheMonth, getPopularPostsOfTheWeek, getPosts } from "@/lib/prisma/posts";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

const formatDate = (dateString: string | number | Date) => {
  const date = new Date(dateString)
  const currentYear = new Date().getFullYear()
  const year = date.getFullYear()
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour12: true,
  })
  if (year !== currentYear) {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour12: true,
    })
  }
  return formattedDate
}

export default function PopularPosts({ posts }: { posts: any[] }) {
  let content = null;

  posts ? content = (
    posts.length !== 0 && (
      <Card className="feed__content_featured_card bg-background">
        <CardHeader className="p-4">
          <CardTitle className="feed__content_featured_card_title text-lg text-center">Trending Now</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-0">
          <ol className="flex flex-col items-start justify-between space-y-4">
            {posts.map(
              (item: any, index: number) => (
                <li key={item.id} className="text-sm space-y-2.5">

                  <div className="flex items-center">
                    <Link href={`/@${item.author.username}`} className="text-xs font-medium flex items-center">
                      <Avatar className="h-5 w-5 mr-1 md:mr-1.5 border">
                        <AvatarImage src={item.author?.image} alt={item.author?.username} />
                        <AvatarFallback>{item.author?.name?.charAt(0) || item.author?.username?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {item.author.name || item.author.username} {item.author?.verified && (
                        <Icons.verified className="h-3 w-3 mx-0.5 inline fill-verified align-middle" />
                      )}
                    </Link>
                    {item.publication && (
                      <Link href={`/@${item.publication.username}`} className="text-xs font-medium flex items-center">
                        <p>
                          <span className="text-xs font-medium text-muted-foreground">in</span>
                          <span>{' ' + item.publication.name || item.publication.username}</span>
                        </p>
                      </Link>
                    )}
                  </div>


                  <Link href={`/@${item.author.username}/${item.url}`} className="text-base font-semibold line-clamp-2 overflow-hidden leading-tight">
                    {item.title}
                  </Link>
                </li>
              ))}
          </ol>
          <CardFooter className="flex items-center justify-center pt-4 px-0">
            <Link href={`/explore/posts`} className={cn(buttonVariants({ variant: 'secondary' }), 'w-full')}>
              See more
            </Link>
          </CardFooter>
        </CardContent>
      </Card>
    )
  ) : (
    content = (
      <Card className="feed__empty_featured_card bg-background">
        <CardHeader>
          <Skeleton className="h-6 w-44" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))

  return content;
}
