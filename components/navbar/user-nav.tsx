import {
     Avatar,
     AvatarFallback,
     AvatarImage,

} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuGroup,
     DropdownMenuItem,
     DropdownMenuLabel,
     DropdownMenuSeparator,
     DropdownMenuShortcut,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserNav() {
     return (
          <DropdownMenu>
               <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                         <Avatar className="h-8 w-8">
                              <AvatarImage src="https://avatars.githubusercontent.com/u/62228656" alt="@yusupovbg" />
                              <AvatarFallback>BG</AvatarFallback>

                         </Avatar>
                    </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                         <div className="flex flex-col space-y-1">
                              <p className="text-sm font-medium leading-none">yusupovbg</p>
                              <p className="text-xs leading-none text-muted-foreground">
                                   m@example.com
                              </p>
                         </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                         Profile
                         <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                         <DropdownMenuItem>
                              Settings
                              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                         </DropdownMenuItem>
                         <DropdownMenuItem>
                              Log out
                              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                         </DropdownMenuItem>
                    </DropdownMenuGroup>
               </DropdownMenuContent>
          </DropdownMenu>
     )
}