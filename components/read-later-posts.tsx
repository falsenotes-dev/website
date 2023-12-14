'use client'
import { cn } from "@/lib/utils";
import { EmptyPlaceholder } from "./empty-placeholder";
import PostCard from "./tags/post-card-v2";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ReadLaterPosts({ list, session }: { list: any, session: any}) {
  const router = useRouter();
     return (
          <div className="lg:px-6 w-full lg:mb-6 md:mb-5 mb-4">
                {list.length > 0 ? (
                  <div className="flex flex-col lg:gap-6 md:gap-5 gap-4">
                    {list.map((article: any) => (
                      <>
                        <PostCard
                          post={article.post}
                          session={session}
                          list={list}
                        />
                      </>
                    ))}
                  </div>
                ) : (
                  <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="bookmark" strokeWidth={1.25} />
            <EmptyPlaceholder.Title>
              You haven&apos;t saved any posts yet.
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              Click the bookmark icon on a post to save it here
            </EmptyPlaceholder.Description>
            <Button onClick={() => router.push("/feed")}>Explore</Button>
          </EmptyPlaceholder>
                )}
              </div>
     )
}