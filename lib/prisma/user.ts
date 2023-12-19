import { User } from "@prisma/client";
import postgres from "../postgres";

export const getUser = async (id: User["id"]) => {
  const user = await postgres.user.findUnique({
    where: {
      id,
    },
  });
  return user;
};
