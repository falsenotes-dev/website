import { getSessionUser } from "@/components/get-session-user";
import { notFound, redirect } from "next/navigation";
import db from "@/lib/db";
import { UserDetails, UserPosts } from "@/components/user";
import { getUserPost } from "@/lib/prisma/posts";
import { getLists } from "@/lib/prisma/session";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { SiteFooter } from "@/components/footer";
import { UserAbout, getRegistrationDateDisplay } from "@/components/user/about";
import { Icons } from "@/components/icon";
import Image from "next/image";
import { UserCard } from "@/components/user/card";
import { Separator } from "@/components/ui/separator";
import ListCard from "@/components/list-card";
import { formatNumberWithSuffix } from "@/components/format-numbers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import UserHoverCard from "@/components/user-hover-card";
import { MobileBottomNavbar } from "@/components/navbar/mobile-bottom-navbar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import PostCard from "@/components/blog/post-card-v3";

export default async function Page({
  params,
  searchParams,
}: {
  params: {
    username: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const decodedUsername = decodeURIComponent(params.username);

  if (!decodedUsername.startsWith("@")) redirect("/404");

  const sessionUserName = await getSessionUser();
  const user = await db.user.findFirst({
    include: {
      urls: true,
      _count: {
        select: {
          posts: {
            where: {
              published: true,
            },
          },
          publicationsPosts: {
            where: {
              published: true,
            },
          },
          Followers: true,
        },
      },
      Followers: {
        include: {
          follower: {
            include: {
              Followers: true,
              Followings: true,
            },
          },
        },
      },
      Followings: {
        include: {
          following: {
            include: {
              Followers: true,
              Followings: true,
            },
          },
        },
      },
      writers: {
        where: {
          visibility: "public",
        },
        select: {
          author: {
            include: {
              _count: { select: { Followers: true, Followings: true } },
            },
          },
        }
      },
      publications: {
        where: {
          visibility: "public",
        },
        select: {
          publication: {
            include: {
              _count: { select: { Followers: true, Followings: true } },
            },
          },
        },
        take: 5,
      }
    },
    where: {
      username: decodedUsername.substring(1),
    },
  });

  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;
  if (!user) {
    return notFound();
  }

  let pinnedPost = await db.post.findFirst({
    where: {
      publicationId: user.id,
      pinned: true,
    },
    include: {
      _count: {
        select: {
          comments: true,
          likes: true,
          savedUsers: true,
          shares: true,
        },
      },
      savedUsers: true,
      tags: {
        take: 1,
        include: {
          tag: true,
        },
      },
      author: {
        include: {
          _count: { select: { Followers: true, Followings: true } },
        },
      },
      publication: {
        include: {
          _count: { select: { Followers: true, Followings: true } },
        },
      },
    },
  });

  if (pinnedPost === null) {
    pinnedPost = await db.post.findFirst({
      where: {
        authorId: user.id,
        pinned: true,
      },
      include: {
        _count: {
          select: {
            comments: true,
            likes: true,
            savedUsers: true,
            shares: true,
          },
        },
        savedUsers: true,
        tags: {
          take: 1,
          include: {
            tag: true,
          },
        },
        author: {
          include: {
            _count: { select: { Followers: true, Followings: true } },
          },
        },
        publication: {
          include: {
            _count: { select: { Followers: true, Followings: true } },
          },
        },
      },
    });
  }

  const lists = await db.list.findMany({
    where:
      sessionUserName?.id === user?.id
        ? { authorId: user?.id }
        : { authorId: user?.id, visibility: "public" },
    include: {
      _count: { select: { posts: true } },
      posts: {
        include: {
          post: {
            select: {
              cover: true,
            },
          },
        },
        take: 3,
      },
      author: true,
      savedUsers: true,
    },
  });

  const bookmarks = await db.bookmark.findMany({
    where: {
      userId: sessionUserName?.id,
    },
    include: {
      post: {
        select: {
          cover: true,
        },
      },
      user: true,
    },
  });

  const limit = pinnedPost ? 11 : 12;

  const { posts } = await getUserPost({ id: user.id, search, limit });

  const followers = user?.Followers;

  const tab =
    typeof searchParams.tab === "string" ? searchParams.tab : undefined;

  const list = await getLists({ id: sessionUserName?.id });
  const firstPost = pinnedPost || posts[0];
  const restPosts = !pinnedPost ? posts.slice(1, 12) : posts;
  return (
    <div className="flex flex-col justify-start items-center w-auto xl:px-0 px-3 py-8">
      <div className="relative flex-[0_0_auto] h-max max-w-[1140px] min-w-[280px] w-full overflow-visible">
        <div className="flex flex-col justify-center items-start bottom-0 gap-3 left-1/2 h-min max-w-5xl min-w-[280px] relative overflow-hidden w-[94%] -translate-x-1/2">
          <Avatar className="h-28 w-28">
            <AvatarImage src={user?.image!} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-1.5"><h1 className="text-4xl font-extrabold line-clamp-1">{user.name}</h1>
              {
                user.verified && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger><Icons.verified className="h-7 w-7 text-muted-foreground fill-verified" /></TooltipTrigger>
                      <TooltipContent>Verified Author</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              }
              {
                user.falsemember && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger><Image src="/assets/falsemember.png" alt="False Member" width={28} height={28} /></TooltipTrigger>
                      <TooltipContent>The False Staff</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              }
            </div>
            <div className="items-center flex gap-2 w-full">
              <div className="inline-flex items-center justify-center font-medium transition-colors h-8 rounded-md text-sm">
                {formatNumberWithSuffix(user._count.Followers)}{" "}
                <span className="text-muted-foreground ml-2">Followers</span>
              </div>
              <div className="inline-flex items-center justify-center font-medium transition-colors h-8 rounded-md text-sm">
                {formatNumberWithSuffix(user._count.posts + user._count.publicationsPosts)}{" "}
                <span className="text-muted-foreground ml-2">Posts</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between md:items-center w-full flex-col md:flex-row gap-2">
            <div className="flex gap-3 h-4 text-sm relative text-muted-foreground items-center">
              {
                user.location && (
                  <div className="flex items-center gap-1">
                    <Icons.location className="h-4 w-4" />
                    {user.location}
                  </div>
                )
              }
              <div className="flex items-center gap-1">
                <Icons.calendarDays className="h-4 w-4" />
                Joined {getRegistrationDateDisplay(user.createdAt.toISOString())}
              </div>
            </div>
            <div className="flex gap-4 items-center">
              {/* user social links */}
              <div className="flex gap-4 items-center">
                {
                  user.urls && user.urls.length > 0 && (
                    user.urls.map((url: any) => (
                      <>
                        <Button variant={"link"} size={"sm"} asChild className="p-0 text-foreground" key={url.id}>
                          <Link href={url.value} target="_blank" className="flex items-center font-light !text-sm">
                            {
                              //if url.value contains github.com then show github icon if not then show link icon
                              url.value.includes("github.com") ? (
                                <>
                                  <Icons.gitHub className="h-5 w-5 text-muted-foreground" />
                                </>
                              ) : url.value.includes("twitter.com") ? (
                                <>
                                  <Icons.twitter className="h-5 w-5 text-muted-foreground" />
                                </>
                              ) : url.value.includes("facebook.com") ? (
                                <>
                                  <Icons.facebook className="h-5 w-5 text-muted-foreground" />
                                </>
                              ) : url.value.includes("fb.com") ? (
                                <>
                                  <Icons.facebook className="h-5 w-5 text-muted-foreground" />
                                </>
                              ) : url.value.includes("instagram.com") ? (
                                <>
                                  <Icons.instagram className="h-5 w-5 text-muted-foreground" />
                                </>
                              ) : url.value.includes("linkedin.com") ? (
                                <>
                                  <Icons.linkedIn className="h-5 w-5 text-muted-foreground" />
                                </>
                              ) : url.value.includes('youtube.com') ? (
                                <>
                                  <Icons.youtube className="h-5 w-5 text-muted-foreground" />
                                </>
                              )
                                : url.value.includes('www.youtube.com') ? (
                                  <>
                                    <Icons.youtube className="h-5 w-5 text-muted-foreground" />
                                  </>
                                ) : url.value.includes('t.me') ? (
                                  <>
                                    <Icons.telegram className="h-5 w-5 text-muted-foreground" />
                                  </>
                                ) : (
                                  <>
                                    <Icons.link className="mr-1 h-5 w-5 text-muted-foreground" />
                                    {
                                      // display only the domain name
                                      new URL(url.value).hostname.replace("www.", "")
                                    }
                                  </>
                                )
                            }
                          </Link>
                        </Button>
                      </>
                    ))
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col max-w-5xl min-w-[280px] w-full py-10">
        <Tabs defaultValue="home">
          <TabsList className="mb-8">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="lists">Lists</TabsTrigger>
            {
              user?.writers?.length > 0 && (
                <TabsTrigger value="writers">Writers</TabsTrigger>
              )
            }
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
        </Tabs>
        <div
          className="grid 
      grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div className="md:col-span-2 md:row-span-2">
            <PostCard post={firstPost} author={firstPost.author} list={list} session={sessionUserName} isFirst isPinned={firstPost.pinned} />
          </div>
          {restPosts.map((post: any) => {
            return (
              <>
                <PostCard post={post} author={post.author} list={list} session={sessionUserName} isPinned={post.pinned} />
              </>
            );
          })}
        </div>
      </div>
      {/* <div className="md:container mx-auto px-4 pt-5 md:mb-0 mb-20">
        <div className="gap-5 lg:gap-6 flex flex-col md:flex-row items-start xl:px-4 pt-5">
          <div
            className="user__header md:hidden w-full sm:h-fit lg:min-w-[352px] lg:border-r lg:max-w-[352px] md:px-8 xl:min-w-[368px] xl:max-w-[368px] lg:pl-10 lg:flex flex-col md:sticky top-[115px]"
            style={{
              minHeight: "calc(100vh - 125px)",
            }}
          >
            <div className="lg:flex-[1_0_auto]">
              <UserDetails
                user={user}
                followers={followers}
                session={sessionUserName}
              />
            </div>
            <SiteFooter className="text-xs flex-col justify-start items-start mb-0 mt-4 !px-0" size="sm" />
          </div>
          <Separator
            className="block md:hidden lg:block h-full"
            orientation="vertical"
          />
          <div className="w-full">
            <UserCard user={user} session={sessionUserName} />
            <Tabs className="w-full" defaultValue={tab || "posts"}>
              <TabsList className="mb-4">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="lists">Lists</TabsTrigger>
                {
                  user?.writers?.length > 0 && (
                    <TabsTrigger value="writers">Writers</TabsTrigger>
                  )
                }
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>
              <TabsContent value="posts" className="w-full">
                <UserPosts
                  pinned={pinnedPost}
                  posts={posts}
                  user={user}
                  sessionUser={sessionUserName}
                  query={whereQuery}
                  search={search}
                  list={list}
                  className="w-full mt-6"
                />
              </TabsContent>
              <TabsContent value="lists">
                <div className="flex flex-col gap-10 my-6">
                  {sessionUserName?.id === user?.id && (
                    <Card>
                      <CardContent className="p-0">
                        <div className="flex md:flex-row flex-col">
                          <CardHeader className="w-full gap-4 h-full">
                            <Link
                              href={`/@${user?.username}`}
                              className="flex gap-2"
                            >
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={user?.image!} />
                                <AvatarFallback>
                                  {user?.name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <p className="text-sm flex items-center line-clamp-1">
                                {user?.name || user?.username}{" "}
                                {user?.verified && (
                                  <Icons.verified className="h-3.5 w-3.5 mx-0.5 fill-verified" />
                                )}
                              </p>
                            </Link>
                            <Link href={`/@${user?.username}/list/read-later`}>
                              <CardTitle className="line-clamp-1 my-2">
                                Read Later
                              </CardTitle>
                            </Link>
                            <div className="flex">
                              <div className="flex my-1.5">
                                <p className="text-muted-foreground text-xs">
                                  {formatNumberWithSuffix(bookmarks.length)} posts
                                </p>
                                <Icons.lock className="h-4 w-4 text-muted-foreground mx-2" />
                              </div>
                            </div>
                          </CardHeader>
                          <Link
                            href={`/@${user?.username}/list/read-later`}
                            className="pointer-events-none rounded-b-lg"
                          >
                            <div className="relative flex justify-end md:w-80 w-full overflow-hidden h-full min-h-[8rem]">
                              <div className="relative bg-muted self-stretch z-[3] border-r-[3px] border-background w-full pl-0 rounded-bl-lg md:rounded-none min-h-[8rem]">
                                <div className="h-full w-full">
                                  {bookmarks.filter(
                                    (p: any) => p.post.cover
                                  )[0] && (
                                      <Image
                                        src={
                                          bookmarks.filter(
                                            (p: any) => p.post.cover
                                          )[0].post.cover!
                                        }
                                        fill
                                        alt={"Read Later"}
                                        className="object-cover !relative h-full rounded-bl-lg md:rounded-none"
                                      />
                                    )}
                                </div>
                              </div>
                              <div className="relative bg-muted self-stretch w-full z-[2] border-r-[3px] border-background pl-2 -ml-20 min-h-[8rem]">
                                <div className="h-full w-full">
                                  {bookmarks.filter(
                                    (p: any) => p.post.cover
                                  )[1] && (
                                      <Image
                                        src={
                                          bookmarks.filter(
                                            (p: any) => p.post.cover
                                          )[1].post.cover!
                                        }
                                        fill
                                        alt={"Read Later"}
                                        className="object-cover !relative h-full"
                                      />
                                    )}
                                </div>
                              </div>
                              <div className="relative bg-muted self-stretch z-[1] border-none pl-2 -ml-32 w-full rounded-br-lg md:rounded-r-lg min-h-[8rem]">
                                <div className="h-full w-full">
                                  {bookmarks.filter(
                                    (p: any) => p.post.cover
                                  )[2] && (
                                      <Image
                                        src={
                                          bookmarks.filter(
                                            (p: any) => p.post.cover
                                          )[2].post.cover!
                                        }
                                        fill
                                        alt={"Read Later"}
                                        className="object-cover !relative h-full rounded-br-lg md:rounded-r-lg"
                                      />
                                    )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {lists.map((list) => (
                    <>
                      <ListCard list={list} session={sessionUserName} />
                    </>
                  ))}
                  {
                    sessionUserName?.id !== user.id && lists.length === 0 && (
                      <EmptyPlaceholder>
                        <EmptyPlaceholder.Icon name="list" />
                        <EmptyPlaceholder.Title>
                          No lists yet
                        </EmptyPlaceholder.Title>
                        <EmptyPlaceholder.Description>
                          When user creates a list, it will show up here.
                        </EmptyPlaceholder.Description>
                      </EmptyPlaceholder>
                    )
                  }
                </div>
              </TabsContent>
              <TabsContent value="writers">
                <div className="flex flex-col gap-6 my-6">
                  {user?.writers?.map(({ author }) => (
                    <div className="flex gap-4 w-full items-center" key={author.id}>
                      <div className="space-y-3">
                        <UserHoverCard user={author} >
                          <Link href={`/@${author.username}`} className="flex items-center">
                            <Avatar className="h-10 w-10 mr-2 md:mr-3">
                              <AvatarImage src={author.image || ''} alt={author.username} />
                              <AvatarFallback>{author.name?.charAt(0) || author.username?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {
                              author.name === null ? (
                                <div>
                                  <p className="text-sm font-medium leading-none">{author.username} {author.verified && (
                                    <Icons.verified className="h-3 w-3 inline fill-verified align-middle" />
                                  )}</p>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-sm font-medium leading-none">{author.name} {author.verified && (
                                    <Icons.verified className="h-3 w-3 inline fill-verified align-middle" />
                                  )}</p>
                                  <p className="text-sm text-muted-foreground">{author.username}</p>
                                </div>
                              )
                            }
                          </Link>
                        </UserHoverCard>
                      </div>
                    </div>
                  ))}
                </div >
              </TabsContent>
              <TabsContent value="about">
                <UserAbout user={user} session={sessionUserName} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div> */}
      <MobileBottomNavbar />
    </div>
  );
}
