"use server";
import postgres from "@/lib/postgres";
import { Comment } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionUser } from "./get-session-user";

async function verifyCurrentUserHasAccessToPost(postId: string) {
  try {
    const session = await getSessionUser();
    const count = await postgres.post.count({
      where: {
        id: postId,
        authorId: session?.id,
      },
    });

    return count > 0;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// TypeScript
export async function handleDelete(postid: string) {
  try {
    const post = await postgres.post.findUnique({
      where: {
        id: postid,
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    if (!(await verifyCurrentUserHasAccessToPost(post.id))) {
      return new Response(null, { status: 403 });
    }

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
      for (const comment of postWithRelations.comments) {
        await handleDeleteComment(comment.id);
      }

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

    return { status: 204 };
  } catch (error) {
    console.error(error);
    return { status: 500 };
  }
}
export async function handleDeleteDraft(postid: string) {
  try {
    const post = await postgres.draftPost.findFirst({
      where: {
        postId: postid,
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    if (!(await verifyCurrentUserHasAccessToPost(postid))) {
      return new Response(null, { status: 403 });
    }

    // Delete the post.
    await postgres.draftPost.delete({
      where: {
        id: post.id,
      },
    });

    return { status: 204 };
  } catch (error) {
    console.error(error);
    return { status: 500 };
  }
}

export async function handleDeleteComment(commentid: string, path?: string) {
  try {
    const replies = await postgres.comment
      .findMany({
        where: {
          parentId: commentid,
        },
        select: {
          id: true,
        },
      })
      .then((comments) => comments.map((comment) => comment.id));

    replies.forEach((reply) => deleteComment(reply));

    await deleteComment(commentid);

    return { status: 200 };
  } catch (error) {
    console.error(error);
    return { status: 500 };
  }
}

async function deleteComment(id: Comment["id"]) {
  await postgres.commentLike.deleteMany({
    where: {
      commentId: id,
    },
  });
  await postgres.commentLike.deleteMany({
    where: {
      commentId: {
        in: await postgres.comment
          .findMany({
            where: {
              parentId: id,
            },
            select: {
              id: true,
            },
          })
          .then((comments) => comments.map((comment) => comment.id)),
      },
    },
  });
  await postgres.comment.deleteMany({
    where: {
      parentId: id,
    },
  });

  await postgres.comment.delete({
    where: {
      id: id,
    },
  });
}
