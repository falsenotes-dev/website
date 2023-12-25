"use server";
import db from "@/lib/db";
import { Notification } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const notificationRead = async (id: Notification["id"]) => {
  try {
    await db.notification.update({
      where: {
        id: id,
      },
      data: {
        read: true,
      },
    });
    revalidatePath(`/notifications`);
  } catch (error) {
    console.log(error);
  }
};
