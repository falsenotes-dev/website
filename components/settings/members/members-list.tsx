"use client"

import * as React from "react"
import {
     CaretSortIcon,
     ChevronDownIcon,
     DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import {
     ColumnDef,
     ColumnFiltersState,
     SortingState,
     VisibilityState,
     flexRender,
     getCoreRowModel,
     getFilteredRowModel,
     getPaginationRowModel,
     getSortedRowModel,
     useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
     DropdownMenu,
     DropdownMenuCheckboxItem,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuLabel,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table"
import { PublicationAuthor, User } from "@prisma/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { changeAccessLevel, changeVisibility, leaveBlog, removeAuthor } from "@/lib/prisma/blog"
import { toast } from "sonner"
import { validate } from "@/lib/revalidate"
import Link from "next/link"
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select";

export function MembersList({ data }: { data: any }) {
     const [sorting, setSorting] = React.useState<SortingState>([])
     const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
          []
     )
     const [columnVisibility, setColumnVisibility] =
          React.useState<VisibilityState>({})
     const [rowSelection, setRowSelection] = React.useState({})

     type Member = PublicationAuthor & {
          author: User
     }

     const columns: ColumnDef<Member>[] = [
          {
               accessorKey: "member",
               header: ({ column }) => {
                    return (
                         <Button
                              variant="ghost"
                              className="flex p-0 items-center hover:!bg-transparent"
                              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                         >
                              Member
                              <CaretSortIcon className="ml-2 h-4 w-4" />
                         </Button>
                    )
               },
               cell: ({ row }) => {
                    const blog = row.original.author
                    return <div className="flex gap-2 items-center cursor-pointer" >
                         <Link href={`/@${blog.username}`}>
                              <Avatar className="border">
                                   <AvatarImage src={blog.image || ''} alt={blog.name || blog.username} />
                                   <AvatarFallback>
                                        {blog?.name?.charAt(0) || blog.username?.charAt(0)}
                                   </AvatarFallback>
                              </Avatar>
                         </Link>
                         <Link className="flex flex-col space-y-1" href={`/@${blog.username}`} >
                              <p className="leading-none">{blog.name || blog.username}</p>
                              <p className="text-sm text-muted-foreground leading-none font-normal">{blog.username}</p>
                         </Link>
                    </div>
               },
          },
          // {
          //      accessorKey: "role",
          //      header: "Role",
          //      cell: ({ row }) => {
          //           const member = row.original
          //           return (
          //                <Select defaultValue={member.accessLevel} onValueChange={
          //                     async (value) => {
          //                          const res = await changeAccessLevel({ id: member.authorId, accessLevel: value })
          //                          if (res?.success) {
          //                               toast.success(res.message)
          //                               await validate('/settings/blogs')
          //                          } else {
          //                               toast.error(res?.message)
          //                          }
          //                     }
          //                }>
          //                     <SelectTrigger className="flex items-center justify-between">
          //                          <SelectValue className="capitalize" placeholder={member.accessLevel.charAt(0).toUpperCase() + member.accessLevel.slice(1)} />
          //                     </SelectTrigger>
          //                     <SelectContent>
          //                          <SelectItem value="admin">Admin</SelectItem>
          //                          <SelectItem value="writer">Writer</SelectItem>
          //                     </SelectContent>
          //                </Select >
          //           )
          //      },
          // },
          {
               accessorKey: "visibility",
               header: "Visibility",
               cell: ({ row }) => {
                    const member = row.original
                    return (
                         <Select defaultValue={member.visibility} onValueChange={
                              async (value) => {
                                   const res = await changeVisibility({ id: member.authorId, visibility: value })
                                   if (res?.success) {
                                        toast.success(res.message)
                                        await validate('/settings/blogs')
                                   } else {
                                        toast.error(res?.message)
                                   }
                              }
                         }>
                              <SelectTrigger className="flex items-center justify-between">
                                   <SelectValue className="capitalize" placeholder={member.visibility.charAt(0).toUpperCase() + member.visibility.slice(1)} />
                              </SelectTrigger>
                              <SelectContent>
                                   <SelectItem value="public">Public</SelectItem>
                                   <SelectItem value="private">Private</SelectItem>
                              </SelectContent>
                         </Select>
                    )
               },
          },
          {
               id: "actions",
               enableHiding: false,
               cell: ({ row }) => {
                    const blog = row.original

                    return (
                         <div className="flex w-full justify-end">
                              <div className="flex gap-2">
                                   <Button variant="destructive" size={'sm'}
                                        onClick={async () => {
                                             const res = await removeAuthor({ id: blog.authorId })
                                             if (res?.success) {
                                                  toast.success(res.message)
                                                  await validate('/settings/blogs')
                                             } else {
                                                  toast.error(res?.message)
                                             }
                                        }}
                                   >
                                        Remove
                                   </Button>
                              </div>
                         </div>
                    )
               },
          },
     ]

     const table = useReactTable({
          data,
          columns,
          onSortingChange: setSorting,
          onColumnFiltersChange: setColumnFilters,
          getCoreRowModel: getCoreRowModel(),
          getPaginationRowModel: getPaginationRowModel(),
          getSortedRowModel: getSortedRowModel(),
          getFilteredRowModel: getFilteredRowModel(),
          onColumnVisibilityChange: setColumnVisibility,
          onRowSelectionChange: setRowSelection,
          state: {
               sorting,
               columnFilters,
               columnVisibility,
               rowSelection,
          },
     })

     return (
          <div className="w-full">
               <div className="rounded-md border">
                    <Table>
                         <TableHeader>
                              {table.getHeaderGroups().map((headerGroup) => (
                                   <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                             return (
                                                  <TableHead key={header.id}>
                                                       {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                 header.column.columnDef.header,
                                                                 header.getContext()
                                                            )}
                                                  </TableHead>
                                             )
                                        })}
                                   </TableRow>
                              ))}
                         </TableHeader>
                         <TableBody>
                              {table.getRowModel().rows?.length ? (
                                   table.getRowModel().rows.map((row) => (
                                        <TableRow
                                             key={row.id}
                                        >
                                             {row.getVisibleCells().map((cell) => (
                                                  <TableCell key={cell.id}>
                                                       {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                       )}
                                                  </TableCell>
                                             ))}
                                        </TableRow>
                                   ))
                              ) : (
                                   <TableRow>
                                        <TableCell
                                             colSpan={columns.length}
                                             className="h-24 text-center"
                                        >
                                             No results.
                                        </TableCell>
                                   </TableRow>
                              )}
                         </TableBody>
                    </Table>
               </div>
               <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="space-x-2">
                         <Button
                              variant="outline"
                              size="sm"
                              onClick={() => table.previousPage()}
                              disabled={!table.getCanPreviousPage()}
                         >
                              Previous
                         </Button>
                         <Button
                              variant="outline"
                              size="sm"
                              onClick={() => table.nextPage()}
                              disabled={!table.getCanNextPage()}
                         >
                              Next
                         </Button>
                    </div>
               </div>
          </div>
     )
}
