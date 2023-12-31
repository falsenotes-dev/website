import { getSessionUser } from "@/components/get-session-user";
import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

const baseQuery = {
  include: {
    author: true,
    savedUsers: true,
    _count: {
      select: {
        likes: true,
        savedUsers: true,
        readedUsers: true,
        shares: true,
        comments: true,
      },
    },
    tags: {
      take: 1,
      include: {
        tag: true,
      },
    },
  },
};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSessionUser();
  const userId = params.id;

  const pageString = req.nextUrl.searchParams.get("page");
  const page = pageString ? parseInt(pageString) : 0;
  const search = req.nextUrl.searchParams.get("search");
  const limit = Number(req.nextUrl.searchParams.get("limit")) || 10;
  const posts = await db.post.findMany({
    ...baseQuery,
    where: {
      ...(session?.id === userId
        ? { pinned: false }
        : { published: true, pinned: false }),
      authorId: userId,
      published: session?.id === userId ? undefined : true,
      ...(search ? { title: { contains: search, mode: "insensitive" } } : {}),
    },
    take: Number(limit),
    skip: Number(page) * Number(limit),
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json({ posts }, { status: 200 });
}
