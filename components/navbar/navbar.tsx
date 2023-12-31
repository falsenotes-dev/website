"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bell, MenuIcon, Plus, SearchIcon } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "./user-nav";
import { Icons } from "@/components/icon";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { use, useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import SearchBar from "../searchbar";
import { useRouter } from "next/navigation";
import { PostCreateButton } from "./post-create-button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

function numberFormat(number: number) {
  if (number > 9) {
    return "9+";
  } else {
    return number;
  }
}

function Navbar(notifications: any) {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <div className="md:container px-4 sticky top-4 z-20">
      <div className="menu-container py-4 px-8 bg-background/95 backdrop-blur border rounded-2xl shadow-xl xl:mx-8 supports-[backdrop-filter]:bg-background/60">
        <Link href={session ? "/feed" : "/"} className="flex items-center">
          <Icons.logo className="md:block hidden h-7" />
          <Icons.logoIcon className="md:hidden block h-7" />
          <span className="sr-only">FalseNotes</span>
          {process.env.NEXT_PUBLIC_ENV == "beta" && (
            <Badge className="ml-1.5 md:ml-2" variant={"default"}>Beta</Badge>
          )}
        </Link>

        <div className="flex items-center gap-1 md:gap-4">
          <Button variant="ghost" size={"icon"} className="flex md:hidden h-10 w-10 hover:shadow " asChild>
            <Link href="/explore">
              <Icons.search className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>
          <SearchBar />
          {
            status == 'authenticated' ? (
              <>
                <PostCreateButton key={"New Post"} variant="ghost" size={"icon"} className="h-10 w-10 hover:shadow-md hover:!bg-accent/10 hover:backdrop-blur-md" />
                <Button variant={"ghost"} size={"icon"} className="h-10 w-10 relative hover:shadow-md hover:!bg-accent/10 hover:backdrop-blur-md" onClick={() => router.replace('/notifications')}>
                  <Icons.notification className="w-5 h-5" />
                  {notifications.notifications && notifications.notifications.length > 0 && (<Badge className="left-5 font-normal px-1.5 py-0 absolute top-0 h-5 min-w-[1.25rem] max-w-max" >{numberFormat(notifications.notifications.length)}</Badge>)}
                </Button>
                <UserNav />
              </>
            ) : (
              <div className="flex items-center gap-2 md:gap-4">
                <Button onClick={() => signIn()}>
                  Join
                </Button>
              </div>
            )
          }

        </div>
      </div>
    </div>
  );
}

export default Navbar;
