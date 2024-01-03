"use server";
import { getSessionUser } from "@/components/get-session-user";
import { notFound } from "next/navigation";
import db from "@/lib/db";
import Post from "@/components/blog/post";
import { cookies } from "next/headers";
import { getLists } from "@/lib/prisma/session";

export default async function PostView({
  params,
  searchParams,
}: {
  params: { username: string; url: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const commentsOpen =
    typeof searchParams.commentsOpen === "string"
      ? searchParams.commentsOpen
      : undefined;

  const decodedUsername = decodeURIComponent(params.username);
  const author = await db.user.findFirst({
    where: {
      username: decodedUsername.substring(1),
    },
    include: {
      _count: { select: { posts: true, Followers: true, Followings: true } },
      Followers: true,
      Followings: true,
    },
  });
  if (!author) return notFound();
  let post = await db.post.findFirst({
    where: {
      url: params.url,
      OR: [
        {
          authorId: author?.id,
        },
        {
          publicationId: author?.id,
        },
      ],
    },
    include: {
      comments: {
        where: { parentId: null },
        include: {
          replies: {
            include: {
              _count: { select: { replies: true, likes: true } },
            },
          },
          _count: { select: { replies: true, likes: true } },
          likes: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      likes: true,

      readedUsers: true,
      author: {
        include: {
          _count: {
            select: { posts: true, Followers: true, Followings: true },
          },
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      publication: {
        include: {
          Followers: true,
          Followings: true,
        },
      },
      savedUsers: true,
      _count: { select: { savedUsers: true, likes: true, comments: true } },
    },
  });

  //if post has not publicationId or publicationId is equal to authorId
  if (post?.publicationId && decodedUsername.substring(1) === post?.author?.username) {
    return notFound();
  }

  if (post?.publicationId === null) {
    post = await await db.post.findFirst({
      where: {
        url: params.url,
        authorId: author?.id,
      },
      include: {
        comments: {
          where: { parentId: null },
          include: {
            replies: {
              include: {
                _count: { select: { replies: true, likes: true } },
              },
            },
            _count: { select: { replies: true, likes: true } },
            likes: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: true,

        readedUsers: true,
        author: {
          include: {
            _count: { select: { posts: true, Followers: true, Followings: true } },
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        publication: {
          include: {
            Followers: true,
            Followings: true,
          },
        },
        savedUsers: true,
        _count: { select: { savedUsers: true, likes: true, comments: true } },
      },
    });
  }

  if (!post) return notFound();

  const sessionUser = await getSessionUser();

  if (post?.authorId !== sessionUser?.id) {
    if (!post?.published) return notFound();
  }

  const published =
    sessionUser?.id === post?.authorId &&
    (searchParams.published === "true" ? true : false);

  const cookkies = cookies();
  const hasViewed = cookkies.has(`post_views_${author?.username}_${post.url}`);

  if (!hasViewed) {
    await fetch(
      `${process.env.DOMAIN}/api/posts/${author?.username}/views/?url=${post.url}`,
      {
        method: "POST",
      }
    );
  }
  if (sessionUser) {
    //check if the user has readed the post
    const hasReaded = await db.readingHistory.findFirst({
      where: {
        postId: post?.id,
        userId: sessionUser?.id,
      },
    });
    if (!hasReaded) {
      await db.readingHistory.create({
        data: {
          postId: post?.id,
          userId: sessionUser?.id,
        },
      });
    } else {
      await db.readingHistory.update({
        where: {
          id: hasReaded?.id,
        },
        data: {
          updatedAt: new Date(),
          createdAt: new Date(),
        },
      });
    }
  }

  const list = await getLists({ id: sessionUser?.id });
  return (
    <Post
      post={post}
      author={post.author}
      sessionUser={sessionUser}
      tags={post.tags}
      comments={Boolean(commentsOpen)}
      published={published}
      list={list}
    />
  );
}
