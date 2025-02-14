'use client'
import { Hash, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Input } from "./ui/input";
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Link from "next/link";
import { Icons } from "./icon";
import { addSearchHistory, removeSearchHistory } from "@/lib/prisma/search-history";
import { validate } from "@/lib/revalidate";



// This is a placeholder function. Replace it with your actual implementation.
async function fetchSuggestions(query: string) {
  const [userResponse, tagResponse] = await Promise.all([
    fetch(`/api/users?search=${encodeURIComponent(query)}&limit=3`),
    fetch(`/api/tags/search?search=${encodeURIComponent(query)}&limit=3`),
  ]);

  if (!userResponse.ok) {
    throw new Error(`User API request failed: ${userResponse.status}`);
  }
  if (!tagResponse.ok) {
    throw new Error(`Tag API request failed: ${tagResponse.status}`);
  }

  const { users } = await userResponse.json();
  const { tags } = await tagResponse.json();

  return { users, tags };
}

export default function SearchBar({ history, search, className, isOpen, isOpenChange }: { history?: any, search?: string, className?: string, isOpen?: boolean, isOpenChange?: (value: boolean) => void }) {
  const [open, setOpen] = React.useState(isOpen || false)
  const router = useRouter()

  const [text, setText] = useState(search || "")
  const [query] = useDebounce(text, 750)
  const [suggestions, setSuggestions] = useState<any>([])

  useEffect(() => {
    if (query !== "") {
      fetchSuggestions(query).then((result) => setSuggestions(result));
      setOpen(true)
    } else {
      setSuggestions({ users: [], tags: [] });
    }
  }, [query]);

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (query) {
        await addSearchHistory(query)
        router.push(`/explore?search=${query}`)
      }
    }
  };
  const path = usePathname()

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="hidden md:flex" asChild>
          <div className={cn("flex md:w-40 lg:w-64 h-10 rounded-md border border-input bg-transparent px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 items-center", className)}>
            <Icons.search className="mr-2 h-4 w-4 shrink-0 my-2 opacity-50" />
            {/* when in input clicked inter it must redirect to /explore?search=[value]*/}
            <Input
              type="search"
              placeholder="Search..."
              className="w-full px-0 border-none bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-transparent"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="md:w-40 lg:w-64 p-0" align="start">
          <Command>
            {
              !query && history?.length > 0 && (
                <CommandGroup heading="History">
                  {history?.map((search: any) => (
                    <CommandItem
                      key={search.id}
                      value={search.id}
                    >
                      <Link href={`/explore?search=${search.search}`} className="flex items-center">
                        <Icons.history className="mr-2 h-4 w-4" />
                        <span>{search.search}</span>
                      </Link>
                      <Button variant="ghost" size="sm" className="ml-auto h-fit"
                        onClick={
                          async () => {
                            await removeSearchHistory(query)
                            await validate(path)
                          }
                        }>
                        <Icons.close className="h-3 w-3" />
                      </Button>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            }
            {suggestions.users?.length === 0 && suggestions.tags?.length === 0 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
            {
              suggestions.users?.length > 0 && (
                <CommandGroup heading="Users">
                  {suggestions.users?.map((user: any) => (
                    <CommandItem
                      key={user.id}
                      value={user.id}
                    >
                      <Link href={`/@${user.username}`} className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={user.image} alt={user.username} />
                          <AvatarFallback>{user.username}</AvatarFallback>
                        </Avatar>
                        <span>{user.name || user.username} {user.verified && <Icons.verified className="h-3 w-3 inline fill-verified align-middle" />}</span>
                      </Link>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            }
            {
              suggestions.tags?.length > 0 && (
                <CommandGroup heading="Tags">
                  {suggestions.tags?.map((tag: any) => (
                    <CommandItem
                      key={tag.id}
                      value={tag.id}
                    >
                      <Link href={`/tags/${tag.name}`} className="flex items-center">
                        <Icons.hash className="mr-2 h-4 w-4" />
                        <span>{tag.name.replace(/-/g, " ")}</span>
                      </Link>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            }
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}