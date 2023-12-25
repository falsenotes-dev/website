"use server";
import db from "@/lib/db";
import { Comment } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionUser } from "./get-session-user";

async function verifyCurrentUserHasAccessToPost(postId: string) {
  try {
    const session = await getSessionUser();
    const count = await db.post.count({
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
    const post = await db.post.findUnique({
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
      for (const comment of postWithRelations.comments) {
        await handleDeleteComment(comment.id);
      }

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

    return { status: 204 };
  } catch (error) {
    console.error(error);
    return { status: 500 };
  }
}
export async function handleDeleteDraft(postid: string) {
  try {
    const post = await db.draftPost.findFirst({
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
    await db.draftPost.delete({
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
    const replies = await db.comment
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
  await db.commentLike.deleteMany({
    where: {
      commentId: id,
    },
  });
  await db.commentLike.deleteMany({
    where: {
      commentId: {
        in: await db.comment
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
  await db.comment.deleteMany({
    where: {
      parentId: id,
    },
  });

  await db.comment.delete({
    where: {
      id: id,
    },
  });
}
