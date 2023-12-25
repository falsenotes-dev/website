import { User } from "@prisma/client";
import db from "../db";

export const getUser = async (id: User["id"]) => {
  const user = await db.user.findUnique({
    where: {
      id,
    },
  });
  return user;
};
