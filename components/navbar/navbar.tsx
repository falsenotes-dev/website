"use client";

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
} from "@/components/ui/tooltip";
import { use, useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import SearchBar from "../searchbar";
import { useRouter } from "next/navigation";
import { PostCreateButton } from "./post-create-button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { UserSearchHistory } from "@prisma/client";
import { motion } from "framer-motion";

function numberFormat(number: number) {
  if (number > 9) {
    return "9+";
  } else {
    return number;
  }
}

function Navbar({
  notifications,
  session,
  searchHistory,
}: {
  notifications: any;
  session: any;
  searchHistory: UserSearchHistory[] | undefined;
}) {
  const { status } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState<UserSearchHistory[] | undefined>([]);
  useEffect(() => {
    setHistory(searchHistory);
  }, [searchHistory]);
  return (
    <div className="max-w-[1140px] min-w-[280px] hidden md:block mx-auto w-full sticky top-0 md:top-4 z-20 lg:px-6 md:px-2 xl:p-0">
      <div className="menu-container py-4 px-8 bg-background/95 backdrop-blur border md:rounded-2xl shadow-xl xl:mx-8 supports-[backdrop-filter]:bg-background/60">
        <Link href={session ? "/feed" : "/"}>
          <motion.div whileHover={{ scale: 1.02 }} className="flex items-center" whileTap={{ scale: 0.9 }}>
            <Icons.logo className="md:block hidden h-7" />
            <Icons.logoIcon className="md:hidden block h-7" />
            <span className="sr-only">FalseNotes</span>
            {process.env.NEXT_PUBLIC_ENV == "beta" && (
              <Badge className="ml-1.5 md:ml-2" variant={"default"}>
                Beta
              </Badge>
            )}
          </motion.div>
        </Link>

        <div className="flex items-center gap-1 md:gap-4">
          <SearchBar history={history} />
          {status == "authenticated" ? (
            <>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <PostCreateButton
                  key={"New Post"}
                  session={session}
                  variant="ghost"
                  size={"icon"}
                  className="h-10 w-10 hover:shadow-md hover:!bg-accent/10 hover:backdrop-blur-md"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="h-10 w-10 relative hover:shadow-md hover:!bg-accent/10 hover:backdrop-blur-md"
                  onClick={() => router.replace("/notifications")}
                >

                  <Icons.notification className="w-5 h-5" />
                  {notifications > 0 && (
                    <Badge className="left-5 font-normal px-1.5 py-0 absolute top-0 h-5 min-w-[1.25rem] max-w-max">
                      {numberFormat(notifications)}
                    </Badge>
                  )}
                </Button>
              </motion.div>
              <UserNav session={session} />
            </>
          ) : (
            <>
              <motion.div
                className="flex items-center gap-2 md:gap-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button onClick={() => signIn()}>
                  Get Started
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
