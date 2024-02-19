import { getSessionUser } from "@/components/get-session-user";
import { notFound, redirect } from "next/navigation";
import db from "@/lib/db";
import { getUserPost } from "@/lib/prisma/posts";
import { getLists } from "@/lib/prisma/session";
import { MobileBottomNavbar } from "@/components/navbar/mobile-bottom-navbar";
import PostCard from "@/components/blog/post-card-v3";
import Tabs from "@/components/user/tab";
import { suggestedUsers } from "@/lib/prisma/suggestion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import UserVerticalCard from "@/components/user-vertical-card";
import SuggestedUsers from "@/components/user/suggested-user";
import { EmptyPlaceholder } from "@/components/empty-placeholder";

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
  const { users: whoToFollow } = await suggestedUsers({ id: user.id, limit: 10 });
  console.log(whoToFollow);
  return (
    <>
      <Tabs user={user} />
      {
        posts.length > 0 ? (
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
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>
              No posts yet
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              When user creates a post, it will show up here.
            </EmptyPlaceholder.Description>
          </EmptyPlaceholder>
        )
      }
      <SuggestedUsers users={whoToFollow} session={sessionUserName} />
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
      <MobileBottomNavbar session={sessionUserName} />
    </>
  );
}
