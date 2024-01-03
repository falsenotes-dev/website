"use server";
import { config } from "@/app/auth";
import db from "@/lib/db";
import { getServerSession } from "next-auth";

export async function getSessionUser() {
  try {
    const session = await getServerSession(config);
    if (!session || typeof session.user !== "object") {
      return null;
    }
    const { user } = session;
    const result = await db.user.findFirst({
      where: {
        OR: [
          {
            username: user?.username as string,
          },
          {
            image: user?.image,
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        username: true,
        publications: {
          select: {
            publicationId: true,
            accessLevel: true,
          },
        },
      },
    });
    return result;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}
