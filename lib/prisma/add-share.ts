"use server";
import { Post, PostShare } from "@prisma/client";
import db from "../db";

export const addShare = async (postId: PostShare["postId"]) => {
  if (!postId) return;
  try {
    await db.postShare.create({
      data: {
        postId,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
