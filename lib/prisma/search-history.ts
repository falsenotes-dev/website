"use server";

import { getSessionUser } from "@/components/get-session-user";
import db from "../db";

export const addSearchHistory = async (query: string) => {
  const session = await getSessionUser();

  if (!session) return;

  const { id } = session;

  //check if search history already exists
  const searchHistory = await db.userSearchHistory.findFirst({
    where: { search: query, userId: id },
  });

  if (searchHistory) {
    return;
  } else {
    await db.userSearchHistory.create({
      data: {
        search: query,
        userId: id,
      },
    });
  }
};

export const removeSearchHistory = async (query: string) => {
  const session = await getSessionUser();

  if (!session) return;

  const { id } = session;

  const searchHistory = await db.userSearchHistory.findFirst({
    where: { search: query, userId: id },
  });

  if (searchHistory) {
    await db.userSearchHistory.delete({
      where: { id: searchHistory.id },
    });
  }
};
