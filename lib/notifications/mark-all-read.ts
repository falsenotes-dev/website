"use server";
import { getSessionUser } from "@/components/get-session-user";
import db from "../db";

export const markAllRead = async () => {
  const session = await getSessionUser();
  if (!session) return;

  try {
    await db.notification.updateMany({
      where: {
        receiverId: session.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return true;
  } catch (error: any) {
    console.log(error);
    return false;
  }
};
