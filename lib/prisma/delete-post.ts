"use server";
import { Post } from "@prisma/client";
import postgres from "../postgres";

export const deletePost = async ({ id }: { id: Post["id"] }) => {
  const post = await postgres.post.findUnique({
    where: { id },
  });

  if (!post) {
    return { error: "Post not found" };
  }

  try {
    const postWithRelations = await postgres.post.findUnique({
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
      await postgres.post.update({
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

      await postgres.like.deleteMany({
        where: {
          postId: post.id,
        },
      });
      await postgres.draftPost.deleteMany({
        where: {
          postId: post.id,
        },
      });
      await postgres.postTag.deleteMany({
        where: {
          postId: post.id,
        },
      });
      await postgres.readingHistory.deleteMany({
        where: {
          postId: post.id,
        },
      });
      await postgres.bookmark.deleteMany({
        where: {
          postId: post.id,
        },
      });
      await postgres.postShare.deleteMany({
        where: {
          postId: post.id,
        },
      });
    }

    // Delete the post.
    await postgres.post.delete({
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
