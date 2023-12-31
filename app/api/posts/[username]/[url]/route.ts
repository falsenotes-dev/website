import db from "@/lib/db";
import { tr } from "date-fns/locale";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string; url: string } }
) {
  try {
    // Get the 'slug' route parameter from the request object
    const username = params.username;
    const postUrl = params.url;

    if (username === undefined || username === null) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (postUrl === undefined || postUrl === null) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    // Execute a query to fetch the specific user by name
    const author = await db.user.findFirst({
      where: {
        username: username,
      },
    });
    if (!author) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const authorID = author?.id;

    const result = await db.post.findUnique({
      where: {
        url: postUrl,
        authorId: authorID,
      },
      include: {
        author: true,
      },
    });

    if (!result) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    // Return the user as JSON with status 200
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
