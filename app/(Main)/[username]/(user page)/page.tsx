import { getSessionUser } from "@/components/get-session-user";
import { notFound, redirect } from "next/navigation";
import db from "@/lib/db";
import { getUserPost } from "@/lib/prisma/posts";
import { getLists } from "@/lib/prisma/session";
import PostCard from "@/components/blog/post-card-v3";
import Tabs from "@/components/user/tab";
import { suggestedUsers } from "@/lib/prisma/suggestion";
import UserVerticalCard from "@/components/user-vertical-card";
import SuggestedUsers from "@/components/user/suggested-user";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

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

  const limit = pinnedPost ? 11 : 12;

  const { posts } = await getUserPost({ id: user.id, search, limit });

  const list = await getLists({ id: sessionUserName?.id });
  const firstPost = pinnedPost || posts[0];
  const restPosts = !pinnedPost ? posts.slice(1, 12) : posts;
  const { users: whoToFollow } = await suggestedUsers({ id: user.id, limit: 10 });
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
      <Button variant="outline" className="w-full md:w-max mt-10" size="lg" asChild>
        <Link href={`/@${user.username}/posts`}>See all posts</Link>
      </Button>
      <Separator className="my-10" />
      <SuggestedUsers users={whoToFollow} session={sessionUserName} />
    </>
  );
}
