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
    <div className={cn("grid gap-6 py-4", className)} {...props}>
      <Button variant="default" type="button" disabled={isLoading} size={'lg'} onClick={() => signin("google")}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Continue with Google
      </Button>
      <div className="flex gap-2 w-full justify-center">
        <Button variant="outline" type="button" disabled={isLoading} onClick={() => signin("github")}>
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.gitHub className="mr-2 h-4 w-4" />
          )}{" "}
          GitHub
        </Button>
        <Button variant="outline" type="button" disabled={isLoading} onClick={() => signin("twitter")}>
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.twitter className="mr-2 h-4 w-4" />
          )}{" "}
          Twitter
        </Button>
      </div>

    </div>
  )
}