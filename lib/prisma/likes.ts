"use server";

import { getSessionUser } from "@/components/get-session-user";
import { Post } from "@prisma/client";
import db from "../db";

export const allowLikes = async (postId: Post["id"], likesOn: boolean) => {
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
        allowLikes: likesOn,
      },
    });

    return { status: 200 };
  } catch (error) {
    return { status: 500 };
  }
};
