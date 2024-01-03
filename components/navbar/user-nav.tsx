"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserByUsername } from "../get-user";
import { getSessionUser } from "../get-session";
import {
  ArrowDownRight,
  ArrowRight,
  ChevronRight,
  Cog,
  LogOut,
  Settings,
  Settings2,
} from "lucide-react";
import { Icons } from "../icon";
import { Badge } from "../ui/badge";

export function UserNav() {
  const { status } = useSession();
  const user = useSession().data?.user as any;
  const [username, setUsername] = useState<string | null>(null);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8 border">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>
              {user.name?.charAt(0) || user.username?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 p-3" align="end" forceMount>
        <DropdownMenuLabel className="flex items-center">
          <Avatar className="mr-2 border">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>
              {user.name?.charAt(0) || user.username?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {user.name ? (
            <div className="flex flex-col space-y-1">
              <p className="text-xl font-bold leading-none">{user.name}</p>
              <p className="text-sm text-muted-foreground leading-none font-normal">
                {user.username}
              </p>
            </div>
          ) : (
            <div className="flex flex-col space-y-1">
              <p className="text-xl font-bold leading-none">{user.username}</p>
            </div>
          )}
        </DropdownMenuLabel>
        <div className="text-muted-foreground font-medium mt-4 mb-3.5 px-2.5">
          Profile
        </div>
        <DropdownMenuItem asChild>
          <Link
            href={user.name !== null ? `/@${user.username}` : `/`}
            className="flex px-2.5 mb-4 py-2 border items-center"
          >
            <Avatar className="h-6 w-6 mr-2 border">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>
                {user.name?.charAt(0) || user.username?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="leading-none">{user.name}</p>
            </div>
            <DropdownMenuShortcut>
              <ChevronRight className="h-5 w-5" />
            </DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={`/@${user.username}/settings/blogs`}
          >
            <Icons.blogs className="h-5 mr-2" />
            Your Blogs
            <DropdownMenuShortcut className="opacity-100">
              <Badge className="font-medium">New</Badge>
            </DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuGroup>
          <DropdownMenuItem className="px-2.5 py-2" asChild>
            <Link href="/lists">
              <Icons.collection className="h-5 w-5 mr-2" />
              Library
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-2.5 py-2" asChild>
            <Link href={`/@${user.username}/settings/profile`}>
              <Icons.settings className="h-5 w-5 mr-2" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-2.5 py-2" asChild>
            <Link href="/signout">
              <Icons.logOut className="h-5 w-5 mr-2" />
              Log out
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
