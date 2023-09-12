"use client"

import { Button } from "@/components/ui/button";
import { items } from "./items";
import Link from "next/link";
import { MenuIcon, SearchIcon } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "./user-nav";
import { Icons } from "@/components/icon";
import { signIn, useSession } from "next-auth/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <nav className="menu">
      <div className="menu-backdrop h-[60px] border-b w-full">
      </div>
      <div className="menu-container p-3 xl:px-36 2xl:px-64">
        <Link href="/" className="font-bold">
          <Icons.logo />
        </Link>

        <div className="hidden lg:flex items-center gap-16">

        </div>
        {
          user.data ?
            <div className="flex items-center gap-4">
              {items.map((item) => (
                <>
                  <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button key={item.title} variant={"ghost"} size={"icon"} asChild>
                        <Link href={item.url}><item.icon className="h-[1.2rem] w-[1.2rem]" /></Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                </>
              ))}
              <ModeToggle />
              <UserNav />

            </div>
            : <>
              <ModeToggle />
            <Button onClick={() => signIn("github")}>
                Join Now
            </Button>
            </>
        }
      </div>
    </nav>
  );
}

export default Navbar;
