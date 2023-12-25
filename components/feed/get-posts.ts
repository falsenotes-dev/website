import db from "@/lib/db";

export const fetchPosts = async () => {
  try {
    const popular = await db.post.findMany({
      orderBy: {
        views: "desc",
      },
      take: 3,
      include: {
        author: true,
        _count: {
          select: {
            likes: true,
            comments: true,
            savedUsers: true,
          },
        },
        tags: true,
      },
    });

    // return json from array
    return { popular: JSON.parse(JSON.stringify(popular)) };
  } catch (error) {
    return { error };
  }
};
