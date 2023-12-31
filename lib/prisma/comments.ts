"use server";
import { getSessionUser } from "@/components/get-session-user";
import db from "../db";
import { Post } from "@prisma/client";

export const allowComments = async (
  postId: Post["id"],
  commentsOn: boolean
) => {
  const session = await getSessionUser();

  if (!session) {
    return { status: 401 };
  }

  try {
    await db.post.update({
      where: {
        id: postId,
      },
      data: {
        allowComments: commentsOn,
      },
    });

    return { status: 200 };
  } catch (error) {
    return { status: 500 };
  }
};
