'use server'

import { getSessionUser } from "@/components/get-session-user";
import { Post } from "@prisma/client";
import postgres from "../postgres";

export const allowLikes = async (postId: Post['id'], likesOn: boolean) => {
     const session = await getSessionUser();

     if (!session) {
          return { status: 401 };
     }

     try {
          await postgres.post.update({
               where: {
                    id: postId,
               },
               data: {
                    allowLikes: likesOn,
               },
          });

          return { status: 200 };
     } catch (error) {
          return { status: 500 };
     }
}