"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icon"
import { Plus } from "lucide-react"
import PostCreateDialog from "./post-create-dialog"

interface PostCreateButtonProps extends ButtonProps { }

interface IconProps
     extends Partial<Omit<React.SVGProps<SVGSVGElement>, 'ref'>> {
     iconName?: keyof typeof Icons
}

export function PostCreateButton({
     className,
     variant,
     children,
     iconName,
     session,
     iconCLassName,
     ...props
}: PostCreateButtonProps & { iconName?: keyof typeof Icons, iconCLassName?: string, session: any }) {
     const router = useRouter()
     const [isLoading, setIsLoading] = React.useState<boolean>(false)
     const [open, setOpen] = React.useState<boolean>(false)
     const [hasBlogs, setHasBlogs] = React.useState<boolean>(false)

     React.useEffect(() => {
          setHasBlogs(session?.publications?.length > 0)
     }, [session])

     async function onClick() {
          setIsLoading(true)

          const response = await fetch("/api/posts", {
               method: "POST",
               headers: {
                    "Content-Type": "application/json",
               },
               body: JSON.stringify({
                    title: "Untitled Post",
                    content: "",
                    url: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
               }),
          })

          setIsLoading(false)

          const post = await response.json()

          // This forces a cache invalidation.
          router.refresh()

          router.push(`/editor/${post.id}`)
     }

     let Icon

     if (!iconName) {
          Icon = Plus
     } else {
          Icon = Icons[iconName]
     }

     return (
          <>
               <Button
                    onClick={async () => {
                         if (!hasBlogs) {
                              await onClick()
                              return
                         } else {
                              setOpen(true)
                              return
                         }
                    }
                    }
                    className={cn(className, { "cursor-not-allowed opacity-60": isLoading })}
                    disabled={isLoading}
                    variant={variant}
                    {...props}
               >
                    {isLoading ? (
                         <Icons.spinner className="h-4 w-4 animate-spin" />
                    ) : (
                         <Icon className={cn("h-[1.2rem] w-[1.2rem]", iconCLassName)} strokeWidth={1.75} />
                    )}
                    <span className="sr-only">Post Create</span>
               </Button>
               <PostCreateDialog open={open} onOpenChange={setOpen} publications={session.publications} session={session} />
          </>
     )
}