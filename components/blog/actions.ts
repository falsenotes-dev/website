import db from "@/lib/db";

// actions.ts
export async function incrementPostViews({
  post,
  author,
}: {
  post: string;
  author: string;
}) {
  const cookieName = `post_views_${author}_${post}`;

  // Make an API request to increment the view count
  await db.post.update({
    where: {
      url: post,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });

  // Prepare the cookie information to be set
  const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now
  return {
    name: cookieName,
    value: "true",
    path: `/@${author}/${post}`,
    expires: expirationDate,
    secure: true,
  };
}
