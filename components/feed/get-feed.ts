import postgres from "@/lib/postgres";
import { getSessionUser } from "../get-session-user";

export const fetchFeed = async ({page = 0}: {page?: number | undefined}) => {
     const user_id = await getSessionUser().then((user) => user?.id);
     try{
          const userFollowings = await postgres.follow.findMany({
               select: {
                    followingId: true,
               },
               where: {
                    followerId: user_id,
               },
          });
          const feed = await postgres.post.findMany({
               where: {
                    authorId: {
                         in: userFollowings.map((user) => user.followingId),
                    },
               },
               orderBy: {
                    createdAt: "desc",
               },
               take: 5,
               skip: page * 5,
               include: {
                    author: {
                         include: {
                              Followers: true,
                              Followings: true,
                         },
                    },
                    _count: {
                         select: {
                              likes: true,
                              comments: true,
                              savedUsers: true,
                         },
                    },
                    tags: true,
               },
          })
          await new Promise(resolve => setTimeout(resolve, 750))

          return JSON.parse(JSON.stringify(feed));
     } catch (error) {
          return { error }
     }
}