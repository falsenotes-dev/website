"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
     Form,
     FormControl,
     FormDescription,
     FormField,
     FormItem,
     FormLabel,
     FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Icons } from "../../icon";
import { useRouter } from "next/navigation";
import { ToastAction } from "../../ui/toast";
import { toast } from "sonner";
import { Label } from "../../ui/label";
import { useEffect, useState } from "react";
import {
     Command,
     CommandEmpty,
     CommandGroup,
     CommandInput,
     CommandItem,
     CommandList,
} from "@/components/ui/command"
import {
     Drawer,
     DrawerContent,
     DrawerTrigger,
} from "@/components/ui/drawer"
import {
     Popover,
     PopoverContent,
     PopoverTrigger,
} from "@/components/ui/popover"
import useWindowDimensions from "../../window-dimensions";
import { User } from "@prisma/client";
import { getAllUsers } from "@/lib/prisma/users";
import { DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut } from "../../ui/dropdown-menu";
import { Badge } from "../../ui/badge";
import { Cross2Icon } from "@radix-ui/react-icons";
import { addAuthors } from "@/lib/prisma/blog";
import { validate } from "@/lib/revalidate";


export const membersFormSchema = z.object({
     members: z.array(z.object({
          id: z.string(),
     })),
     accessLevel: z.enum(["admin", "writer"]),
});

const fetchUsers = async () => {
     return await getAllUsers({});
}

export type MembersFormData = z.infer<typeof membersFormSchema>;

export function MembersForm({ session }: { session: any }) {
     const router = useRouter();

     const defaultValues = {
          accessLevel: "writer",
     }

     const form = useForm<MembersFormData>({
          defaultValues: {
               accessLevel: "writer" as const,
          },
          resolver: zodResolver(membersFormSchema),
          mode: "onChange",
     });

     const { append, fields, remove } = useFieldArray({
          control: form.control,
          name: "members",
     });

     async function onSubmit(data: MembersFormData) {
          if (data.members.length === 0) {
               return toast.error("Please add at least one member.");
          }
          const res = await addAuthors({ data });
          if (res?.success) {
               toast.success("Members added successfully.");
               remove();
               await validate(`/settings/members`);
          } else {
               toast.error("Something went wrong.");
          }
     }

     const [open, setOpen] = useState(false);
     const { width } = useWindowDimensions();
     const [isDesktop, setIsDesktop] = useState(false);
     useEffect(() => {
          if (width) setIsDesktop(width > 768);
     }, [width]);
     const [selectedUsers, setSelectedUsers] = useState<User[]>();

     const [users, setUsers] = useState<User[]>([]);
     useEffect(() => {
          const fetch = async () => {
               const response = await fetchUsers()
               if (response) {
                    setUsers(response.users.filter((user: User) => user.id !== session?.id));
               }
          };

          fetch();
     }, [session]);

     function UsersList({
          setOpen,
     }: {
          setOpen: (open: boolean) => void
     }) {
          return (
               <Command className="w-full">
                    <CommandInput placeholder="Search for users..." />
                    <CommandList className="w-full">
                         <CommandEmpty>No results found.</CommandEmpty>
                         <CommandGroup>
                              {users.map((user) => (
                                   <CommandItem
                                        key={user.username}
                                        value={user.username}
                                        onSelect={(value) => {
                                             setSelectedUsers((prev: User[] | undefined) => {
                                                  if (prev) {
                                                       const userExists = prev.find((u) => u.id === user.id);
                                                       userExists && (
                                                            toast.error("This user already been selected.")
                                                       )
                                                       if (!userExists) {
                                                            return [...prev, user];
                                                       } else {
                                                            return [...prev];
                                                       }
                                                  } else {
                                                       return [user];
                                                  }
                                             });
                                             //if selectedUsers already appended, don't append again to members in form
                                             const userExists = fields.find((u) => u.id === user.id);
                                             if (!userExists) {
                                                  append({
                                                       id: user.id,
                                                  });
                                             }
                                             setOpen(false)
                                        }}
                                   >
                                        <Avatar className="h-6 w-6 mr-2">
                                             <AvatarImage src={user.image ?? ''} alt={user.username} />
                                             <AvatarFallback>{user.username}</AvatarFallback>
                                        </Avatar>
                                        <span>{user.name || user.username} {user.verified && <Icons.verified className="h-3 w-3 inline fill-verified align-middle" />}</span>
                                   </CommandItem>
                              ))}
                         </CommandGroup>
                    </CommandList>
               </Command>
          )
     }

     return (
          <>
               <Form {...form}>
                    <form
                         onSubmit={form.handleSubmit(onSubmit)}
                         className="flex gap-2 flex-wrap md:flex-nowrap w-full self-stretch"
                    >
                         <FormField
                              control={form.control}
                              name="members"
                              render={({ field }) => (
                                   <div className="flex w-full gap-1.5 items-center justify-between rounded-md border px-3 py-3 md:py-1.5 sm:flex-row sm:items-center">
                                        <div className="flex flex-col gap-1.5 items-start sm:flex-row sm:items-center">
                                             {
                                                  selectedUsers && selectedUsers.length > 0 && (
                                                       <div className="flex flex-row flex-wrap items-center flex-1 w-full justify-items-start gap-1.5">
                                                            {selectedUsers.map((user, index) => (
                                                                 <Badge key={user.id} className="py-1.5" variant={'secondary'}>
                                                                      <Avatar className="h-4 w-4 mr-2">
                                                                           <AvatarImage src={user.image ?? ''} alt={user.username} />
                                                                           <AvatarFallback>{user.username}</AvatarFallback>
                                                                      </Avatar>
                                                                      <span>@{user.username}</span>
                                                                      <Button
                                                                           variant={"ghost"}
                                                                           onClick={() => {
                                                                                remove(index)
                                                                                setSelectedUsers((prev: User[] | undefined) => {
                                                                                     if (prev) {
                                                                                          return prev.filter((u) => u.id !== user.id);
                                                                                     } else {
                                                                                          return [user];
                                                                                     }
                                                                                });
                                                                           }}
                                                                           className="h-fit w-fit !p-0 ml-2.5 hover:bg-transparent"
                                                                           asChild
                                                                      >
                                                                           <span><Cross2Icon className="h-3 w-3" /></span>
                                                                      </Button>
                                                                 </Badge>
                                                            ))}
                                                       </div>
                                                  )
                                             }
                                             {
                                                  isDesktop ? (
                                                       <Popover open={open} onOpenChange={setOpen}>
                                                            <PopoverTrigger asChild>
                                                                 <Button variant="outline" className="justify-start h-[30px]">
                                                                      + Add member
                                                                 </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-full p-0" align="start">
                                                                 <UsersList setOpen={setOpen} />
                                                            </PopoverContent>
                                                       </Popover>
                                                  ) : (
                                                       <Drawer open={open} onOpenChange={setOpen}>
                                                            <DrawerTrigger asChild>
                                                                 <Button variant="ghost" className="justify-start h-[30px]">
                                                                      + Add member
                                                                 </Button>
                                                            </DrawerTrigger>
                                                            <DrawerContent>
                                                                 <div className="mt-4 border-t">
                                                                      <UsersList setOpen={setOpen} />
                                                                 </div>
                                                            </DrawerContent>
                                                       </Drawer>
                                                  )
                                             }
                                        </div>
                                        {
                                             fields.length > 0 && (
                                                  <Button
                                                       variant={'secondary'}
                                                       size={'icon'}
                                                       asChild
                                                       onClick={() => {
                                                            setSelectedUsers([]);
                                                            remove();
                                                       }}
                                                  >
                                                       <span><Cross2Icon className="h-3 w-3" /></span>
                                                  </Button>
                                             )
                                        }
                                   </div>
                              )}
                         />
                         {/* <FormField
                              control={form.control}
                              name="accessLevel"
                              render={({ field }) => (
                                   <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                             <FormControl className="w-28 h-[50px]">
                                                  <SelectTrigger>
                                                       <SelectValue placeholder="Select a acess writer" />
                                                  </SelectTrigger>
                                             </FormControl>
                                             <SelectContent className="w-28">
                                                  <SelectItem value="admin">Admin</SelectItem>
                                                  <SelectItem value="writer">Writer</SelectItem>
                                             </SelectContent>
                                        </Select>
                                        <FormMessage />
                                   </FormItem>
                              )}
                         /> */}
                         <Button type="submit" className="h-[50px]" size={'lg'}>Add</Button>
                    </form>
               </Form >
          </>
     )
}