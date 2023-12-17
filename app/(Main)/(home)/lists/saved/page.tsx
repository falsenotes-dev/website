import CreateListButton from "@/components/create-list-button";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { formatNumberWithSuffix } from "@/components/format-numbers";
import { getSessionUser } from "@/components/get-session-user";
import { Icons } from "@/components/icon";
import ListCard from "@/components/list-card";
import ListsTabs from "@/components/lists-tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { shimmer, toBase64 } from "@/lib/image";
import postgres from "@/lib/postgres";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lists",
  description: "Your lists",
};

export default async function ListsPage() {
  const session = await getSessionUser();

  if (!session) {
    return null;
  }

  const lists = await postgres.listSaving.findMany({
    where: {
      userId: session?.id,
    },
    include: {
      list: {
        include: {
          _count: { select: { posts: true } },
          posts: {
            include: {
              post: {
                select: {
                  cover: true,
                },
              },
            },
            take: 3,
          },
          author: true,
          savedUsers: { select: { userId: true } },
        },
      }
    },
  });

  return (
    <>
      <div className="flex-auto w-full">
        <div className="pb-14">
          <div className="flex justify-center">
            <div className="my-6 w-full">
              <div className="mt-6 md:mt-12 mb-10">
                <div className="flex justify-between">
                  <h1 className="font-medium line-clamp-1 break-all text-4xl">
                    Your Library
                  </h1>
                  <CreateListButton />
                </div>
              </div>
              <ListsTabs />
              <div className="flex flex-col gap-10">
              {lists.map((list) => (
                  <>
                    <ListCard list={list.list} session={session} />
                  </>
                ))}
                {
                  !lists.length && (
                    <EmptyPlaceholder>
                  <EmptyPlaceholder.Icon name="list" />
                  <EmptyPlaceholder.Title>
                    No lists from other users
                  </EmptyPlaceholder.Title>
                  <EmptyPlaceholder.Description>
                    Save lists from other users to see them here.
                  </EmptyPlaceholder.Description>
                </EmptyPlaceholder>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
