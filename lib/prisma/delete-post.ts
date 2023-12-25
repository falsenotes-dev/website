"use server";
import { Post } from "@prisma/client";
import db from "../db";

export const deletePost = async ({ id }: { id: Post["id"] }) => {
  const post = await db.post.findUnique({
    where: { id },
  });

  if (!post) {
    return { error: "Post not found" };
  }

  try {
    const postWithRelations = await db.post.findUnique({
      where: { id: post.id },
      include: {
        comments: true,
        likes: true,
        drafts: true,
        tags: true,
        readedUsers: true,
        savedUsers: true,
        shares: true,
      },
    });

    // Disconnect all connections of the post
    if (postWithRelations) {
      await db.post.update({
        where: { id: post.id },
        data: {
          comments: {
            disconnect: postWithRelations.comments,
          },
          likes: {
            disconnect: postWithRelations.likes,
          },
          drafts: {
            disconnect: postWithRelations.drafts,
          },
          tags: {
            disconnect: postWithRelations.tags,
          },
          readedUsers: {
            disconnect: postWithRelations.readedUsers,
          },
          savedUsers: {
            disconnect: postWithRelations.savedUsers,
          },
          shares: {
            disconnect: postWithRelations.shares,
          },
        },
      });

      await db.like.deleteMany({
        where: {
          postId: post.id,
        },
      });
      await db.draftPost.deleteMany({
        where: {
          postId: post.id,
        },
      });
      await db.postTag.deleteMany({
        where: {
          postId: post.id,
        },
      });
      await db.readingHistory.deleteMany({
        where: {
          postId: post.id,
        },
      });
      await db.bookmark.deleteMany({
        where: {
          postId: post.id,
        },
      });
      await db.postShare.deleteMany({
        where: {
          postId: post.id,
        },
      });
    }

    // Delete the post.
    await db.post.delete({
      where: {
        id: post.id,
      },
    });

    return { status: 200 };
  } catch (error) {
    console.error(error);
    return { error };
  }
};
