import { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "@/components/auth/user-auth-form"
import { Icons } from "@/components/icon"
import SigninDialog from "@/components/auth/dialog"

// export const metadata: Metadata = {
//   title: "Authentication",
//   description: "Authentication forms built using the components.",
// }

export default async function SigninPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {

  const callbackUrl = typeof searchParams.callbackUrl === "string" ? searchParams.callbackUrl : "/"

  return (
    <>
      {/* <div className="container relative h-screen w-screen bg-pattern">
        <SigninDialog open />
      </div> */}
      <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
            href={callbackUrl || "/"}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "absolute right-4 top-4 md:right-8 md:top-8"
            )}
          >
            Go Back
          </Link>
        <div className="relative hidden h-full flex-col p-10 border-r lg:flex ">
          <div className="absolute inset-0 bg-pattern" />
          <Link href="/" className="relative z-20 flex items-center text-lg font-medium">
            <Icons.logo />
          </Link>
          <div className="relative z-20 mt-auto">
            {/* <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote> */}
          </div>
        </div>
        <div className="lg:p-8 md:block flex items-center min-h-screen md:min-h-fit">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
              Log in or Sign up
              </h1>
            </div>
            <UserAuthForm callbackUrl={callbackUrl} />
            <p className="px-8 text-center text-sm text-muted-foreground">
            By logging in or signing up using the options above, you agree to FalseNotes&apos;{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  )
}