"use server";

import { MembersFormData } from "@/components/settings/members/members-form";
import db from "../db";
import { getSessionUser } from "@/components/get-session-user";
import { User } from "@prisma/client";
import { create } from "../notifications/create-notification";
import { el } from "date-fns/locale";

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

        const isInvited = await db.publicationAuthor.create({
          data: {
            accessLevel,
            authorId,
            publicationId: session.id,
          },
        });

        // if invited during 1 week, delete notification
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        if (isInvited.createdAt > oneWeekAgo) {
          const notification = await db.notification.findFirst({
            where: {
              senderId: data.senderId,
              receiverId: data.receiverId,
              type: "blogInvite",
            },
            orderBy: {
              createdAt: "desc",
            },
            select: {
              id: true,
            },
          });

          if (notification) {
            return db.notification.delete({
              where: {
                id: notification.id,
              },
            });
          } else {
            return create(data);
          }
        }
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

export const removeAuthor = async ({ id }: { id: User["id"] }) => {
  const session = await getSessionUser();
  if (!session) {
    return;
  }
  try {
    const blog = await db.publicationAuthor.findFirst({
      where: {
        authorId: id,
        publicationId: session.id,
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

    return {
      message: "You have successfully removed the author",
      success: true,
    };
  } catch (error) {
    return {
      message: "There was an error trying to remove the author",
      success: false,
    };
  }
};

export const changeAccessLevel = async ({
  id,
  accessLevel,
}: {
  id: User["id"];
  accessLevel: string;
}) => {
  const session = await getSessionUser();
  if (!session) {
    return;
  }
  try {
    const blog = await db.publicationAuthor.findFirst({
      where: {
        authorId: id,
        publicationId: session.id,
      },
      select: {
        id: true,
      },
    });

    console.log(blog);

    await db.publicationAuthor.update({
      where: {
        id: blog?.id,
      },
      data: {
        accessLevel,
      },
    });

    return {
      message: "You have successfully changed the author's access level",
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "There was an error trying to change the author's access level",
      success: false,
    };
  }
};

export const changeVisibility = async ({
  id,
  visibility,
}: {
  id: User["id"];
  visibility: string;
}) => {
  const session = await getSessionUser();
  if (!session) {
    return;
  }
  try {
    const blog = await db.publicationAuthor.findFirst({
      where: {
        authorId: id,
        publicationId: session.id,
      },
      select: {
        id: true,
      },
    });

    await db.publicationAuthor.update({
      where: {
        id: blog?.id,
      },
      data: {
        visibility,
      },
    });

    return {
      message: "You have successfully changed the author's visibility",
      success: true,
    };
  } catch (error) {
    return {
      message: "There was an error trying to change the author's visibility",
      success: false,
    };
  }
};
