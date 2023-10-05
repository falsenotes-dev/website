import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
     try {
          const data = await req.json();
          if (!data) {
               return new Response("No data provided", { status: 400 });
          }
          console.log("Received data:", data);

          const { post, content, author } = data;

    await sql`
      INSERT INTO comments (blogpostid, content, authorid)
      VALUES (${post}, ${content}, ${author})
      RETURNING *
    `;

    const { rows: authorDetails } = await sql`
      SELECT * FROM users WHERE id = ${author}
    `;
    const { rows: postDetails } = await sql`
      SELECT * FROM blogposts WHERE id = ${post}
    `;

    // Send a notification to the author of the post
    const notification = await fetch("/api/notifications/", {
      method: "POST",
      body: JSON.stringify({
        type: "comment",
        message: `${authorDetails[0].name} commented on your post "${postDetails[0].title}": ${content}`,
        user_id: postDetails[0].authorid,
      }),
    });

    return new Response("Comment created", { status: 201 });
  } catch (error) {
    console.error(error);
    NextResponse.json({ error: "Internal server error" }, { status: 500});
  }
}