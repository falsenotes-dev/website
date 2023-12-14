"use server";
import { getSessionUser } from "@/components/get-session-user";
import postgres from "../postgres";
import { getLists } from "./session";
import { Bookmark, Post } from "@prisma/client";

type ListForm = {
  name: string;
  description?: string;
  public?: boolean;
};

export const checkPostInList = async ({
  postId,
}: {
  id: string | undefined;
  postId: string | undefined;
}) => {
  const session = await getSessionUser();

  //check if post is in lists of user
  const { lists, bookmarks } = await getLists({ id: session?.id });

  return (
    lists?.some((list: any) =>
      list.posts?.some((post: Post) => post.id === postId)
    ) || bookmarks?.some((post: Bookmark) => post.postId === postId)
  );
};

export const createList = async ({ data }: { data: ListForm }) => {
  const session = await getSessionUser();

  if (!session) {
    return {
      success: false,
      message: "You must be logged in to create a list",
    };
  }

  try {
    let slug = data.name
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");

    const existingList = await postgres.list.findFirst({
      where: { slug },
    });

    if (existingList) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    const list = await postgres.list.create({
      data: {
        name: data.name,
        description: data.description || null,
        visibility: data.public ? "public" : "private",
        slug,
        authorId: session.id,
      },
    });

    return { list, success: true, message: "List created" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error creating list" };
  }
};

export const deleteList = async ({ id }: { id: string }) => {
  const session = await getSessionUser();

  if (!session) {
    return {
      success: false,
      message: "You must be logged in to delete a list",
    };
  }

  try {
    await postgres.list.delete({
      where: { id },
    });

    return { success: true, message: "List deleted" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error deleting list" };
  }
};

export const makeListPublic = async ({ id }: { id: string }) => {
  const session = await getSessionUser();

  if (!session) {
    return {
      success: false,
      message: "You must be logged in to make a list public",
    };
  }

  try {
    await postgres.list.update({
      where: { id },
      data: {
        visibility: "public",
      },
    });

    return { success: true, message: "List made public" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error making list public" };
  }
}

export const makeListPrivate = async ({ id }: { id: string }) => {
  const session = await getSessionUser();

  if (!session) {
    return {
      success: false,
      message: "You must be logged in to make a list private",
    };
  }

  try {
    await postgres.list.update({
      where: { id },
      data: {
        visibility: "private",
      },
    });

    return { success: true, message: "List made private" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error making list private" };
  }
}

export const updateList = async ({ data, id }: { data: ListForm; id: string }) => {
  const session = await getSessionUser();

  if (!session) {
    return {
      success: false,
      message: "You must be logged in to update a list",
    };
  }

  try {
    const list = await postgres.list.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || null,
        visibility: data.public ? "public" : "private",
      },
    });

    return { list, success: true, message: "List updated" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error updating list" };
  }
}

export const addPostToList = async ({ listId, postId }: any) => {
  const session = await getSessionUser();

  if (!session) {
    return {
      success: false,
      message: "You must be logged in to add a post to a list",
    };
  }

  try {
    const isPostInList = await postgres.postList.findFirst({
          where: { listId, postId },
     });

    if (isPostInList) {
      await postgres.postList.delete({ where: { id: isPostInList.id } });
      return { success: true, message: "Post removed from list" };
    } else {
      await postgres.postList.create({
        data: {
          listId,
          postId,
        },
      });

      return { success: true, message: "Post added to list" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error adding post to list" };
  }
};
