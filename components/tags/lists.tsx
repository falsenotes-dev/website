"use client";
import { useSession } from "next-auth/react";
import FeedPostCard from "../blog/feed-post-card";
import TagPostCard from "./post-card";
import { Button } from "../ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import ListCard from "../list-card";

export default function TagLists({
  lists: initialLists,
  session,
}: {
  lists: any;
  session: any;
}) {
  const [lists, setLists] = useState<Array<any>>(initialLists);
  useEffect(() => {
    setLists(initialLists);
  }, [initialLists]);
  return (
    <div className="flex justify-center">
      <div className="mb-20 w-full">
        <div className="my-10">
          <h2 className="text-2xl font-medium tracking-tight w-full capitalize">
            Recommended lists
          </h2>
        </div>
        <div className="grid xl:grid-cols-2 gap-6">
          {lists.map((list: any) => (
            <ListCard
              key={list.id}
              list={list}
              session={session}
              className="md:col-span-1 col-span-2"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
