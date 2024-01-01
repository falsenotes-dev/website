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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { leaveBlog } from "@/lib/prisma/blog"
import { toast } from "sonner"
import { validate } from "@/lib/revalidate"

export function BlogsForm({ data }: { data: any }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  type Blog = PublicationAuthor & {
    publication: User
  }

  const columns: ColumnDef<Blog>[] = [
    {
      accessorKey: "blogs",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="flex p-0 items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Blogs
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const blog = row.original.publication
        return <div className="flex gap-2 items-center" >
          <Avatar className="border">
            <AvatarImage src={blog.image || ''} alt={blog.name || blog.username} />
            <AvatarFallback>
              {blog?.name?.charAt(0) || blog.username?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            <p className="leading-none">{blog.name || blog.username}</p>
            <p className="text-sm text-muted-foreground leading-none font-normal">
              {blog.username}
            </p>
          </div>
        </div>
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <Badge variant="outline" className="capitalize">
        {row.original.accessLevel}
      </Badge>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const blog = row.original

        return (
          <div className="flex w-full justify-end">
            <div className="flex gap-2">
              {
                blog.accessLevel === 'admin' && (
                  <Button variant="ghost" size={'sm'}>
                    Settings
                  </Button>
                )
              }
              <Button variant="destructive" size={'sm'}
                onClick={async () => {
                  const res = await leaveBlog({ id: blog.publicationId })
                  if (res?.success) {
                    toast.success(res.message)
                    await validate('/settings/blogs')
                  } else {
                    toast.error(res?.message)
                  }
                }}
              >
                Leave
              </Button>
            </div>
          </div>
        )
      },
    },
  ]

  console.log(columns)

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
