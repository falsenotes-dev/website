"use server";

import { Comment } from "@prisma/client";
import db from "../db";

export const getComment = async (id: Comment["id"]) => {
  return await db.comment.findUnique({
    where: {
      id: id,
    },
    include: {
      author: {
        include: {
          _count: {
            select: { posts: true, Followers: true, Followings: true },
          },
        },
      },
      replies: {
        include: {
          author: {
            include: {
              _count: {
                select: { posts: true, Followers: true, Followings: true },
              },
            },
          },
          _count: { select: { replies: true, likes: true } },
          likes: true,
        },
      },
      _count: { select: { replies: true, likes: true } },
      likes: true,
    },
  });
};
