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
import SearchBar from "../searchbar";
import { Input } from "../ui/input";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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

  const [search, setSearch] = React.useState("");
  const [query] = useDebounce(search, 750)
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (query) {
        router.push(`/explore?search=${query}`)
      }
    }
  };

  return (
    <>
      <main className="landing mx-auto w-full overflow-hidden mb-4 my-10 flex flex-col items-center content-center justify-start lg:px-6 px-2 xl:p-0">
        <div className="hero flex justify-between content-center items-center flex-col flex-[0_0_auto] rounded-3xl gap-11 h-min max-w-[1140px] min-w-[280px] overflow-hidden p-[74px] lg:px-6 px-2 pb-0 relative w-full">
          <div className="flex place-content-center items-center flex-col flex-[0_0_auto] gap-3.5 h-min overflow-visible p-0 relative lg:w-[70%] w-11/12 z-10 perspective-1200">
            <div className="flex outline-0 flex-col justify-start shrink-0 transform-none flex-[0_0_auto] h-auto relative w-full">
              <h1 className="text-3xl lg:text-5xl xl:text-6xl font-black text-center bg-clip-text text-transparent bg-gradient-to-b from-primary-foreground to-muted-foreground/75 bg-opacity-50">
                <Balancer>
                  Where Creativity Takes Flight: Unleash Your Ideas
                </Balancer>
              </h1>
            </div>
            <div className="flex outline-0 flex-col justify-start shrink-0 transform-none flex-[0_0_auto] h-12 relative w-full">
              <p className="text-lg text-center bg-clip-text text-transparent bg-gradient-to-b from-primary-foreground to-muted-foreground/75 bg-opacity-50">
                <Balancer>
                  Code, Create, Connect: Elevate Your Dev Journey with FalseNotes!
                </Balancer>
              </p>
            </div>
          </div>
          <div className="relative justify-center hidden md:block flex-[0_0_auto] h-[220px] w-[960px] z-10 overflow-visible">
            <div className="aspect-square flex-[0_0_auto] h-[96px] w-[96px] absolute left-[863px] top-10">
              <div className="contents">
                <div className="h-full w-full opacity-100 rounded-full bg-secondary/5 overflow-visible relative">
                  <div className="outline-none flex flex-col justify-start transform -translate-x-1/2 -translate-y-1/2 opacity-100 absolute top-1/2 left-1/2 h-auto w-auto">
                    <p>
                      <span></span>
                    </p>
                  </div>
                  <div className="rounded-full opacity-100 absolute overflow-visible inset-0">
                    <div className="absolute inset-0">
                      <Image
                        src="/assets/o4xrO7nhHYLJ3IVqDNmF0Jbd89Q.jpg"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                        className="rounded-full h-full w-full "
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="aspect-square flex-[0_0_auto] h-[148px] w-[148px] absolute left-0 top-3">
              <div className="contents">
                <div className="h-full w-full opacity-100 rounded-full bg-secondary/5 overflow-visible relative">
                  <div className="outline-none flex flex-col justify-start transform -translate-x-1/2 -translate-y-1/2 opacity-100 absolute top-1/2 left-1/2 h-auto w-auto">
                    <p>
                      <span></span>
                    </p>
                  </div>
                  <div className="rounded-full opacity-100 absolute overflow-visible inset-0">
                    <div className="absolute inset-0">
                      <Image
                        src="/assets/qoV043xuWjRQQbibvoyjoBlaE4.webp"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                        className="rounded-full h-full w-full "
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="aspect-square flex-[0_0_auto] h-[96px] w-[96px] absolute left-[302px] top-0">
              <div className="contents">
                <div className="h-full w-full opacity-100 rounded-full bg-secondary/5 overflow-visible relative">
                  <div className="outline-none flex flex-col justify-start transform -translate-x-1/2 -translate-y-1/2 opacity-100 absolute top-1/2 left-1/2 h-auto w-auto">
                    <p>
                      <span></span>
                    </p>
                  </div>
                  <div className="rounded-full opacity-100 absolute overflow-visible inset-0">
                    <div className="absolute inset-0">
                      <Image
                        src="/assets/TpLrCpid6UuGjOkmgtZL4.webp"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                        className="rounded-full h-full w-full "
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="aspect-square flex-[0_0_auto] h-[120px] w-[120px] absolute left-[186px] top-[100px]">
              <div className="contents">
                <div className="h-full w-full opacity-100 rounded-full bg-secondary/5 overflow-visible relative">
                  <div className="outline-none flex flex-col justify-start transform -translate-x-1/2 -translate-y-1/2 opacity-100 absolute top-1/2 left-1/2 h-auto w-auto">
                    <p>
                      <span></span>
                    </p>
                  </div>
                  <div className="rounded-full opacity-100 absolute overflow-visible inset-0">
                    <div className="absolute inset-0">
                      <Image
                        src="/assets/uDMfrAhga7lhY02vLr4Av0oihY.webp"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                        className="rounded-full h-full w-full "
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="aspect-square flex-[0_0_auto] h-[162px] w-[162px] absolute left-[417px] top-[55px]">
              <div className="contents">
                <div className="h-full w-full opacity-100 rounded-full bg-secondary/5 overflow-visible relative">
                  <div className="outline-none flex flex-col justify-start transform -translate-x-1/2 -translate-y-1/2 opacity-100 absolute top-1/2 left-1/2 h-auto w-auto">
                    <p>
                      <span></span>
                    </p>
                  </div>
                  <div className="rounded-full opacity-100 absolute overflow-visible inset-0">
                    <div className="absolute inset-0">
                      <Image
                        src="/assets/SCLaExdmiXrn32AxMUnFpE5KBE.webp"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                        className="rounded-full h-full w-full "
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="aspect-square flex-[0_0_auto] h-[90px] w-[90px] absolute left-[616px] top-3">
              <div className="contents">
                <div className="h-full w-full opacity-100 rounded-full bg-secondary/5 overflow-visible relative">
                  <div className="outline-none flex flex-col justify-start transform -translate-x-1/2 -translate-y-1/2 opacity-100 absolute top-1/2 left-1/2 h-auto w-auto">
                    <p>
                      <span></span>
                    </p>
                  </div>
                  <div className="rounded-full opacity-100 absolute overflow-visible inset-0">
                    <div className="absolute inset-0">
                      <Image
                        src="/assets/5AR5WjJxyvJ43labZsGKHxyRNaw.webp"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                        className="rounded-full h-full w-full "
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="aspect-square flex-[0_0_auto] h-[120px] w-[120px] absolute left-[726px] top-[87px]">
              <div className="contents">
                <div className="h-full w-full opacity-100 rounded-full bg-secondary/5 overflow-visible relative">
                  <div className="outline-none flex flex-col justify-start transform -translate-x-1/2 -translate-y-1/2 opacity-100 absolute top-1/2 left-1/2 h-auto w-auto">
                    <p>
                      <span></span>
                    </p>
                  </div>
                  <div className="rounded-full opacity-100 absolute overflow-visible inset-0">
                    <div className="absolute inset-0">
                      <Image
                        src="/assets/u7pCeAYdJq6jB9fzr069s5YUaC4.webp"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                        className="rounded-full h-full w-full "
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex-[0_0_auto] h-[62px] max-w-[90%] min-w-[60%] w-full z-10">
            <div className="bg-background h-full max-w-full w-full rounded-full shadow-lg justify-between items-center flex overflow-hidden p-3 relative">
              <div className="flex justify-start content-center items-center flex-[0_0_auto] gap-3.5 h-[54px] p-0 overflow-hidden relative w-max z-10">
                <div className="relative h-auto w-auto flex-[0_0_auto] z-10">
                  <Button size={"icon"} variant={"secondary"} disabled className="p-[13px] h-auto w-auto rounded-full">
                    <Icons.search className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                  </Button>
                </div>
                <div className="flex outline-0 justify-start shrink-0 transform-none h-auto flex-[0_0_auto] relative w-full">
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full px-0 border-none bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-transparent"
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
              <div className="relative h-auto w-auto flex-[0_0_auto] md:block hidden">
                <motion.div whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                  <Button className="py-2.5 px-5 h-auto w-auto rounded-full" onClick={
                    async () => {
                      if (query) {
                        router.push(`/explore?search=${query}`)
                      }
                    }

                  }>
                    Search
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
          <div className="flex flex-col outline-none justify-start shrink-0 relative flex-[0_0_auto] h-auto w-auto z-10">
            <p className="text-muted-foreground">
              Search for posts, authors, and tags to discover new ideas and connect with like-minded individuals.
            </p>
          </div>
          <div className="background rounded-3xl bottom-[100px] flex-[0_0_auto] h-full left-0 overflow-hidden absolute w-full z-[1]">
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
        <div className="flex justify-between content-center items-center flex-col flex-[0_0_auto] pt-[74px] h-min max-w-[1140px] min-w-[280px] overflow-hidden relative w-full">
          <div className="flex justify-center w-full">
            <div className="w-full">
              <Carousel
                opts={{
                  align: "start",
                }}
              >
                <div className="flex flex-col gap-8">
                  <div className="flex justify-between items-center mx-2">
                    <h2 className="text-2xl font-medium tracking-tight w-full">
                      Trending posts
                    </h2>
                    <div className="flex gap-2">
                      <CarouselPrevious className="static translate-y-0" />
                      <CarouselNext className="static translate-y-0" />
                    </div>
                  </div>
                  <CarouselContent>
                    {popular?.map((post: any, index: number) => (
                      <CarouselItem
                        className="basis-full lg:basis-1/2 xl:basis-1/3 pl-6"
                        key={post.id}
                      >
                        <Card className="p-8 gap-6 flex flex-col hover:shadow-lg mb-3">
                          <CardHeader className="p-0">
                            <Link
                              href={`/@${post.author.username}`}
                              className="flex items-center space-x-2"
                            >
                              <Avatar>
                                <AvatarImage
                                  src={post.author.image}
                                  alt={post.author.username}
                                />
                                <AvatarFallback>
                                  {post.author.name.charAt(0) ||
                                    post.author.username.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex gap-0.5">
                                <p className="text-base font-normal leading-none">
                                  {post.author.name || post.author.username}
                                </p>
                                {post.author.verified && (
                                  <Icons.verified className="h-4 w-4 inline fill-verified align-middle" />
                                )}
                              </div>
                            </Link>
                          </CardHeader>
                          <Link
                            href={`/@${post.publicationId === null
                              ? post.author.username
                              : post.publication.username
                              }/${post.url}`}
                          >
                            <CardContent className="p-0 gap-2 flex flex-col">
                              <h2 className="font-extrabold line-clamp-2 text-lg text-ellipsis leading-tight tracking-normal">
                                {post.title}
                              </h2>
                              <span className="text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <span>{dateFormat(post.createdAt)}</span>
                                  <div className="px-1">·</div>
                                  <span>{post.readingTime}</span>
                                </div>
                              </span>
                            </CardContent>
                          </Link>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </div>
              </Carousel>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:gap-8 gap-4 self-stretch py-[74px] mb-8 ">
            <Card className="self-stretch rounded-3xl lg:flex-[1_0_0px] flex-none h-[400px] lg:h-[464px] w-full lg:w-[1px] relative bg-secondary border-secondary">
              <div className="absolute left-0 bottom-0 overflow-hidden w-full h-96 rounded-b-3xl">
                <div className="absolute inset-0">
                  <Image
                    src="/assets/photo-1602035971641-b5ba4900bdb4.jpg"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                    className="rounded-b-3xl h-full w-full"
                    alt=""
                  />
                </div>
              </div>
              <div className="absolute left-0 bottom-0 overflow-hidden w-full h-96 rounded-b-3xl bg-gradient-to-b from-secondary via-secondary to-transparent" />
              <CardContent className="flex lg:items-start items-center flex-col flex-nowrap lg:gap-3.5 gap-2.5 justify-start left-0 overflow-hidden lg:p-12 p-10 absolute top-0 w-full">
                <div className="flex flex-col shrink-0 transform-none justify-start outline-none">
                  <p className="text-xs font-semibold text-primary lg:text-left text-center">
                    Recommended tags
                  </p>
                </div>
                <div className="flex flex-col shrink-0 transform-none justify-start outline-none">
                  <CardTitle className="line-clamp-2 text-4xl font-extrabold lg:text-left text-center">
                    Explore suggested tags
                  </CardTitle>
                </div>
                <div className="flex flex-col shrink-0 transform-none justify-start outline-none">
                  <CardDescription className="line-clamp-3 text-foreground font-light text-sm lg:text-left text-center">
                    Discover curated tags for tailored content recommendations.
                    Follow suggested tags to stay updated and dive into a world of
                    diverse posts that match your interests
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
            <Card className="self-stretch rounded-3xl lg:flex-[1_0_0px] flex-none md:flex-nowrap md:gap-2.5 md:py-6 md:px-2 md:flex justify-center items-center h-min lg:h-[464px] w-full lg:w-[1px] overflow-hidden relative bg-secondary border-secondary">
              <div className="static md:absolute lg:bottom-0 bottom-auto left-0 md:order-1 lg:-left-5 overflow-visible top-0 w-[110%] md:h-[110%] lg:w-[600px] z-[1]">
                <div className="absolute inset-0">
                  <Image
                    src="/assets/hero_bg.jpg"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                    className="h-full w-full"
                    alt=""
                  />
                </div>
              </div>
              <CardContent className="flex content-center items-center flex-wrap gap-1.5 lg:gap-2.5 h-auto lg:h-full justify-center lg:left-0 left-auto overflow-hidden p-3 lg:p-8 relative lg:absolute z-10 w-full md:top-auto">
                {tags?.map((tag: any) => (
                  <Link href={`/tags/${tag.name}`} key={tag.id}>
                    <TagBadge
                      className="my-1.5 mr-1.5 lg:px-5 md:px-3.5 py-2 lg:py-2.5 h-min gap-2 text-base font-normal"
                      variant={"secondary"}
                    >
                      <Icons.search className="h-4 w-4" />{" "}
                      {tag.name.replace(/-/g, " ")}
                    </TagBadge>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* stats */}
          <Card className="self-stretch rounded-lg mb-10 main-bg text-primary-foreground">
            <CardContent className="p-8 md:p-10 h-full flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="flex flex-col items-center gap-2 flex-1">
                <span className="text-6xl font-extrabold">
                  <CountUp start={0} end={stats.users} />
                </span>
                <span>
                  Authors
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1">
                <span className="text-6xl font-extrabold">
                  <CountUp start={0} end={stats.posts} />
                </span>
                <span>
                  Posts published
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1">
                <span className="text-6xl font-extrabold">
                  <CountUp start={0} end={stats.reads} />
                </span>
                <span>
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
                        className="basis-full lg:basis-1/2 xl:basis-1/3 pl-6 mb-3"
                        key={follower.id}
                      >
                        <UserVerticalCard user={follower} className="hover:shadow-lg" />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </div>
              </Carousel>
            </div>
          </div>

          <Card className="self-stretch rounded-lg main-bg text-primary-foreground mb-10">
            <CardContent className="xl:p-12 lg:p-11 p-10 gap-6 xl:gap-0 h-full flex flex-col xl:flex-row justify-between items-center">
              <div>
                <CardTitle className="line-clamp-2 mb-4 text-center font-extrabold text-4xl xl:text-left">
                  Start your journey with FalseNotes now!
                </CardTitle>
                <CardDescription className="line-clamp-3 text-primary-foreground font-medium text-sm text-center xl:text-left">
                  Discover new ideas, learn new skills, and connect with
                  like-minded individuals.
                </CardDescription>
              </div>
              <Button
                size={"lg"}
                className="mt-6 w-max mx-auto xl:mx-0 xl:mt-0 xl:ml-auto"
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
