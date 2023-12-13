import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { dateFormat } from "@/lib/format-date";
import Link from "next/link";
import Image from "next/image";
import { shimmer, toBase64 } from "@/lib/image";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { removeHistory } from "@/lib/prisma/history";
import { toast } from "sonner";
import { validate } from "@/lib/revalidate";

export default function HistoryPostCard({
  post,
  session,
  ...props
}: { post: any; session: any } & React.ComponentPropsWithoutRef<typeof Card>) {
  return (
    <Card {...props}>
      <CardContent className="flex flex-col">
        <CardHeader className={cn("px-0 pb-3")}>
          <p className="card-text text-muted-foreground text-xs">
            {dateFormat(post.publishedAt)}
          </p>
        </CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex flex-col w-full">
            <CardTitle className="!text-base md:text-xl font-bold text-ellipsis overflow-hidden line-clamp-2 my-3">
              {post.title}
            </CardTitle>
            <CardDescription className="text-ellipsis overflow-hidden line-clamp-3 text-muted-foreground">
              {post.subtitle}
            </CardDescription>
            <div className="flex justify-between items-center mt-8 w-full">
              <div className="flex flex-1 items-center space-x-2.5">
                <p className="card-text mb-0 py-0.5 text-muted-foreground text-xs">
                  {post.readingTime}
                </p>
              </div>
              <Button
                className="text-xs"
                variant="destructive"
                size="sm"
                onClick={async () => {
                  const res = await removeHistory(post.id);
                  if (!res.success) {
                    toast.error(res.message);
                  } else {
                    toast.success("Removed from history");
                  }
                  await validate(`/@${session?.username}`);
                }}
              >
                Remove
              </Button>
            </div>
          </div>
          {post.cover && (
            <div className="flex-none ml-6 md:ml-8 mt-3">
              <div
                className={`h-14 md:h-28 !relative bg-muted !pb-0 aspect-square overflow-hidden rounded-md`}
              >
                <Image
                  src={post.cover}
                  fill
                  alt={post.title}
                  placeholder={`data:image/svg+xml;base64,${toBase64(
                    shimmer(1920, 1080)
                  )}`}
                  className="object-cover max-w-full h-auto z-[1] rounded-md"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
