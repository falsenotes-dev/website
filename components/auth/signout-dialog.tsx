'use client'

import { usePathname, useRouter } from "next/navigation"
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog"
import Link from "next/link"
import { UserAuthForm } from "./user-auth-form"
import { Icons } from "../icon"
import { AlertDialogDescription, AlertDialogTitle } from "@radix-ui/react-alert-dialog"
import { Button } from "../ui/button"
import { signOut } from "next-auth/react"

export default function SignOutDialog({ ...props }: React.ComponentPropsWithoutRef<typeof AlertDialog>) {
  const pathname = usePathname()
  const router = useRouter()

  async function signout() {
    await signOut({ callbackUrl: "/" })
  }
  return (
    <AlertDialog {...props}>
      <AlertDialogContent className="flex flex-col justify-center !rounded-lg">
        <AlertDialogHeader className="justify-center">
          <Link href={'/'} className="mx-auto"><Icons.logo className="md:h-6 mt-5 mb-8" /></Link>
          <AlertDialogTitle className="mx-auto text-xl">Are you sure you want to sign out?</AlertDialogTitle>
          <AlertDialogDescription className="mt-4 text-center">
            You can always sign back in at any time.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[320px] my-10">
          <Button size={"lg"} className="w-full" onClick={() => signout()}>
            Sign out
          </Button>

        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}