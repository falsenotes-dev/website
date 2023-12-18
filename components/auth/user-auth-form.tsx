"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { signIn, signOut, useSession } from "next-auth/react";
import { Facebook } from "lucide-react"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserAuthForm({ className, callbackUrl, ...props }: UserAuthFormProps & { callbackUrl?: string }) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  async function signin(provider: string) {
    await signIn(provider, { callbackUrl: callbackUrl })
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Button variant="default" type="button" disabled={isLoading} size={'lg'} onClick={() => signin("google")}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Continue with Google
      </Button>
      <Button variant="outline" type="button" disabled={isLoading} size={'lg'} onClick={() => signin("github")}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        Continue with GitHub
      </Button>
      <Button variant={'outline'} type="button" disabled={isLoading} size={'lg'} onClick={() => signin("facebooj")}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Facebook className="mr-2 h-4 w-4" />
        )}{" "}
        Continue with Facebook
      </Button>

    </div>
  )
}