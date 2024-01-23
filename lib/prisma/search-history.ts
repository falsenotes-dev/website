"use server";

import { getSessionUser } from "@/components/get-session-user";
import db from "../db";

export const addSearchHistory = async (query: string) => {
  const session = await getSessionUser();

  if (!session) return;

  const { id } = session;

  await db.userSearchHistory.create({
    data: {
      search: query,
      userId: id,
    },
  });
};
