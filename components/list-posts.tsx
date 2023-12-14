'use client'
import { cn } from "@/lib/utils";
import { EmptyPlaceholder } from "./empty-placeholder";
import PostCard from "./tags/post-card-v2";
import { buttonVariants } from "./ui/button";
import Link from "next/link";

export default function ListPosts({ list, session }: { list: any, session: any}) {
     return (
          <div className="lg:px-6 w-full lg:mb-6 md:mb-5 mb-4">
                {list.posts?.length > 0 ? (
                  <div className="flex flex-col lg:gap-6 md:gap-5 gap-4">
                    {list.posts?.map((article: any) => (
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
                    <EmptyPlaceholder.Icon name="post" strokeWidth={1.25} />
                    <EmptyPlaceholder.Title>
                      This list is empty
                    </EmptyPlaceholder.Title>
                    {list.author.id === session?.id && (
                      <EmptyPlaceholder.Description>
                        Add posts to this list by clicking the bookmark icon on
                        any FalseNotes post
                      </EmptyPlaceholder.Description>
                    )}
                    <Link href={"/"} className={cn("", buttonVariants())}>
                      Explore
                    </Link>
                  </EmptyPlaceholder>
                )}
              </div>
     )
}