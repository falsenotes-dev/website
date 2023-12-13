"use server";

import { getSessionUser } from "@/components/get-session-user";
import postgres from "../postgres";
import { Post } from "@prisma/client";

export const clearHistory = async () => {
  const user = await getSessionUser();
  if (!user) return { success: false, message: "Not logged in" };
  try {
    await postgres.readingHistory.deleteMany({
      where: { userId: user.id },
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
    const history = await postgres.readingHistory.findFirst({
      where: { userId: user.id, postId },
    });
    await postgres.readingHistory.delete({
      where: { id: history?.id },
    });
    return { success: true, message: "History removed" };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Error removing history" };
  }
};
