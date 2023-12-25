import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const baseQuery = {
  include: {
    Followers: true,
    Followings: true,
  },
};

export async function GET(request: NextRequest) {
  const pageString = request.nextUrl.searchParams.get("page");
  const page = pageString ? parseInt(pageString) : 0;
  const search = request.nextUrl.searchParams.get("search");
  const limitString = request.nextUrl.searchParams.get("limit");
  const limit = limitString ? parseInt(limitString) : 10;
  try {
    const tags = await db.tag.findMany({
      where:
        search != undefined
          ? {
              name: {
                contains: search.replace(/\s+/g, "-").toLowerCase(),
                mode: "insensitive",
              },
            }
          : {},
      take: limit,
      skip: page * limit,
      orderBy: {
        name: "asc",
      },
      include: {
        _count: { select: { posts: true, followingtag: true } },
      },
    });

    if (typeof search === "string") {
      //sort by number of posts and then by number of followers
      tags.sort((a, b) => {
        if (a._count.posts > b._count.posts) {
          return -1;
        }
        if (a._count.posts < b._count.posts) {
          return 1;
        }
        if (a._count.followingtag > b._count.followingtag) {
          return -1;
        }
        if (a._count.followingtag < b._count.followingtag) {
          return 1;
        }
        return 0;
      });
    }

    return NextResponse.json({ tags: tags }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
