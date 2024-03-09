"use server";
import { getSessionUser } from "@/components/get-session-user";
import { notFound } from "next/navigation";
import db from "@/lib/db";
import Post from "@/components/blog/post";
import { cookies } from "next/headers";
import { getLists } from "@/lib/prisma/session";
import { getPostData } from "@/lib/fetchers";

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
    },
  });
  if (!author) return notFound();

  const post = await getPostData(decodedUsername, params.url, author);

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
