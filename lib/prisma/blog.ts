"use server";

import { MembersFormData } from "@/components/settings/members-form";
import db from "../db";
import { getSessionUser } from "@/components/get-session-user";
import { User } from "@prisma/client";
import { create } from "../notifications/create-notification";

export const addAuthors = async ({ data }: { data: MembersFormData }) => {
  const session = await getSessionUser();
  if (!session) {
    return;
  }
  try {
    const { members, accessLevel } = data;

    const authorIds = members.map((member) => member.id);
    const authorPromises = authorIds.map(async (authorId) => {
      //if author is already an author, update their access level
      const existingAuthor = await db.publicationAuthor.findFirst({
        where: {
          authorId,
          publicationId: session.id,
        },
      });
      if (existingAuthor) {
        return db.publicationAuthor.update({
          where: {
            id: existingAuthor.id,
          },
          data: {
            accessLevel,
          },
        });
      } else {
        const data = {
          type: "blogInvite",
          receiverId: authorId,
          senderId: session?.id,
          url: "/settings/members",
          content: session?.name || session?.username,
        };

        await db.publicationAuthor.create({
          data: {
            accessLevel,
            authorId,
            publicationId: session.id,
          },
        });

        return create(data);
      }
    });
    await Promise.all(authorPromises);
    return {
      message: "You have successfully added new members",
      success: true,
    };
  } catch (error) {
    return {
      message: "There was an error trying to add new members",
      success: false,
    };
  }
};

export const leaveBlog = async ({ id }: { id: User["id"] }) => {
  const session = await getSessionUser();
  if (!session) {
    return;
  }
  try {
    const blog = await db.publicationAuthor.findFirst({
      where: {
        authorId: session.id,
        publicationId: id,
      },
      select: {
        id: true,
      },
    });

    await db.publicationAuthor.delete({
      where: {
        id: blog?.id,
      },
    });

    return { message: "You have successfully left the blog", success: true };
  } catch (error) {
    return {
      message: "There was an error trying to leave the blog",
      success: false,
    };
  }
};
