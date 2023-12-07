"use client";

import { CalendarDays, Github, Mail, MapPin, ShareIcon, Users2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Icons } from "../icon";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import UserHoverCard from "../user-hover-card";
import Link from "next/link";
import { formatNumberWithSuffix } from "../format-numbers";
import LoginDialog from "../login-dialog";
import { useSession } from "next-auth/react";
import { useEffect, useState, } from "react";
import { getSessionUser } from "../get-session-user";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { validate } from "@/lib/revalidate";
import ShareList from "./share";

export default function UserDetails({ className, children, user, followers, followings, session }: { children?: React.ReactNode, className?: string, user: any, followers: any, followings: any, session: any }) {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(followers.find((follower: any) => follower.followerId === session?.id));
  const [isFollowingLoading, setIsFollowingLoading] = useState<boolean>(false);
  const router = useRouter();
  const { status } = useSession();

  async function handleFollow(followeeId: string) {
    if (status === "authenticated") {
      setIsFollowingLoading(true);
      try {
        setIsFollowing(!isFollowing);
        const followerId = (await getSessionUser())?.id;
        const result = await fetch(`/api/follow?followeeId=${followeeId}&followerId=${followerId}`, {
          method: "GET",
        });
        if (!result.ok) {
          setIsFollowing(!isFollowing);
        }
        setIsFollowingLoading(false);
      } catch (error) {
        console.error(error);
        setIsFollowingLoading(false);
      }
      await validate(`/@${user?.username}`)
      router.refresh();
    }
  }
  return (
    <>
      <div className={cn("flex flex-col items-stretch justify-between xs:h-fit details", className)}>
      <div className="flex lg:flex-col items-start">
            <div className="user__header flex md:block md:items-start lg:space-y-4 space-y-2 pb-4">
              <Avatar className="rounded-full mr-3 lg:w-64 w-16 md:w-56 md:h-56 lg:h-64 border h-16">
                <AvatarImage className="rounded-full" src={user?.image} alt={user?.name} />
                <AvatarFallback className="text-8xl text-foreground">{user?.name ? user?.username?.charAt(0) : user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex items-center md:py-4 w-full justify-between">
                {
                  user?.name ? (
                    <div className="md:space-y-3 w-full">
                      <h1 className="font-bold text-xl lg:text-2xl flex items-center"><span>{user?.name}</span> {user?.verified && (
                        <Icons.verified className="h-5 lg:h-6 w-5 lg:w-6 mx-0.5 inline fill-primary align-middle" />
                      )} {user?.falsemember && (
                        <Image src='/assets/falsemember.png' alt="False icon" height={30} width={30} className="h-5 lg:h-6 w-5 lg:w-6 inline rounded border align-middle" />
                      )}</h1>
                      <span className="text-lg md:text-xl font-light text-muted-foreground">{user?.username}</span>
                    </div>
                  ) : (
                    <div className="md:space-y-3 w-full">
                      <h1 className="font-bold text-lg lg:text-2xl flex items-center"><span>{user?.username}</span> {user?.verified && (
                        <Icons.verified className="h-5 lg:h-6 w-5 lg:w-6 mx-0.5 inline fill-primary align-middle" />
                      )} {user?.falsemember && (
                        <Image src='https://avatars.githubusercontent.com/u/144859178?v=4' alt="False icon" height={30} width={30} className="h-5 lg:h-6 w-5 lg:w-6 inline rounded border align-middle" />
                      )}</h1>
                    </div>
                  )
                }
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center w-full gap-2">
            {
              status === "authenticated" ? (
                session?.id === user?.id ? (
                  <Button variant={"outline"} className="w-full">
                    <Link href="/settings/profile">
                      Edit Profile
                    </Link>
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => {
                    handleFollow(user?.id);
                  }} disabled={isFollowingLoading} >
                    {
                      isFollowingLoading ? (
                        <><Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> {isFollowing ? "Following" : "Follow"}</>
                      ) : (
                        <>{isFollowing ? "Following" : "Follow"}</>
                      )
                    }
                  </Button>
                )
              ) : (
                <LoginDialog>
                  <Button className="w-full">Follow</Button>
                </LoginDialog>
              )
            }
            <ShareList url={`${process.env.DOMAIN}/@${user?.username}`} text={`Check ${user.name || user.username}'s profile on @FalseNotesTeam`}>
              <Button variant={"secondary"} className="px-2">
                <Icons.share className="w-6 h-6 text-muted-foreground" />
              </Button>
            </ShareList>
          </div>
      </div>
    </>
  )
}