"use client";

import {
  CalendarDays,
  Github,
  Mail,
  MapPin,
  ShareIcon,
  Users2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Icons } from "../icon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import UserHoverCard from "../user-hover-card";
import Link from "next/link";
import { formatNumberWithSuffix } from "../format-numbers";
import LoginDialog from "../login-dialog";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getSessionUser } from "../get-session-user";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { validate } from "@/lib/revalidate";
import ShareList from "./share";

export default function UserDetails({
  className,
  children,
  user,
  followers,
  session,
}: {
  children?: React.ReactNode;
  className?: string;
  user: any;
  followers: any;
  session: any;
}) {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(
    followers.find((follower: any) => follower.followerId === session?.id)
  );
  const [isFollowingLoading, setIsFollowingLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsFollowing(
      followers.find((follower: any) => follower.followerId === session?.id)
    );
  }, [followers, session]);

  async function handleFollow(followeeId: string) {
    if (session) {
      setIsFollowingLoading(true);
      try {
        setIsFollowing(!isFollowing);
        const result = await fetch(
          `/api/follow?followeeId=${followeeId}&followerId=${session.id}`,
          {
            method: "GET",
          }
        );
        if (!result.ok) {
          setIsFollowing(!isFollowing);
        }
        setIsFollowingLoading(false);
      } catch (error) {
        console.error(error);
        setIsFollowingLoading(false);
      }
      await validate(`/@${user?.username}`);
    }
  }

  return (
    <>
      <div
        className={cn(
          "flex flex-col items-stretch justify-between xs:h-fit details gap-4",
          className
        )}
      >
        <div className="flex lg:flex-col items-start">
          <div className="user__header flex md:block md:items-start lg:space-y-4 space-y-2 w-full">
            <Link href={`/@${user?.username}`}>
              <Avatar className="rounded-full mr-3 w-16 h-16 md:w-24 md:h-24 md:mr-0">
                <AvatarImage src={user?.image} alt={user?.name} />
                <AvatarFallback className="text-3xl">
                  {user?.name ? user?.name?.charAt(0) : user?.username?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex items-center w-full justify-between">
              {user?.name ? (
                <Link href={`/@${user?.username}`}>
                  <div className="md:space-y-3 w-full">
                    <h1 className="font-bold text-lg lg:text-2xl flex items-center">
                      <span>{user?.name}</span>
                    </h1>
                    <span className="text-lg md:text-xl font-light text-muted-foreground">
                      {user?.username}
                    </span>
                  </div>
                </Link>
              ) : (
                <Link href={`/@${user?.username}`}>
                  <div className="md:space-y-3 w-full">
                    <h1 className="font-bold text-lg lg:text-2xl flex items-center">
                      <span>{user?.username}</span>
                    </h1>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="items-center flex gap-2 w-full">
          <div className="inline-flex items-center justify-center font-medium transition-colors h-8 rounded-md text-xs">
            {formatNumberWithSuffix(user.Followers?.length)}{" "}
            <span className="text-muted-foreground ml-2">Followers</span>
          </div>
          <div className="inline-flex items-center justify-center font-medium transition-colors h-8 rounded-md text-xs">
            {formatNumberWithSuffix(user._count.posts + user._count.publicationsPosts)}{" "}
            <span className="text-muted-foreground ml-2">Posts</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          {user.verified && (
            <div className="flex items-center gap-1">
              <Icons.verified className="h-5 w-5 text-muted-foreground fill-verified" />
              <span className="text-muted-foreground text-sm font-medium">
                <span className="text-verified">Verified Author</span>
              </span>
            </div>
          )}
          {user.falsemember && (
            <div className="flex items-center gap-1">
              <Image
                src="/assets/falsemember.png"
                alt="False icon"
                height={20}
                width={20}
                className="h-5 w-5 inline rounded border align-middle"
              />
              <span className="text-sm font-medium">
                The False <span className="text-muted-foreground">Staff</span>
              </span>
            </div>
          )}
        </div>

        {user.bio && (
          <p className="w-full text-muted-foreground">{user?.bio}</p>
        )}

        <div className="flex justify-between items-center w-full gap-2">
          {session ? (
            session?.id === user?.id ? (
              <Button variant={"outline"} className="w-full" asChild>
                <Link href="/settings/profile">Edit Profile</Link>
              </Button>
            ) : (
              <Button
                className="w-full"
                variant={isFollowing ? "outline" : "default"}
                onClick={() => {
                  handleFollow(user?.id);
                }}
                disabled={isFollowingLoading}
              >
                {isFollowingLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />{" "}
                    {isFollowing ? "Following" : "Follow"}
                  </>
                ) : (
                  <>{isFollowing ? "Following" : "Follow"}</>
                )}
              </Button>
            )
          ) : (
            <LoginDialog>
              <Button className="w-full">Follow</Button>
            </LoginDialog>
          )}
          <ShareList
            url={`${process.env.DOMAIN}/@${user?.username}`}
            text={`Check ${user.name || user.username
              }'s profile on @FalseNotesTeam`}
          >
            <Button variant={"secondary"} className="px-2">
              <Icons.share className="w-6 h-6 text-muted-foreground" />
            </Button>
          </ShareList>
        </div>

        {
          user.publications.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground text-sm">
                  Blogs
                </span>
              </div>
              <div className="flex items-center">
                {user.publications.map((pub: any, index: number) => (
                  <Link href={`/@${pub.publication.username}`} className={`z-[${index}] border-2 rounded-full !border-background ${index > 0 && '-ml-4'}`} key={pub.id}>
                    <UserHoverCard user={pub.publication}>
                      <Avatar>
                        <AvatarImage src={pub.publication.image} alt={pub.publication.name} />
                        <AvatarFallback className="text-3xl">
                          {pub.publication.name ? pub.publication.name?.charAt(0) : pub.publication.username?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </UserHoverCard>
                  </Link>
                ))}
              </div>
            </div>
          )
        }
      </div>
    </>
  );
}
