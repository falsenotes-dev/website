import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { remark } from "remark";
import html from "remark-html";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    // Get the 'slug' route parameter from the request object
    const username = params.username;
    const postUrl = req.nextUrl.searchParams.get("url");

    if (username === undefined || username === null) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (postUrl === undefined || postUrl === null) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    // Execute a query to fetch the specific user by name
    const author = await sql`
       SELECT * FROM users WHERE Username = ${username}
     `;
    const authorID = author.rows[0]?.userid;
    //Get author's posts
    const authorPosts = await sql`
        SELECT * FROM BlogPosts WHERE AuthorID = ${authorID}
      `;
    author.rows[0].posts = authorPosts.rows;

    // Get author's followers
    const followers = await sql`
        SELECT * FROM Follows WHERE FolloweeID = ${authorID}
      `;
    author.rows[0].followers = followers.rows;

    const result = await sql`
       SELECT * FROM BlogPosts WHERE AuthorID = ${authorID} AND Url = ${postUrl}
     `;

    // Use remark to convert markdown into HTML string
    const processedContent = await remark().use(html).process(result.rows[0].content);
    const contentHtml = processedContent.toString();

    result.rows[0].content = contentHtml;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    result.rows[0].author = author.rows[0];

    const comments = await sql`
           SELECT * FROM Comments WHERE BlogPostID= ${result.rows[0]?.postid}`;
    result.rows[0].comments = comments.rows;

    const commentsAuthors = await sql`
            SELECT * FROM Users WHERE UserID IN (SELECT AuthorID FROM Comments WHERE BlogPostID = ${result.rows[0]?.postid})`;
    
    comments.rows.forEach((comment) => {
      const author = commentsAuthors.rows.find((author) => author.userid === comment.authorid);
      comment.author = author;
    }
    );

    const commentsNum = await sql`
            SELECT COUNT(*) FROM Comments WHERE BlogPostID= ${result.rows[0]?.postid}`;
    result.rows[0].commentsNum = commentsNum.rows[0].count;
    const tags = await sql`
               SELECT * FROM Tags WHERE TagID IN (SELECT TagID FROM BlogPostTags WHERE BlogPostID = ${result.rows[0]?.postid})`;
    result.rows[0].tags = tags.rows;

    console.log("Query result:", result);
    // Return the user as JSON with status 200
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest, { params }: { params: { username: string } }){
  const username = params.username;
  const postid = req.nextUrl.searchParams.get("postid");

  if (username === undefined || username === null) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (postid === undefined || postid === null) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  try {
    const author = await sql`
       SELECT * FROM users WHERE Username = ${username}
     `;
    const authorID = author.rows[0]?.userid;

    //check if the post belongs to the user
    const result = await sql`
       SELECT * FROM BlogPosts WHERE AuthorID = ${authorID} AND PostID = ${postid}
     `;
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    //check if the post has comments and tags
    const comments = await sql`
       SELECT * FROM Comments WHERE BlogPostID = ${postid}
     `;
    const tags = await sql`
       SELECT * FROM BlogPostTags WHERE BlogPostID = ${postid}
     `;
    if (comments.rows.length !== 0) {
      await sql`
        DELETE FROM Comments WHERE BlogPostID = ${postid}
      `;
    }
    if (tags.rows.length !== 0) {
      await sql`
        DELETE FROM BlogPostTags WHERE BlogPostID = ${postid}
      `;
    }
    await sql`
       DELETE FROM BlogPosts WHERE PostID = ${postid}
     `;
    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}