"use server";
import { getSessionUser } from "@/components/get-session-user";
import postgres from "../postgres";
import { deletePost } from "./delete-post";
import { Comment } from "@prisma/client";

export const deleteProfile = async () => {
  try {
    const session = await getSessionUser();

    if (!session) {
      return { status: 401 };
    }

    const userId = session.id;

    const userComments = await postgres.comment
      .findMany({
        where: {
          authorId: userId,
        },
      })
      .then((comments) => comments.map((comment) => comment.id));

    userComments.forEach((comment) => deleteComment(comment));

    await postgres.userSettings.delete({
      where: {
        userId: userId,
      },
    });

    await postgres.follow.deleteMany({
      where: {
        followingId: userId,
      },
    });

    await postgres.follow.deleteMany({
      where: {
        followerId: userId,
      },
    });

    const userPosts = await postgres.post.findMany({
      where: {
        authorId: userId,
      },
    });

    await postgres.like.deleteMany({
      where: {
        authorId: userId,
      },
    });

    await postgres.commentLike.deleteMany({
      where: {
        authorId: userId,
      },
    });

    for (const post of userPosts) {
      await deletePost({ id: post.id });
    }

    await postgres.bookmark.deleteMany({
      where: {
        userId: userId,
      },
    });

    await postgres.notification.deleteMany({
      where: {
        receiverId: userId,
      },
    });

    await postgres.tagFollow.deleteMany({
      where: {
        followerId: userId,
      },
    });

    await postgres.readingHistory.deleteMany({
      where: {
        userId: userId,
      },
    });

    await postgres.publicationAuthor.deleteMany({
      where: {
        authorId: userId,
      },
    });

    await postgres.publicationFollow.deleteMany({
      where: {
        followerId: userId,
      },
    });

    await postgres.listSaving.deleteMany({
      where: {
        userId: userId,
      },
    });

    await postgres.list.deleteMany({
      where: {
        authorId: userId,
      },
    });

    await postgres.user.delete({
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
  const replies = await postgres.comment
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
