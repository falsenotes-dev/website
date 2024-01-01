"use server";

import { getSessionUser } from "@/components/get-session-user";
import db from "../db";
import { Prisma } from "@prisma/client";

const baseQuery = {
  include: {
    Followers: true,
    Followings: true,
  },
};

export const getUsers = async ({
  search,
  page = 0,
  limit = 10,
}: {
  search?: string | undefined;
  page?: number;
  limit?: number;
}) => {
  const users = await db.user.findMany({
    ...baseQuery,
    where:
      search !== undefined
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                username: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {},
    take: limit,
    skip: page * limit,
    include: {
      Followers: true,
      Followings: true,
      _count: {
        select: {
          Followers: true,
          Followings: true,
          posts: true,
        },
      },
    },
  });

  // Sort the results in your application code
  if (typeof search !== undefined) {
    users.sort((a, b) => {
      const aCount = a._count.Followers + a._count.posts;
      const bCount = b._count.Followers + b._count.posts;

      return bCount - aCount;
    });
  }

  return { users: JSON.parse(JSON.stringify(users)) };
};

export const getAllUsers = async ({
  search,
}: {
  search?: string | undefined;
}) => {
  const users = await db.user.findMany({
    ...baseQuery,
    where:
      search !== undefined
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                username: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {},
    ...(search !== undefined
      ? {
          take: 5,
        }
      : {}),
  });

  return { users: JSON.parse(JSON.stringify(users)) };
};
