"use server";
import { getSessionUser } from "@/components/get-session-user";
import db from "../db";
import { getLists } from "./session";
import { Bookmark, List, Post } from "@prisma/client";

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

    const existingList = await db.list.findFirst({
      where: { slug },
    });

    if (existingList) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    const list = await db.list.create({
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
    await db.postList.deleteMany({
      where: { listId: id },
    });

    await db.listSaving.deleteMany({
      where: { listId: id },
    });

    await db.list.delete({
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
    await db.list.update({
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
};

export const makeListPrivate = async ({ id }: { id: string }) => {
  const session = await getSessionUser();

  if (!session) {
    return {
      success: false,
      message: "You must be logged in to make a list private",
    };
  }

  try {
    await db.list.update({
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
};

export const updateList = async ({
  data,
  id,
}: {
  data: ListForm;
  id: string;
}) => {
  const session = await getSessionUser();

  if (!session) {
    return {
      success: false,
      message: "You must be logged in to update a list",
    };
  }

  try {
    const list = await db.list.update({
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
};

export const addPostToList = async ({ listId, postId }: any) => {
  const session = await getSessionUser();

  if (!session) {
    return {
      success: false,
      message: "You must be logged in to add a post to a list",
    };
  }

  try {
    const isPostInList = await db.postList.findFirst({
      where: { listId, postId },
    });

    if (isPostInList) {
      await db.postList.delete({ where: { id: isPostInList.id } });
      return { success: true, message: "Post removed from list" };
    } else {
      await db.postList.create({
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

export const saveList = async ({ id }: any) => {
  const session = await getSessionUser();

  if (!session) {
    return {
      success: false,
      message: "You must be logged in to save a list",
    };
  }

  try {
    const isListSaved = await db.listSaving.findFirst({
      where: { listId: id, userId: session.id },
    });

    if (isListSaved) {
      await db.listSaving.delete({ where: { id: isListSaved.id } });
      return { success: true, message: "List removed from Your Library" };
    } else {
      await db.listSaving.create({
        data: {
          listId: id,
          userId: session.id,
        },
      });

      return { success: true, message: "List saved to Your Library" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error saving list" };
  }
};

export const searchLists = async ({
  search,
  limit = 10,
  page = 0,
}: {
  search?: string;
  limit?: number;
  page?: number;
}) => {
  const lists = await db.list.findMany({
    where:
      search !== undefined
        ? {
            visibility: "public",
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : { visibility: "public" },
    take: limit,
    skip: page * limit,
    include: {
      _count: { select: { posts: true, savedUsers: true } },
      author: true,
      posts: {
        select: {
          post: {
            select: {
              cover: true,
            },
          },
        },
        take: 3,
      },
      savedUsers: true,
    },
    orderBy:
      search !== undefined
        ? {
            savedUsers: { _count: "desc" },
          }
        : {},
  });

  return { lists: JSON.parse(JSON.stringify(lists)) };
};

// get list by its post's tags
export const getListByTags = async ({
  tags,
  limit = 10,
  page = 0,
}: {
  tags: string[];
  limit?: number;
  page?: number;
}) => {
  const lists = await db.list.findMany({
    where: {
      visibility: "public",
      posts: {
        some: {
          post: {
            tags: {
              some: {
                tagId: {
                  in: tags,
                },
              },
            },
          },
        },
      },
    },
    take: limit,
    skip: page * limit,
    include: {
      _count: { select: { posts: true, savedUsers: true } },
      author: true,
      posts: {
        select: {
          post: {
            select: {
              cover: true,
            },
          },
        },
        take: 3,
      },
      savedUsers: true,
    },
    orderBy: {
      savedUsers: { _count: "desc" },
    },
  });

  return { lists: JSON.parse(JSON.stringify(lists)) };
};

// get list by its post's tag id
export const getListByTagId = async ({
  tagId,
  limit = 10,
  page = 0,
}: {
  tagId: string;
  limit?: number;
  page?: number;
}) => {
  const lists = await db.list.findMany({
    where: {
      visibility: "public",
      posts: {
        some: {
          post: {
            tags: {
              some: {
                tagId,
              },
            },
          },
        },
      },
    },
    take: limit,
    skip: page * limit,
    include: {
      _count: { select: { posts: true, savedUsers: true } },
      author: true,
      posts: {
        select: {
          post: {
            select: {
              cover: true,
            },
          },
        },
        take: 3,
      },
      savedUsers: true,
    },
    orderBy: {
      savedUsers: { _count: "desc" },
    },
  });

  return { lists: JSON.parse(JSON.stringify(lists)) };
};
