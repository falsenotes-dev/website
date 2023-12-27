import { User } from "@prisma/client";
import db from "./db";
import { z } from "zod";
import { profileSchema } from "./profile-schema";

export const insertUrls = async ({
  urls,
  userId,
}: {
  urls: { value: string }[] | undefined | null;
  userId: string;
}) => {
  //delete all urls connected to user
  await db.userWebsite.deleteMany({
    where: {
      userId: userId,
    },
  });

  if (urls) {
    await db.userWebsite.createMany({
      data: urls.map((url: any) => ({
        value: url.value,
        userId: userId,
      })),
    });
  }
};
