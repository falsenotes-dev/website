import { Metadata } from "next";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/auth/user-auth-form";
import { Icons } from "@/components/icon";
import SigninDialog from "@/components/auth/dialog";
import Image from "next/image";

// export const metadata: Metadata = {
//   title: "Authentication",
//   description: "Authentication forms built using the components.",
// }

export default async function SigninPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const callbackUrl =
    typeof searchParams.callbackUrl === "string"
      ? searchParams.callbackUrl
      : "/";

  return (
    <>
      <div className="flex items-center place-content-center gap-0 h-min relative w-auto min-h-screen">
        <div className="gap-2.5 relative h-screen flex min-w-[280px] flex-[0_0_auto] max-w-6xl place-content-center w-full items-center justify-center p-10">
          <Link
            href={callbackUrl || "/"}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "absolute right-4 top-4 md:right-8 md:top-8"
            )}
          >
            Go Back
          </Link>
          <div className="cta relative rounded-3xl flex-[0_0_auto] w-[538px] hidden h-[700px] flex-col xl:flex overflow-hidden justify-start">
            <div className="absolute inset-0 main-bg object-cover object-center " />
            <div className="absolute flex justify-center top-14 h-[364px] w-[538px] left-[calc(50% - 269px)]">
              <div className="aspect-square flex-[0_0_auto] h-[114px] w-[114px] absolute -right-7 top-[150px]">
                <div className="contents">
                  <div className="h-full w-full opacity-100 rounded-full bg-secondary/5 overflow-visible relative">
                    <div className="outline-none flex flex-col justify-start transform -translate-x-1/2 -translate-y-1/2 opacity-100 absolute top-1/2 left-1/2 h-auto w-auto">
                      <p>
                        <span></span>
                      </p>
                    </div>
                    <div className="rounded-full opacity-100 absolute overflow-visible inset-0">
                      <div className="absolute inset-0">
                        <Image
                          src="/assets/o4xrO7nhHYLJ3IVqDNmF0Jbd89Q.jpg"
                          layout="fill"
                          objectFit="cover"
                          objectPosition="center"
                          className="rounded-full h-full w-full "
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="aspect-square flex-[0_0_auto] h-[148px] w-[148px] absolute -left-10 top-3">
                <div className="contents">
                  <div className="h-full w-full opacity-100 rounded-full bg-secondary/5 overflow-visible relative">
                    <div className="outline-none flex flex-col justify-start transform -translate-x-1/2 -translate-y-1/2 opacity-100 absolute top-1/2 left-1/2 h-auto w-auto">
                      <p>
                        <span></span>
                      </p>
                    </div>
                    <div className="rounded-full opacity-100 absolute overflow-visible inset-0">
                      <div className="absolute inset-0">
                        <Image
                          src="/assets/qoV043xuWjRQQbibvoyjoBlaE4.webp"
                          layout="fill"
                          objectFit="cover"
                          objectPosition="center"
                          className="rounded-full h-full w-full "
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="aspect-square flex-[0_0_auto] h-[102px] w-[102px] absolute right-[49px] top-0">
                <div className="contents">
                  <div className="h-full w-full opacity-100 rounded-full bg-secondary/5 overflow-visible relative">
                    <div className="outline-none flex flex-col justify-start transform -translate-x-1/2 -translate-y-1/2 opacity-100 absolute top-1/2 left-1/2 h-auto w-auto">
                      <p>
                        <span></span>
                      </p>
                    </div>
                    <div className="rounded-full opacity-100 absolute overflow-visible inset-0">
                      <div className="absolute inset-0">
                        <Image
                          src="/assets/TpLrCpid6UuGjOkmgtZL4.webp"
                          layout="fill"
                          objectFit="cover"
                          objectPosition="center"
                          className="rounded-full h-full w-full "
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="aspect-square flex-[0_0_auto] h-[120px] w-[120px] absolute left-10 top-[212px]">
                <div className="contents">
                  <div className="h-full w-full opacity-100 rounded-full bg-secondary/5 overflow-visible relative">
                    <div className="outline-none flex flex-col justify-start transform -translate-x-1/2 -translate-y-1/2 opacity-100 absolute top-1/2 left-1/2 h-auto w-auto">
                      <p>
                        <span></span>
                      </p>
                    </div>
                    <div className="rounded-full opacity-100 absolute overflow-visible inset-0">
                      <div className="absolute inset-0">
                        <Image
                          src="/assets/uDMfrAhga7lhY02vLr4Av0oihY.webp"
                          layout="fill"
                          objectFit="cover"
                          objectPosition="center"
                          className="rounded-full h-full w-full "
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="aspect-square flex-[0_0_auto] h-[162px] w-[162px] absolute left-[184px] top-[70px]">
                <div className="contents">
                  <div className="h-full w-full opacity-100 rounded-full bg-secondary/5 overflow-visible relative">
                    <div className="outline-none flex flex-col justify-start transform -translate-x-1/2 -translate-y-1/2 opacity-100 absolute top-1/2 left-1/2 h-auto w-auto">
                      <p>
                        <span></span>
                      </p>
                    </div>
                    <div className="rounded-full opacity-100 absolute overflow-visible inset-0">
                      <div className="absolute inset-0">
                        <Image
                          src="/assets/SCLaExdmiXrn32AxMUnFpE5KBE.webp"
                          layout="fill"
                          objectFit="cover"
                          objectPosition="center"
                          className="rounded-full h-full w-full "
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="aspect-square flex-[0_0_auto] h-[90px] w-[90px] absolute right-[130px] top-[268px]">
                <div className="contents">
                  <div className="h-full w-full opacity-100 rounded-full bg-secondary/5 overflow-visible relative">
                    <div className="outline-none flex flex-col justify-start transform -translate-x-1/2 -translate-y-1/2 opacity-100 absolute top-1/2 left-1/2 h-auto w-auto">
                      <p>
                        <span></span>
                      </p>
                    </div>
                    <div className="rounded-full opacity-100 absolute overflow-visible inset-0">
                      <div className="absolute inset-0">
                        <Image
                          src="/assets/5AR5WjJxyvJ43labZsGKHxyRNaw.webp"
                          layout="fill"
                          objectFit="cover"
                          objectPosition="center"
                          className="rounded-full h-full w-full "
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute flex flex-col gap-2.5 h-min left-8 overflow-hidden p-0 right-0 justify-center content-start items-start bottom-12">
              <div className="outline-0 flex flex-col justify-start flex-shrink-0 opacity-100 transform-none">
                <h1 className="text-6xl font-black text-primary-foreground">
                  Stay updated on your network
                </h1>
              </div>
            </div>
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
          <div className="form flex justify-between content-center items-center flex-col flex-[0_0_auto] w-full md:w-[538px] h-[700px] relative py-8 overflow-hidden">
            <Link
              href="/"
              className="relative z-20 flex items-center text-lg font-medium"
            >
              <Icons.logo className="h-10 md:h-10" />
            </Link>
            <div className="flex justify-between content-center items-center flex-col flex-[0_0_auto] gap-8 h-min max-w-full overflow-visible p-0 relative w-min">
              <div className="flex justify-between content-center items-center flex-col flex-[0_0_auto] gap-1 h-min max-w-full overflow-visible p-0 relative w-max">
                <div className="outline-0 flex flex-col justify-start flex-shrink-0 opacity-100 transform-none">
                  <h1 className="text-4xl font-extrabold">
                    Log in or Sign up
                  </h1>
                </div>
              </div>
              <UserAuthForm callbackUrl={callbackUrl} />
            </div>
            <div className="flex justify-between content-center items-center flex-col flex-[0_0_auto] gap-4 h-min relative">
              <p className="px-8 text-center text-sm text-muted-foreground">
                By logging in or signing up using the options above, you agree to
                FalseNotes&apos;{" "}
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
      </div>
    </>
  );
}
