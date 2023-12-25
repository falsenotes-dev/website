import db from "@/lib/db";
import { tr } from "date-fns/locale";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId")?.toString();
  try {
    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        Followings: {
          include: {
            follower: true,
          },
        },
        bookmarks: true,
        _count: {
          select: { tagfollower: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const tags = await db.tagFollow.findMany({
      where: {
        followerId: user.id,
      },
      include: {
        tag: true,
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });

    const userJson = JSON.parse(JSON.stringify(user));
    userJson.tags = tags;

    return NextResponse.json(userJson, { status: 200 });
  } catch (error) {
    console.log(error);
  }
}
