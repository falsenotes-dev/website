"use client";
import PostCard from "../tags/post-card-v2";
import { Separator } from "../ui/separator";
import { EmptyPlaceholder } from "../empty-placeholder";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import HistoryPostCard from "../blog/history-card";
import { clearHistory } from "@/lib/prisma/history";
import { toast } from "sonner";
import { validate } from "@/lib/revalidate";
import HistoryClearDialog from "../blog/history-clear-dialog";

export default function UserHistory({
  posts: initialPosts,
  className,
  user,
  sessionUser,
  tab,
  search,
}: {
  posts: any;
  className?: string;
  user?: any;
  sessionUser?: any;
  tab?: string;
  search?: string | undefined;
}) {
  const router = useRouter();
  const [posts, setPosts] = useState<Array<any>>(initialPosts);

  const [page, setPage] = useState<number>(0);
  const [ref, inView] = useInView();
  const [open, setOpen] = useState(false);
  //when tab change, feed is not updated yet so when when tab change it must be set feed to initialFeed
  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  async function loadMoreFeed() {
    const next = page + 1;
    const result = await fetch(
      `api/user/${user.id}/history?page=${next}${
        search ? `&search=${search}` : ""
      }`
    ).then((res) => res.json());
    const fetchedPosts = result.history;
    if (fetchedPosts?.length) {
      setPage(next);
      setPosts((prev) => [...prev, ...fetchedPosts]);
    }
  }

  useEffect(() => {
    if (inView) {
      loadMoreFeed();
    }
  }, [inView]);

  return (
    <>
      <div className={className}>
        <div className="user-articles w-full lg:mb-6 md:mb-5 mb-4">
          {posts?.length > 0 ? (
            <div className="flex flex-col lg:gap-6 md:gap-5 gap-4">
              {posts?.length > 0 && (
                <Card>
                  <CardContent className="flex flex-row p-6 w-full items-center justify-between">
                    <p className="text-sm">
                      You can clear your history for a specific post by clicking
                      the <span className="font-bold">Remove</span> button on
                      the post.
                    </p>
                    <Button
                      className="ml-4"
                      variant="destructive"
                      size="sm"
                      onClick={() => setOpen(true)}
                    >
                      Clear history
                    </Button>
                  </CardContent>
                </Card>
              )}

              {posts?.map((article: any) => (
                <>
                  <HistoryPostCard post={article.post} session={sessionUser} />
                </>
              ))}

              {posts?.length >= 10 && (
                <div className="feed__list_loadmore !py-0 h-max" ref={ref}>
                  <Card className="rounded-lg bg-transparent max-h-72 w-full">
                    <CardContent className="md:p-6 p-4">
                      <CardHeader className={cn("pb-4 pt-0 px-0 gap-y-4")}>
                        <div className="flex items-center space-x-1">
                          <Skeleton className="w-32 h-3" />
                        </div>
                      </CardHeader>
                      <div className="flex justify-between">
                        <div className="w-full">
                          <div>
                            <div className="pb-3 space-y-2">
                              <Skeleton className="w-full h-4" />
                              <Skeleton className="w-full h-4 md:hidden" />
                            </div>
                            <div className="space-y-2 hidden md:block">
                              <Skeleton className="w-full h-4" />
                              <Skeleton className="w-full h-4" />
                            </div>
                          </div>
                          <div className="py-8">
                            <div className="flex justify-between">
                              <Skeleton className="w-20 h-3" />
                            </div>
                          </div>
                        </div>
                        <Skeleton className="h-14 md:h-28 aspect-square ml-6 md:ml-8" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          ) : (
            <EmptyPlaceholder>
              <EmptyPlaceholder.Icon
                name={"history"}
                strokeWidth={1.25}
              />
              <EmptyPlaceholder.Title>You haven&apos;t read any posts yet</EmptyPlaceholder.Title>
              <EmptyPlaceholder.Description>
                Post you&apos;ve read on FalseNotes, it will show up here.
              </EmptyPlaceholder.Description>
              <Button onClick={() => router.push("/feed")}>Explore</Button>
            </EmptyPlaceholder>
          )}
        </div>
      </div>
      <HistoryClearDialog
        open={open}
        onOpenChange={setOpen}
        post={posts}
        user={sessionUser}
      />
    </>
  );
}
