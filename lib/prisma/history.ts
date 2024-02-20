"use server";

import { getSessionUser } from "@/components/get-session-user";
import db from "../db";
import { Post } from "@prisma/client";

export const clearHistory = async () => {
  const user = await getSessionUser();
  if (!user) return { success: false, message: "Not logged in" };
  try {
    await db.readingHistory.updateMany({
      where: { userId: user.id },
      data: { erased: true },
    });
    return { success: true, message: "History cleared" };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Error clearing history" };
  }
};

export const removeHistory = async ({ postId }: { postId: Post["id"] }) => {
  const user = await getSessionUser();
  if (!user) return { success: false, message: "Not logged in" };
  try {
    const history = await db.readingHistory.findFirst({
      where: { userId: user.id, postId },
    });
    await db.readingHistory.update({
      where: { id: history?.id },
      data: { erased: true },
    });
    return { success: true, message: "History removed" };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Error removing history" };
  }
};
