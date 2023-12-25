"use server";
import { getSessionUser } from "@/components/get-session-user";
import { Post } from "@prisma/client";
import db from "../db";

export const pin = async (postId: Post["id"]) => {
  const session = await getSessionUser();

  if (!session) {
    return { status: 401 };
  }

  try {
    await db.post.updateMany({
      where: {
        authorId: session.id,
      },
      data: {
        pinned: false,
      },
    });

    await db.post.update({
      where: {
        id: postId,
      },
      data: {
        pinned: true,
      },
    });

    return { status: 200 };
  } catch (error) {
    return { status: 500 };
  }
};

export const unPin = async (postId: Post["id"]) => {
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
        pinned: false,
      },
    });

    return { status: 200 };
  } catch (error) {
    return { status: 500 };
  }
};
