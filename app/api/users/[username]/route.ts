import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;

    if (username === undefined || username === null) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Execute a query to fetch the specific user by name
    const result = await db.user.findFirst({
      include: {
        posts: {
          where: {
            published: true,
          },
        },
        Followers: {
          include: {
            following: true,
          },
        },
        Followings: {
          include: {
            follower: true,
          },
        },
        _count: {
          select: {
            posts: {
              where: {
                published: true,
              },
            },
            Followers: true,
            Followings: true,
          },
        },
      },
      where: {
        OR: [{ username: username }, { name: username }],
      },
    });

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 404 });
  }
}
