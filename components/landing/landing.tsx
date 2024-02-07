"use client";
import Image from "next/image";
import LandingPostCard from "../blog/landing-post-card";
import { Separator } from "../ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
import Balancer from "react-wrap-balancer";
import { Badge } from "../ui/badge";
import { ArrowRight } from "lucide-react";
import React from "react";
import { useInView } from "react-intersection-observer";
import { getFeaturedPosts } from "@/lib/prisma/posts";
import { signIn } from "next-auth/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import UserVerticalCard from "../user-vertical-card";
import CountUp from "react-countup";

type Stats = {
  users: number;
  posts: number;
  reads: number;
};

export default function Landing({
  tags,
  popular,
  topUsers,
  stats,
}: {
  tags: any;
  popular: any;
  topUsers: any;
  stats: Stats;
}) {

  return (
    <>
      <main className="landing mx-auto w-full overflow-hidden mb-4 my-10">
        <div className="landing__hero px-4 md:container rounded-3xl overflow-hidden mb-4 mx-4 md:mx-auto">
          <div className="landing__hero_content flex flex-col space-y-8 items-center justify-center p-6 text-primary-foreground">
            <div className="flex flex-col justify-center gap-8">
              <div className="flex flex-col justify-center gap-2">
                <Link
                  href="/@falsenotes/introducing-collaborative-writing-build-your-team-on-falsenotes"
                  className="mx-auto"
                >
                  <Badge
                    variant={"secondary"}
                    className="text-sm font-normal py-1.5 my-5 px-3 w-fit space-x-2 rounded-sm flex gap-1.5"
                  >
                    <Image
                      src="/assets/rocket.png"
                      width={20}
                      height={20}
                      alt=""
                    />
                    <Separator orientation="vertical" className="!m-0 h-5" />
                    Introducing Collaborative Writing{" "}
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Badge>
                </Link>
                <h1 className="landing__hero_title max-w-[1200px] font-black leading-snug text-3xl lg:text-5xl xl:text-6xl text-center">
                  <Balancer>
                    Where Creativity Takes Flight: Unleash Your Ideas
                  </Balancer>
                </h1>
                <p className="landing__hero_description mt-6 mx-auto max-w-[960px] font-medium text-xl leading-relaxed text-center">
                  <Balancer>
                    Code, Create, Connect: Elevate Your Dev Journey with
                    FalseNotes!
                  </Balancer>
                </p>
              </div>
              <Button
                size={"lg"}
                className="mx-auto py-3"
                onClick={() => signIn()}
              >
                Join Now
              </Button>
            </div>
            <div className="landing_hero-image w-[167vw] xl:w-full">
              <Image
                loading="eager"
                src="/assets/header-img.png"
                sizes="100vw"
                className="object-cover mb-14"
                width={1920}
                height={711}
                layout="responsive"
                // Make the image display full width
                style={{
                  width: "120vw",
                  height: "auto",
                }}
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="px-4 md:container mx-4 md:mx-auto">
          <div className="pt-10 pb-4 mb-8">
            <div className="flex flex-row items-center">
              <h2 className="font-medium mb-4">Trending on FalseNotes</h2>
            </div>
            <div className="w-full">
              <div className="grid grid-cols-6 w-full">
                {popular?.map((post: any, index: number) => (
                  <div
                    className="col-span-6 md:col-span-3 lg:col-span-2 px-4"
                    key={post.id}
                  >
                    <div className="h-full w-full">
                      <div className="flex items-start mb-6 w-full h-full">
                        <div className="w-10 flex-none relative -top-1.5 mr-4">
                          <span className="font-medium text-3xl text-muted-foreground">
                            {index < 9 ? `0${index + 1}` : index + 1}
                          </span>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <UserHoverCard user={post.author}>
                            <Link
                              href={`/@${post.author?.username}`}
                              className="flex items-center space-x-0.5"
                            >
                              <Avatar className="h-5 w-5 border">
                                <AvatarImage
                                  src={post.author?.image}
                                  alt={post.author?.username}
                                />
                                <AvatarFallback>
                                  {post.author?.name?.charAt(0) ||
                                    post.author?.username?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <p className="text-sm font-normal leading-none mr-2">
                                {post.author?.name || post.author?.username}
                              </p>
                              {post.author?.verified && (
                                <Icons.verified className="h-3 w-3 inline fill-verified align-middle" />
                              )}
                            </Link>
                          </UserHoverCard>
                          {post.publication && (
                            <UserHoverCard user={post.publication}>
                              <Link
                                href={`/@${post.publication?.username}`}
                                className="flex items-center space-x-0.5"
                              >
                                <span className="text-muted-foreground text-sm">
                                  in
                                </span>
                                <p className="text-sm font-normal leading-none">
                                  {post.publication?.name ||
                                    post.publication?.username}
                                </p>
                              </Link>
                            </UserHoverCard>
                          )}
                          <Link
                            href={`/@${post.publicationId === null
                              ? post.author.username
                              : post.publication.username
                              }/${post.url}`}
                          >
                            <h2 className="font-extrabold line-clamp-2 max-h-10 text-ellipsis leading-tight tracking-normal">
                              {post.title}
                            </h2>
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
          <div className="flex flex-col md:flex-row lg:gap-8 gap-4 self-stretch py-6 mb-8">
            <Card className="self-stretch rounded-lg bg-secondary border-secondary">
              <CardContent className="p-6 md:p-8 h-full">
                <CardTitle className="line-clamp-2 mb-4">
                  Explore suggested tags
                </CardTitle>
                <CardDescription className="line-clamp-3 text-foreground">
                  Discover curated tags for tailored content recommendations.
                  Follow suggested tags to stay updated and dive into a world of
                  diverse posts that match your interests
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="self-stretch main-bg rounded-lg min-h-max">
              <CardContent className="p-6 md:p-8 pb-0 h-full">
                <div className="w-full flex-wrap items-center justify-center">
                  {tags?.map((tag: any) => (
                    <Link href={`/tags/${tag.name}`} key={tag.id}>
                      <TagBadge
                        className="my-1.5 mr-1.5 md:px-3 py-1 text-base font-normal"
                        variant={"secondary"}
                      >
                        <Icons.search className="h-4 w-4 mr-2" />{" "}
                        {tag.name.replace(/-/g, " ")}
                      </TagBadge>
                    </Link>
                  ))}
                </div>
                <CardFooter className="py-6 p-0">
                  <Button variant={"link"} className="px-0" asChild>
                    <Link
                      href={`/tags`}
                      className="text-sm flex items-center my-2.5 font-medium text-primary-foreground"
                    >
                      See more tags
                    </Link>
                  </Button>
                </CardFooter>
              </CardContent>
            </Card>
          </div>

          {/* stats */}
          <Card className="self-stretch rounded-lg mb-10">
            <CardContent className="p-8 md:p-10 h-full flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="flex flex-col items-center gap-2 flex-1">
                <span className="text-4xl font-bold">
                  <CountUp start={0} end={stats.users} />
                </span>
                <span className="text-sm text-muted-foreground">
                  Author
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1">
                <span className="text-4xl font-bold">
                  <CountUp start={0} end={stats.posts} />
                </span>
                <span className="text-sm text-muted-foreground">
                  Posts published
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1">
                <span className="text-4xl font-bold">
                  <CountUp start={0} end={stats.reads} />
                </span>
                <span className="text-sm text-muted-foreground">
                  Total article reads
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center w-full">
            <div className="mb-20 w-full">
              <Carousel
                opts={{
                  align: "start",
                }}
              >
                <div className="my-10 flex justify-between items-center">
                  <h2 className="text-2xl font-medium tracking-tight w-full">
                    Top level authors
                  </h2>
                  <div className="flex gap-2">
                    <CarouselPrevious className="static translate-y-0" />
                    <CarouselNext className="static translate-y-0" />
                  </div>
                </div>
                <div className="mt-6 mb-10">
                  <CarouselContent>
                    {topUsers.map((follower: any) => (
                      <CarouselItem
                        className="basis-full md:basis-1/3 pl-6"
                        key={follower.id}
                      >
                        <UserVerticalCard user={follower} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </div>
              </Carousel>
            </div>
          </div>

          <Card className="self-stretch rounded-lg main-bg text-primary-foreground mb-10">
            <CardContent className="p-8 md:p-10 !px-14 h-full flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <CardTitle className="line-clamp-2 mb-4 text-center md:text-left">
                  Start your journey with FalseNotes now!
                </CardTitle>
                <CardDescription className="line-clamp-3 text-primary-foreground text-center md:text-left">
                  Discover new ideas, learn new skills, and connect with
                  like-minded individuals.
                </CardDescription>
              </div>
              <Button
                size={"lg"}
                className="mt-6 w-max mx-auto md:mx-0 md:mt-0 md:ml-auto"
                variant={"secondary"}
                onClick={() => signIn()}
              >
                Start Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
