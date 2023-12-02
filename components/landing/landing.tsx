'use client'
import Image from "next/image";
import LandingPostCard from "../blog/landing-post-card";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { EmptyPlaceholder } from "../empty-placeholder";
import Link from "next/link";
import TagBadge from "../tags/tag";
import { Button } from "../ui/button";
import UserHoverCard from "../user-hover-card";
import { Icons } from "../icon";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useWindowDimensions from "../window-dimensions";
import { SiteFooter } from "../footer";
import { dateFormat } from "@/lib/format-date";
import Balancer from 'react-wrap-balancer'
import { Badge } from "../ui/badge";
import { ArrowRight } from "lucide-react";

export default function Landing({ latest, tags, popular }: { latest: any, tags: any, popular: any }) {
  const { width, height } = useWindowDimensions();
  return (
    <>
      <main className="landing mx-auto w-full overflow-hidden mb-4">
        <div className="landing__hero px-6 xl:px-36 2xl:px-64">
          <div className="landing__hero_content flex flex-col md:mt-28 mt-20 space-y-8 items-center justify-center">
            <div className="flex flex-col justify-center gap-8">
              <div className="flex flex-col justify-center gap-2">
              <Link href="/@falsetech/introducing-the-falsenotes-editor-where-your-ideas-come-to-life" className="mx-auto">
              <Badge variant={'secondary'} className="text-sm font-normal py-1.5 my-5 px-3 w-fit space-x-2 rounded-sm">🚀       Introducing the FalseNotes Editor <ArrowRight className="ml-1 h-3.5 w-3.5" /></Badge>
              </Link>
              <h1 className="landing__hero_title max-w-[1200px] font-black leading-snug text-3xl lg:text-5xl xl:text-6xl text-center"><Balancer>Where Creativity Takes Flight:
Unleash Your Ideas</Balancer></h1>
              <p className="landing__hero_description mt-6 mx-auto max-w-[960px] font-medium text-xl leading-relaxed text-center"><Balancer>Code, Create, Connect: Elevate Your Dev Journey with FalseNotes!</Balancer></p>
              </div>
              <Button size={"lg"} className="mx-auto py-3" asChild>
              <Link href="/signin">
                Join Now
              </Link>
            </Button>
            </div>
            <div className="landing_hero-image w-[167vw] xl:w-screen">
              <Image loading="eager" className="dark:hidden block" src="https://falsenotescontent.blob.core.windows.net/header/falsenotes-hero light.webp" sizes="100vw" width={2849} height={1000} layout="responsive"
                // Make the image display full width
                style={{
                  width: '120vw',
                  height: 'auto',
                }} alt="" />
              <Image loading="eager" className="hidden dark:block" src="https://falsenotescontent.blob.core.windows.net/header/falsenotes-hero dark.webp" sizes="100vw" width={2849} height={1000} layout="responsive"
                // Make the image display full width
                style={{
                  width: '120vw',
                  height: 'auto',
                }} alt="" />
            </div>
          </div>
        </div>
        <div className="bg-third dark:bg-popover px-3.5 xl:px-36 2xl:px-64 divide-y border-t">
          <div className="pt-10 pb-4">
            <div className="flex flex-row items-center">
              <h2 className="font-medium mb-4">Trending on FalseNotes</h2>
            </div>
            <div className="w-full">
              <div className="grid grid-cols-6 w-full">
                {popular?.map((post: any, index: number) => (
                  <div className="col-span-6 md:col-span-3 lg:col-span-2 px-4" key={post.id}>
                    <div className="h-full w-full">
                      <div className="flex items-start mb-6 w-full h-full">
                        <div className="w-10 flex-none relative -top-1.5 mr-4">
                          <span className="font-medium text-3xl text-muted-foreground">{index < 9 ? `0${index + 1}` : index + 1}</span>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <UserHoverCard user={post.author} >
                            <Link href={`/@${post.author?.username}`} className="flex items-center space-x-0.5">
                              <Avatar className="h-5 w-5 border">
                                <AvatarImage src={post.author?.image} alt={post.author?.username} />
                                <AvatarFallback>{post.author?.name?.charAt(0) || post.author?.username?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <p className="text-sm font-normal leading-none mr-2">{post.author?.name || post.author?.username}</p>
                              {post.author?.verified && (
                                <Icons.verified className="h-3 w-3 inline fill-primary align-middle" />
                              )}
                            </Link>
                          </UserHoverCard>
                          <Link href={`/@${post.author?.username}/${post.url}`}>
                            <h2 className="font-extrabold line-clamp-2 max-h-10 text-ellipsis leading-tight tracking-normal">{post.title}</h2>
                          </Link>
                          <span className="text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <span>{dateFormat(post.createdAt)}</span>
                              <div className="px-1">·</div>
                              <span>{post.readingTime}</span>
                            </div>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid-cols-12 lg:grid flex flex-col-reverse lg:gap-8 gap-4 pt-14 grid-rows-1">
            <div style={{ 'gridColumn': '1 / span 8' }} className="mt-10 lg:mt-0">
              {latest.length > 0 ? (
                <div className="flex flex-col lg:gap-6 md:gap-5 gap-4">
                  {latest?.map((post: any) => (
                      <LandingPostCard
                      post={post}
                      key={post.id}
                    />
                    ))}
                </div>
              ) : (
                <EmptyPlaceholder>
                  <EmptyPlaceholder.Icon name='post' />
                  <EmptyPlaceholder.Title>No posts yet</EmptyPlaceholder.Title>
                  <EmptyPlaceholder.Description>When you follow someone, their posts will show up here.</EmptyPlaceholder.Description>

                </EmptyPlaceholder>
              )}
            </div>
            <div style={{ 'gridColumn': '9 / span 4' }}>
              <div className="sticky lg:top-20 border-b lg:border-b-0">
                {tags.length !== 0 && (
                  <Card className="feed__content_featured_card bg-transparent">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle className="feed__content_featured_card_title text-base">Discover more of what matchs you</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 md:px-6 pb-0">
                      <div className="w-full flex-wrap">
                        {tags?.map((tag: any) => (
                          <Link href={`/tags/${tag.name}`} key={tag.id}>
                            <TagBadge className="my-1 mr-1 text-sm font-medium" variant={"secondary"}>{tag.name.replace(/-/g, " ")}</TagBadge>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="px-4 md:px-6">
                      <Button variant={'link'} className="px-0" asChild>
                        <Link href={`/tags`} className="text-sm flex items-center my-2.5 font-medium">
                          See more tags
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </main>
      <SiteFooter />
    </>
  )
}