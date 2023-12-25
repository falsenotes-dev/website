import db from "@/lib/db";
import { getSessionUser } from "../get-session-user";

export const fetchPosts = async () => {
  try {
    const user = await getSessionUser();
    if (!user) {
      return null;
    }
    const userid = user.id;
    const topUsers = await db.user.findMany({
      include: {
        Followers: true,
        Followings: true,
        posts: true,
      },
      take: 5,
      where: {
        id: {
          not: userid,
        },
        Followings: {
          none: {
            followerId: userid,
          },
        },
      },
      orderBy: {
        Followers: {
          _count: "desc",
        },
      },
    });

    // return json from array
    return { user: JSON.parse(JSON.stringify(topUsers)) };
  } catch (error) {
    return { error };
  }
};
