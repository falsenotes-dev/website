"use server";
import { getSessionUser } from "@/components/get-session-user";
import db from "../db";
import { deletePost } from "./delete-post";
import { Comment } from "@prisma/client";

export const deleteProfile = async () => {
  try {
    const session = await getSessionUser();

    if (!session) {
      return { status: 401 };
    }

    const userId = session.id;

    const userComments = await db.comment
      .findMany({
        where: {
          authorId: userId,
        },
      })
      .then((comments) => comments.map((comment) => comment.id));

    userComments.forEach((comment) => deleteComment(comment));

    await db.userSettings.delete({
      where: {
        userId: userId,
      },
    });

    await db.follow.deleteMany({
      where: {
        followingId: userId,
      },
    });

    await db.follow.deleteMany({
      where: {
        followerId: userId,
      },
    });

    const userPosts = await db.post.findMany({
      where: {
        authorId: userId,
      },
    });

    await db.like.deleteMany({
      where: {
        authorId: userId,
      },
    });

    await db.commentLike.deleteMany({
      where: {
        authorId: userId,
      },
    });

    for (const post of userPosts) {
      await deletePost({ id: post.id });
    }

    await db.bookmark.deleteMany({
      where: {
        userId: userId,
      },
    });

    await db.notification.deleteMany({
      where: {
        receiverId: userId,
      },
    });

    await db.tagFollow.deleteMany({
      where: {
        followerId: userId,
      },
    });

    await db.readingHistory.deleteMany({
      where: {
        userId: userId,
      },
    });

    await db.publicationAuthor.deleteMany({
      where: {
        authorId: userId,
      },
    });

    await db.publicationFollow.deleteMany({
      where: {
        followerId: userId,
      },
    });

    await db.listSaving.deleteMany({
      where: {
        userId: userId,
      },
    });

    await db.list.deleteMany({
      where: {
        authorId: userId,
      },
    });

    await db.user.delete({
      where: {
        id: userId,
      },
    });
    return { status: 200 };
  } catch (error) {
    console.log(error);
    return { status: 500 };
  }
};

async function deleteComment(id: Comment["id"]) {
  const replies = await db.comment
    .findMany({
      where: {
        parentId: id,
      },
      select: {
        id: true,
      },
    })
    .then((comments) => comments.map((comment) => comment.id));

  replies.forEach((reply) => deleteComment(reply));
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
