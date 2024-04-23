"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import TagBadge from "../tags/tag";
import { Button } from "../ui/button";
import { Icons } from "../icon";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { dateFormat } from "@/lib/format-date";
import Balancer from "react-wrap-balancer";
import { Badge } from "../ui/badge";
import { ChevronRight } from "lucide-react";
import React from "react";
import { signIn } from "next-auth/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import UserVerticalCard from "../user-vertical-card";
import CountUp from "react-countup";
import { Input } from "../ui/input";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type Stats = {
  users: number;
  posts: number;
  reads: number;
};

export default function Landing({
  tags,
  popular,
  topUsers,
  stats,
  latestUpdate,
}: {
  tags: any;
  popular: any;
  topUsers: any;
  stats: Stats;
  latestUpdate: any;
}) {
  const [search, setSearch] = React.useState("");
  const [query] = useDebounce(search, 750);
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      if (query) {
        router.push(`/explore?search=${query}`);
      }
    }
  };

  return (
    <>
      <main className="landing mx-auto w-full overflow-hidden mb-4 my-10 flex flex-col items-center content-center justify-start lg:px-6 px-2 xl:p-0">
        {
          latestUpdate && (
            <div className="flex content-center justify-center items-center flex-[0_0_auto] rounded-3xl gap-3 mb-4 h-min max-w-[1140px] min-w-[280px] overflow-hidden relative w-full mx-auto">
              <Badge className="h-6 text-xs font-normal text-destructive px-2.5 bg-destructive/20 hover:bg-destructive/20 border-none">New</Badge>
              <p className="text-muted-foreground font-normal line-clamp-1">{latestUpdate.title}</p>
              <Button
                variant={"secondary"}
                size={'sm'}
                onClick={
                  () => {
                    router.push(`/@falsenotes/${latestUpdate.url}`);
                  }
                }
                className="h-8 w-8 md:w-auto md:px-4 md:py-2 p-2 rounded-full"
              >
                <span className="hidden md:block">Read More</span>
                <ChevronRight className="h-4 w-4 md:ml-1" />
              </Button>
            </div>
          )
        }
        <div className="hero flex justify-between content-center items-center flex-col flex-[0_0_auto] rounded-3xl gap-11 h-min max-w-[1140px] min-w-[280px] overflow-hidden p-[74px] lg:px-6 px-2 pb-0 relative w-full">
          <div className="flex place-content-center items-center flex-col flex-[0_0_auto] gap-3.5 h-min overflow-visible p-0 relative lg:w-[80%] w-11/12 z-10 perspective-1200">
            <div className="stack-stack hero-text-stack" style={{ "--stack-flex": "initial", "--stack-direction": "column", "--stack-align": "center", "--stack-justify": "center", "--stack-padding": "0px", "--sm-stack-gap": "24px", "--md-stack-gap": "32px", "--lg-stack-gap": "32px", "--xl-stack-gap": "32px" } as React.CSSProperties}>
              <h1 className="hero_heading !text-primary-foreground">
                <Balancer>
                  <span className="text-primary-foreground font-bold">
                    Explore the Creative Horizon.
                  </span>{" "}
                  Express Yourself, Connect, Share Your Story.
                </Balancer>
              </h1>
              <div className="stack-stack hero-button-stack" style={{ "--stack-flex": "initial", "--stack-direction": "row", "--stack-align": "stretch", "--stack-justify": "center", "--stack-padding": "10px", "--sm-stack-gap": "16px", "--md-stack-gap": "24px", "--lg-stack-gap": "24px", "--xl-stack-gap": "24px" } as React.CSSProperties}>
                <Button
                  className="shadow-lg rounded-full py-4 h-12 text-base"
                  size={"lg"}
                  onClick={() => signIn()}
                >
                  <Icons.logoIcon className="h-4 md:h-4 mr-2" /> Share Your Story
                </Button>
              </div>
            </div>
          </div>
          <div className="relative justify-center hidden md:block flex-[0_0_auto] h-[250px] w-[960px] z-10 overflow-visible">
            <div className="aspect-square flex-[0_0_auto] h-[96px] w-[96px] absolute left-[863px] top-10">
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
            <div className="aspect-square flex-[0_0_auto] h-[148px] w-[148px] absolute left-0 top-3">
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
            <div className="aspect-square flex-[0_0_auto] h-[96px] w-[96px] absolute left-[302px] top-0">
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
                        src="/assets/5aGUyCW_PJw.jpg"
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
            <div className="aspect-square flex-[0_0_auto] h-[120px] w-[120px] absolute left-[186px] top-[100px]">
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
            <div className="aspect-square flex-[0_0_auto] h-[162px] w-[162px] absolute left-[417px] top-[55px]">
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
            <div className="aspect-square flex-[0_0_auto] h-[90px] w-[90px] absolute left-[616px] top-3">
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
            <div className="aspect-square flex-[0_0_auto] h-[120px] w-[120px] absolute left-[726px] top-[87px]">
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
                        src="/assets/u7pCeAYdJq6jB9fzr069s5YUaC4.webp"
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
          <div className="relative flex-[0_0_auto] h-[62px] max-w-[90%] min-w-[60%] w-full z-10">
            <div className="bg-background h-full max-w-full w-full rounded-full shadow-lg justify-between items-center flex overflow-hidden p-3 relative">
              <div className="flex justify-start content-center items-center flex-[0_0_auto] gap-3.5 h-[54px] p-0 overflow-hidden relative w-max z-10">
                <div className="relative h-auto w-auto flex-[0_0_auto] z-10">
                  <Button
                    size={"icon"}
                    variant={"secondary"}
                    disabled
                    className="p-[13px] h-auto w-auto rounded-full"
                  >
                    <Icons.search className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                  </Button>
                </div>
                <div className="flex outline-0 justify-start shrink-0 transform-none h-auto flex-[0_0_auto] relative w-full">
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full px-0 border-none bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-transparent"
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
              <div className="relative h-auto w-auto flex-[0_0_auto] md:block hidden">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    className="py-2.5 px-5 h-auto w-auto rounded-full"
                    onClick={async () => {
                      if (query) {
                        router.push(`/explore?search=${query}`);
                      }
                    }}
                  >
                    Search
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
          <div className="flex flex-col outline-none justify-start shrink-0 relative flex-[0_0_auto] h-auto w-auto z-10">
            <p className="text-muted-foreground">
              Search for posts, authors, and tags to discover new ideas and
              connect with like-minded individuals.
            </p>
          </div>
          <div className="background rounded-3xl bottom-[100px] flex-[0_0_auto] h-full left-0 overflow-hidden absolute w-full z-[1]">
            <div className="absolute inset-0">
              <Image
                src="/assets/hero_bg.jpg"
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                className="rounded-3xl h-full w-full "
                alt=""
              />
              {/* <svg
                aria-hidden="true"
                className="gradient_blackoutLines h-full"
                fill="none"
                viewBox="0 0 1200 700"
                width="100%"
              >
                <g
                  fill="var(--background)"
                  transform="scale(1.1111111111111112)"
                >
                  <path d="M-161 440.4L-160.9 438.4L376 445L-160.8 431.8V429.8L376.2 443L-160.6 423.2L-160.5 421.2L376.1 441L-160.2 414.7L-160.1 412.7L376.3 439L-159.7 406.1L-159.6 404.1L376.4 437L-159.2 397.5L-159 395.5L376.5 435L-158.5 388.9L-158.3 386.9L376.7 433L-157.7 380.4L-157.5 378.4L377 431L-156.8 371.8L-156.6 369.9L377.1 429L-155.9 363.3L-155.6 361.3L377.4 427.1L-154.8 354.8L-154.5 352.8L377.7 425.1L-153.6 346.3L-153.3 344.3L377.9 423.1L-152.3 337.8L-152 335.8L378.3 421.1L-150.9 329.3L-150.5 327.3L378.5 419.1L-149.4 320.9L-149 318.9L379 417.2L-147.7 312.4L-147.4 310.5L379.3 415.2L-146 304L-145.6 302L379.8 413.3L-144.2 295.6L-143.8 293.7L380.2 411.3L-142.3 287.2L-141.8 285.3L380.7 409.4L-140.3 278.9L-139.8 276.9L381.1 407.4L-138.1 270.6L-137.6 268.6L381.6 405.5L-135.9 262.3L-135.4 260.3L382.2 403.6L-133.6 254L-133 252.1L382.7 401.6L-131.1 245.8L-130.6 243.8L383.3 399.7L-128.6 237.5L-128 235.6L384 397.9L-126 229.4L-125.4 227.5L384.6 395.9L-123.2 221.2L-122.6 219.3L385.2 394L-120.4 213.1L-119.7 211.2L385.8 392.1L-117.5 205L-116.8 203.2L386.6 390.3L-114.5 197L-113.7 195.1L387.2 388.4L-111.3 189L-110.6 187.1L388.1 386.6L-108.1 181L-107.3 179.2L388.8 384.7L-104.8 173.1L-104 171.3L389.6 382.9L-101.4 165.2L-100.5 163.4L390.5 381.1L-97.8 157.4L-97 155.6L391.2 379.2L-94.2 149.6L-93.4 147.8L392.1 377.4L-90.5 141.9L-89.6 140.1L393 375.6L-86.7 134.2L-85.8 132.4L393.8 373.8L-82.8 126.5L-81.9 124.7L394.9 372.1L-78.8 118.9L-77.9 117.1L395.8 370.3L-74.7 111.3L-73.8 109.6L396.6 368.5L-70.6 103.8L-69.6 102.1L397.7 366.8L-66.3 96.4L-65.3 94.7L398.8 365.1L-61.9 89L-60.9 87.3L399.6 363.3L-57.5 81.6L-56.4 79.9L400.8 361.6L-52.9 74.3L-51.9 72.7L401.9 360L-48.3 67.1L-47.2 65.4L403 358.3L-43.6 59.9L-42.5 58.3L404.1 356.6L-38.8 52.8L-37.6 51.2L405.1 354.9L-33.9 45.8L-32.7 44.1L406.4 353.4L-28.9 38.8L-27.7 37.1L407.5 351.7L-23.8 31.8L-22.6 30.2L408.7 350.1L-18.7 24.9L-17.5 23.3L409.9 348.5L-13.5 18.1L-12.2 16.5L411.1 346.9L-8.10001 11.4L-6.89999 9.79999L412.4 345.4L-2.7 4.70001L-1.5 3.2L413.7 343.9L2.7 -1.89999L4 -3.39999L414.9 342.2L8.3 -8.5L9.60001 -10L416.3 340.8L13.9 -14.9L15.3 -16.4L417.5 339.3L19.7 -21.4L21 -22.8L418.9 337.8L25.5 -27.7L26.8 -29.2L420.3 336.4L31.3 -34L32.7 -35.4L421.7 334.9L37.3 -40.1L38.7 -41.6L423.1 333.5L43.3 -46.3L44.7 -47.7L424.4 332L49.4 -52.3L50.9 -53.7L425.9 330.7L55.6 -58.3L57 -59.7L427.3 329.3L61.8 -64.2L63.3 -65.5L428.9 328L68.2 -70L69.7 -71.3L430.4 326.6L74.6 -75.7L76.1 -77.1L431.7 325.1L81 -81.4L82.5 -82.7L433.3 324L87.6 -87L89.1 -88.3L434.8 322.6L94.2 -92.5L95.7 -93.7L436.4 321.4L100.8 -97.9L102.4 -99.1L438.1 320.3L107.6 -103.2L109.1 -104.5L439.4 318.8L114.3 -108.5L115.9 -109.7L441.2 317.8L121.2 -113.6L122.8 -114.8L442.7 316.5L128.1 -118.7L129.8 -119.9L444.4 315.4L135.1 -123.7L136.8 -124.9L446 314.2L142.2 -128.6L143.8 -129.8L447.6 313L149.3 -133.5L150.9 -134.6L449.3 312L156.4 -138.2L158.1 -139.3L450.9 310.7L163.7 -142.9L165.3 -143.9L452.7 309.8L170.9 -147.4L172.6 -148.5L454.4 308.8L178.3 -151.9L180 -152.9L456.1 307.7L185.7 -156.3L187.4 -157.3L457.8 306.7L193.1 -160.6L194.8 -161.6L459.5 305.7L200.6 -164.8L202.3 -165.7L461.3 304.7L208.1 -168.9L209.9 -169.8L463.1 303.9L215.7 -172.9L217.5 -173.8L464.8 302.8L223.4 -176.8L225.2 -177.7L466.7 302L231.1 -180.6L232.9 -181.5L468.4 301L238.8 -184.4L240.6 -185.2L470.2 300.2L246.6 -188L248.4 -188.8L472.1 299.5L254.4 -191.5L256.2 -192.4L473.9 298.6L262.3 -195L264.1 -195.8L475.7 297.7L270.2 -198.3L272 -199.1L477.5 297L278.1 -201.6L280 -202.3L479.5 296.4L286.1 -204.7L288 -205.5L481.2 295.4L294.2 -207.8L296 -208.5L483.2 294.9L302.2 -210.7L304.1 -211.4L485.1 294.3L310.3 -213.6L312.2 -214.3L487 293.6L318.5 -216.4L320.4 -217L488.8 292.9L326.6 -219L328.5 -219.6L490.7 292.3L334.8 -221.6L336.8 -222.1L492.7 291.8L343.1 -224L345 -224.6L494.6 291.2L351.3 -226.4L353.3 -226.9L496.5 290.6L359.6 -228.6L361.6 -229.1L498.5 290.3L367.9 -230.8L369.9 -231.3L500.3 289.6L376.3 -232.8L378.2 -233.3L502.3 289L384.7 -234.8L386.6 -235.2L504.3 288.8L393 -236.6L395 -237L506.2 288.3L401.5 -238.4L403.4 -238.7L508.2 288L409.9 -240L411.9 -240.4L510.2 287.6L418.3 -241.5L420.3 -241.9L512.1 287.1L426.8 -243L428.8 -243.3L514.1 287L435.3 -244.3L437.3 -244.6L516.1 286.7L443.8 -245.5L445.8 -245.8L518.1 286.4L452.3 -246.6L454.3 -246.9L520 286.1L460.8 -247.6L462.8 -247.8L522 286L469.4 -248.5L471.4 -248.7L524 285.7L477.9 -249.3L479.9 -249.5L526 285.6L486.5 -250L488.5 -250.2L528 285.3L495.1 -250.6L497.1 -250.7L530 285.4L503.7 -251.1L505.7 -251.2L532 285.1L512.2 -251.5L514.2 -251.6L534 285L520.8 -251.8H522.8L536 285.2L529.4 -251.9L531.4 -252L538 285V-252H-161V447H376.1L-161 440.4Z"></path>
                  <path d="M1239 455.6L1238.9 457.6L701.9 451L1238.8 464.2V466.2L702 453L1238.6 472.8L1238.5 474.8L701.8 455L1238.2 481.3L1238.1 483.3L701.8 457L1237.8 489.9L1237.6 491.9L701.6 459L1237.2 498.5L1237 500.5L701.4 461L1236.5 507.1L1236.3 509.1L701.3 463L1235.7 515.6L1235.5 517.6L701.1 465L1234.9 524.2L1234.6 526.1L700.8 467L1233.9 532.7L1233.6 534.7L700.6 468.9L1232.8 541.2L1232.5 543.2L700.4 470.9L1231.6 549.7L1231.3 551.7L700.1 472.9L1230.3 558.2L1230 560.2L699.7 474.9L1228.9 566.7L1228.5 568.7L699.6 476.9L1227.4 575.1L1227 577.1L698.9 478.8L1225.7 583.6L1225.4 585.5L698.7 480.8L1224 592L1223.6 594L698.1 482.7L1222.2 600.4L1221.8 602.3L697.8 484.7L1220.3 608.8L1219.8 610.7L697.3 486.6L1218.3 617.1L1217.8 619.1L696.9 488.6L1216.1 625.4L1215.6 627.4L696.3 490.5L1213.9 633.7L1213.4 635.7L695.9 492.4L1211.6 642L1211 643.9L695.1 494.3L1209.2 650.2L1208.6 652.2L694.7 496.3L1206.6 658.5L1206 660.4L693.9 498.1L1204 666.6L1203.4 668.5L693.5 500.1L1201.3 674.8L1200.6 676.7L692.7 501.9L1198.4 682.9L1197.7 684.8L692.1 503.8L1195.5 691L1194.8 692.8L691.4 505.7L1192.5 699L1191.7 700.9L690.7 507.6L1189.3 707L1188.6 708.9L690 509.4L1186.1 715L1185.3 716.8L689.1 511.3L1182.8 722.9L1182 724.7L688.4 513.1L1179.4 730.8L1178.5 732.6L687.5 514.9L1175.8 738.6L1175 740.4L686.8 516.8L1172.2 746.4L1171.4 748.2L685.9 518.6L1168.5 754.1L1167.6 755.9L684.9 520.3L1164.7 761.8L1163.8 763.6L684.1 522.2L1160.8 769.5L1159.9 771.3L683.2 524L1156.8 777.1L1155.9 778.9L682.3 525.7L1152.7 784.7L1151.8 786.4L681.3 527.5L1148.6 792.2L1147.6 793.9L680.4 529.2L1144.3 799.6L1143.3 801.3L679.3 530.9L1139.9 807L1138.9 808.7L678.3 532.7L1135.5 814.4L1134.4 816.1L677.2 534.4L1130.9 821.7L1129.9 823.3L676 536L1126.3 828.9L1125.2 830.6L675.1 537.7L1121.6 836.1L1120.5 837.7L674 539.4L1116.8 843.2L1115.7 844.8L672.7 540.9L1111.9 850.3L1110.7 851.9L671.7 542.7L1106.9 857.3L1105.7 858.9L670.6 544.3L1101.8 864.2L1100.7 865.8L669.2 545.8L1096.7 871.1L1095.5 872.7L668.3 547.6L1091.5 877.9L1090.2 879.4L666.8 549L1086.1 884.6L1084.9 886.2L665.6 550.6L1080.7 891.3L1079.5 892.8L664.4 552.2L1075.3 897.9L1074 899.4L663.1 553.7L1069.7 904.5L1068.4 906L661.8 555.2L1064.1 910.9L1062.7 912.4L660.4 556.7L1058.3 917.3L1057 918.8L659.1 558.2L1052.5 923.7L1051.2 925.2L657.6 559.5L1046.7 930L1045.3 931.4L656.4 561.2L1040.7 936.1L1039.3 937.6L655 562.6L1034.7 942.3L1033.3 943.7L653.4 563.8L1028.6 948.3L1027.1 949.7L652.3 565.5L1022.4 954.3L1021 955.7L650.5 566.6L1016.2 960.2L1014.7 961.5L649.2 568L1009.8 966L1008.3 967.3L647.8 569.5L1003.4 971.7L1001.9 973.1L646.1 570.6L997 977.4L995.5 978.7L644.7 572.1L990.4 983L988.9 984.3L643.3 573.5L983.9 988.5L982.3 989.7L641.6 574.5L977.2 993.9L975.6 995.1L640 575.8L970.4 999.2L968.9 1000.5L638.5 577.1L963.7 1004.5L962.1 1005.7L636.9 578.4L956.8 1009.6L955.2 1010.8L635.3 579.5L949.9 1014.7L948.2 1015.9L633.7 580.8L942.9 1019.7L941.3 1020.9L631.9 581.7L935.8 1024.6L934.2 1025.8L630.4 582.9L928.7 1029.5L927.1 1030.6L628.7 584L921.6 1034.2L919.9 1035.3L627 585.1L914.3 1038.9L912.7 1039.9L625.4 586.3L907.1 1043.4L905.4 1044.5L623.5 587.1L899.7 1047.9L898 1048.9L622 588.4L892.3 1052.3L890.6 1053.3L620.2 589.4L884.9 1056.6L883.2 1057.6L618.5 590.3L877.4 1060.8L875.7 1061.7L616.7 591.3L869.9 1064.9L868.1 1065.8L614.9 592.1L862.3 1068.9L860.5 1069.8L613.2 593.2L854.6 1072.8L852.8 1073.7L611.3 594L846.9 1076.6L845.1 1077.5L609.6 595L839.2 1080.4L837.4 1081.2L607.8 595.7L831.4 1084L829.6 1084.8L605.9 596.5L823.6 1087.5L821.8 1088.4L604.1 597.4L815.7 1091L813.9 1091.8L602.2 598L807.8 1094.3L806 1095.1L600.6 599.2L799.9 1097.6L798 1098.3L598.5 599.6L791.9 1100.7L790 1101.5L596.7 600.4L783.8 1103.8L782 1104.5L594.9 601.3L775.8 1106.7L773.9 1107.4L592.9 601.6L767.7 1109.6L765.8 1110.2L591 602.4L759.5 1112.4L757.6 1113L589.2 603.1L751.4 1115L749.5 1115.6L587.2 603.5L743.2 1117.6L741.2 1118.2L585.4 604.3L734.9 1120L733 1120.6L583.4 604.8L726.7 1122.4L724.7 1122.9L581.5 605.4L718.4 1124.6L716.4 1125.1L579.5 605.7L710.1 1126.8L708.1 1127.3L577.6 606.4L701.7 1128.8L699.8 1129.3L575.7 606.9L693.3 1130.8L691.4 1131.2L573.7 607.2L685 1132.6L683 1133L571.8 607.6L676.5 1134.4L674.6 1134.7L569.8 607.8L668.1 1136L666.1 1136.4L567.9 608.6L659.7 1137.5L657.7 1137.9L565.9 608.9L651.2 1139L649.2 1139.3L563.9 609L642.7 1140.3L640.7 1140.6L561.9 609.3L634.2 1141.5L632.2 1141.8L559.9 609.6L625.7 1142.6L623.7 1142.9L558 609.9L617.2 1143.6L615.2 1143.8L556 610.1L608.6 1144.5L606.6 1144.7L554 610.1L600.1 1145.3L598.1 1145.5L552 610.4L591.5 1146L589.5 1146.2L550 610.6L582.9 1146.6L580.9 1146.7L548 610.7L574.3 1147.1L572.3 1147.2L546 610.8L565.8 1147.5L563.8 1147.6L544 611.1L557.2 1147.8H555.2L542 610.8L548.6 1147.9L546.6 1148L540 611V1148H1239V449H702L1239 455.6Z"></path>
                  <path d="M540 -252V285.1L546.6 -252L548.6 -251.9L542 285.1L555.2 -251.8H557.2L544 285.1L563.8 -251.6L565.8 -251.5L546 285.1L572.3 -251.2L574.3 -251.1L548 285.3L580.9 -250.7L582.9 -250.6L550 285.5L589.5 -250.2L591.5 -250L552 285.5L598.1 -249.5L600.1 -249.3L554 285.7L606.6 -248.7L608.6 -248.5L556 285.9L615.2 -247.8L617.2 -247.6L558 286.1L623.7 -246.9L625.7 -246.6L559.9 286.4L632.2 -245.8L634.2 -245.5L561.9 286.6L640.7 -244.6L642.7 -244.3L563.9 287L649.2 -243.3L651.2 -243L565.9 287.2L657.7 -241.9L659.7 -241.5L567.9 287.4L666.1 -240.4L668.1 -240L569.8 288.1L674.6 -238.7L676.5 -238.4L571.8 288.4L683 -237L685 -236.6L573.7 288.7L691.4 -235.2L693.3 -234.8L575.7 289.2L699.8 -233.3L701.7 -232.8L577.6 289.7L708.1 -231.3L710.1 -230.8L579.6 290.1L716.4 -229.1L718.4 -228.6L581.5 290.7L724.7 -226.9L726.7 -226.4L583.4 291.2L733 -224.6L734.9 -224L585.3 291.9L741.2 -222.1L743.2 -221.6L587.3 292.2L749.5 -219.6L751.4 -219L589.1 293.1L757.6 -217L759.5 -216.4L591 293.6L765.8 -214.3L767.7 -213.6L592.9 294.3L773.9 -211.4L775.8 -210.7L594.9 294.8L782 -208.5L783.8 -207.8L596.7 295.5L790 -205.5L791.9 -204.7L598.6 296.3L798 -202.3L799.9 -201.6L600.4 297.1L806 -199.1L807.8 -198.3L602.3 297.7L813.9 -195.8L815.7 -195L604.1 298.7L821.8 -192.4L823.6 -191.5L605.9 299.5L829.6 -188.8L831.4 -188L607.9 300.1L837.4 -185.2L839.2 -184.4L609.6 301.1L845.1 -181.5L846.9 -180.6L611.3 302.1L852.8 -177.7L854.6 -176.8L613.2 302.8L860.5 -173.8L862.3 -172.9L614.9 303.9L868.1 -169.8L869.9 -168.9L616.7 304.8L875.7 -165.7L877.4 -164.8L618.5 305.7L883.2 -161.6L884.9 -160.6L620.2 306.6L890.6 -157.3L892.3 -156.3L622 307.6L898 -152.9L899.7 -151.9L623.6 308.7L905.4 -148.5L907.1 -147.4L625.3 309.9L912.7 -143.9L914.3 -142.9L627 310.9L919.9 -139.3L921.6 -138.2L628.7 311.9L927.1 -134.6L928.7 -133.5L630.4 313L934.2 -129.8L935.8 -128.6L631.9 314.3L941.3 -124.9L942.9 -123.7L633.7 315.3L948.2 -119.9L949.9 -118.7L635.2 316.6L955.2 -114.8L956.8 -113.6L636.9 317.7L962.1 -109.7L963.7 -108.5L638.4 319L968.9 -104.5L970.5 -103.2L640.1 320.1L975.6 -99.1L977.2 -97.9L641.5 321.5L982.3 -93.7L983.9 -92.5L643.3 322.5L988.9 -88.3L990.5 -87L644.8 323.8L995.5 -82.7L997 -81.4L646.2 325.3L1001.9 -77.1L1003.4 -75.7L647.6 326.7L1008.3 -71.3L1009.8 -70L649.2 327.9L1014.7 -65.5L1016.2 -64.2L650.7 329.2L1021 -59.7L1022.4 -58.3L652 330.7L1027.2 -53.7L1028.6 -52.3L653.5 332.1L1033.3 -47.7L1034.7 -46.3L655 333.4L1039.3 -41.6L1040.7 -40.1L656.2 335L1045.3 -35.4L1046.7 -34L657.8 336.3L1051.2 -29.2L1052.5 -27.7L659.1 337.8L1057 -22.8L1058.3 -21.4L660.3 339.4L1062.7 -16.4L1064.1 -14.9L661.8 340.8L1068.4 -10L1069.7 -8.5L663.1 342.3L1074 -3.39999L1075.3 -1.89999L664.4 343.8L1079.5 3.2L1080.7 4.70001L665.6 345.4L1084.9 9.79999L1086.1 11.4L666.9 346.9L1090.2 16.5L1091.5 18.1L668.1 348.5L1095.5 23.3L1096.7 24.9L669.3 350.1L1100.7 30.2L1101.8 31.8L670.6 351.7L1105.7 37.1L1106.9 38.8L671.7 353.3L1110.7 44.1L1111.9 45.8L672.8 355L1115.7 51.2L1116.8 52.8L674 356.6L1120.5 58.3L1121.6 59.9L675 358.3L1125.2 65.4L1126.3 67.1L676.2 359.9L1129.9 72.7L1130.9 74.3L677.2 361.7L1134.4 79.9L1135.5 81.6L678.3 363.3L1138.9 87.3L1139.9 89L679.2 365.1L1143.3 94.7L1144.3 96.4L680.4 366.7L1147.6 102.1L1148.6 103.8L681.3 368.5L1151.8 109.6L1152.7 111.3L682.2 370.3L1155.9 117.1L1156.8 118.9L683.2 372L1159.9 124.7L1160.8 126.5L684.1 373.8L1163.8 132.4L1164.7 134.2L685 375.6L1167.6 140.1L1168.5 141.9L686 377.4L1171.4 147.8L1172.2 149.6L686.7 379.3L1175 155.6L1175.8 157.4L687.6 381L1178.5 163.4L1179.4 165.2L688.4 382.9L1182 171.3L1182.8 173.1L689.1 384.7L1185.3 179.2L1186.1 181L689.9 386.6L1188.6 187.1L1189.3 189L690.7 388.4L1191.7 195.1L1192.5 197L691.5 390.2L1194.8 203.2L1195.5 205L692.1 392.1L1197.7 211.2L1198.4 213.1L692.8 394L1200.6 219.3L1201.3 221.2L693.5 395.9L1203.4 227.5L1204 229.4L694 397.8L1206 235.6L1206.6 237.5L694.6 399.7L1208.6 243.8L1209.2 245.8L695.3 401.6L1211 252.1L1211.6 254L695.8 403.6L1213.4 260.3L1213.9 262.3L696.3 405.5L1215.6 268.6L1216.1 270.6L696.9 407.4L1217.8 276.9L1218.3 278.9L697.4 409.4L1219.8 285.3L1220.3 287.2L697.8 411.3L1221.8 293.7L1222.2 295.6L698.2 413.3L1223.6 302L1224 304L698.7 415.2L1225.4 310.5L1225.7 312.4L699 417.2L1227 318.9L1227.4 320.9L699.3 419.2L1228.5 327.3L1228.9 329.3L699.8 421.1L1230 335.8L1230.3 337.8L700 423.1L1231.3 344.3L1231.6 346.3L700.4 425.1L1232.5 352.8L1232.8 354.8L700.6 427.1L1233.6 361.3L1233.9 363.3L700.9 429L1234.6 369.9L1234.9 371.8L701.1 431L1235.5 378.4L1235.7 380.4L701.3 433L1236.3 386.9L1236.5 388.9L701.5 435L1237 395.5L1237.2 397.5L701.6 437L1237.6 404.1L1237.7 406.1L701.7 439L1238.1 412.7L1238.2 414.7L701.9 441L1238.5 421.2L1238.6 423.2L701.8 443L1238.8 429.8V431.8L702 445L1238.9 438.4L1239 440.4L702 447H1239V-252H540Z"></path>
                  <path d="M531.4 1148L529.4 1147.9L536 610.8L522.8 1147.8H520.8L534 610.8L514.2 1147.6L512.2 1147.5L532 610.9L505.7 1147.2L503.7 1147.1L530 610.7L497.1 1146.7L495.1 1146.6L528 610.7L488.5 1146.2L486.5 1146L526 610.6L479.9 1145.5L477.9 1145.3L524 610.2L471.4 1144.7L469.4 1144.5L522 610L462.8 1143.8L460.9 1143.6L520 609.9L454.3 1142.9L452.3 1142.6L518.1 609.7L445.8 1141.8L443.8 1141.5L516.1 609.2L437.3 1140.6L435.3 1140.3L514.1 609.2L428.8 1139.3L426.8 1139L512.1 608.7L420.3 1137.9L418.3 1137.5L510.2 608.4L411.9 1136.4L409.9 1136L508.2 608.1L403.4 1134.7L401.5 1134.4L506.2 607.7L395 1133L393 1132.6L504.3 607.3L386.6 1131.2L384.7 1130.8L502.4 606.6L378.2 1129.3L376.3 1128.8L500.4 606.4L369.9 1127.3L367.9 1126.8L498.4 605.9L361.6 1125.1L359.6 1124.6L496.5 605.4L353.3 1122.9L351.3 1122.4L494.6 604.7L345 1120.6L343.1 1120L492.7 604.1L336.8 1118.2L334.8 1117.6L490.7 603.8L328.5 1115.6L326.6 1115L488.9 603L320.4 1113L318.5 1112.4L486.9 602.4L312.2 1110.2L310.3 1109.6L485 601.9L304.1 1107.4L302.2 1106.7L483.2 601.1L296 1104.5L294.2 1103.8L481.3 600.4L288 1101.5L286.1 1100.7L479.4 599.7L280 1098.3L278.1 1097.6L477.5 599L272 1095.1L270.2 1094.3L475.7 598.2L264.1 1091.8L262.3 1091L473.9 597.3L256.2 1088.4L254.4 1087.5L472 596.6L248.4 1084.8L246.6 1084L470.2 595.7L240.6 1081.2L238.8 1080.4L468.4 594.9L232.9 1077.5L231.1 1076.6L466.6 594.1L225.2 1073.7L223.4 1072.8L464.9 593L217.5 1069.8L215.7 1068.9L463 592.3L209.9 1065.8L208.1 1064.9L461.3 591.3L202.3 1061.7L200.6 1060.8L459.6 590.2L194.8 1057.6L193.1 1056.6L457.7 589.4L187.4 1053.3L185.7 1052.3L456.1 588.3L180 1048.9L178.3 1047.9L454.4 587.2L172.6 1044.5L170.9 1043.4L452.7 586.2L165.3 1039.9L163.7 1038.9L451 585.1L158.1 1035.3L156.4 1034.2L449.3 584.1L150.9 1030.6L149.3 1029.5L447.6 583L143.8 1025.8L142.2 1024.6L445.9 581.9L136.8 1020.9L135.1 1019.7L444.4 580.6L129.8 1015.9L128.1 1014.7L442.7 579.5L122.8 1010.8L121.2 1009.6L441.1 578.3L115.9 1005.7L114.3 1004.5L439.6 577L109.1 1000.5L107.5 999.2L437.9 576L102.4 995.1L100.8 993.9L436.4 574.6L95.7 989.7L94.2 988.5L434.8 573.4L89.1 984.3L87.6 983L433.4 571.9L82.5 978.7L81 977.4L431.8 570.7L76.1 973.1L74.6 971.7L430.3 569.4L69.6 967.3L68.2 966L428.7 568.2L63.3 961.5L61.8 960.2L427.4 566.6L57 955.7L55.6 954.3L425.9 565.3L50.9 949.7L49.4 948.3L424.5 564L44.7 943.7L43.3 942.3L423 562.6L38.7 937.6L37.3 936.1L421.6 561.1L32.7 931.4L31.3 930L420.3 559.6L26.8 925.2L25.5 923.7L418.9 558.2L21 918.8L19.7 917.3L417.6 556.7L15.3 912.4L13.9 910.9L416.2 555.2L9.60001 906L8.3 904.5L415 553.7L4 899.4L2.7 897.9L413.6 552.2L-1.5 892.8L-2.7 891.3L412.4 550.6L-6.89999 886.2L-8.10001 884.6L411.1 549.1L-12.2 879.4L-13.5 877.9L409.9 547.5L-17.5 872.7L-18.7 871.1L408.8 545.8L-22.7 865.8L-23.8 864.2L407.5 544.3L-27.7 858.9L-28.9 857.3L406.3 542.7L-32.7 851.9L-33.9 850.3L405.3 540.9L-37.6 844.8L-38.8 843.2L404 539.4L-42.5 837.7L-43.6 836.1L402.9 537.7L-47.2 830.6L-48.3 828.9L401.9 536L-51.9 823.3L-52.9 821.7L400.9 534.3L-56.4 816.1L-57.5 814.4L399.8 532.6L-60.9 808.7L-61.9 807L398.6 531L-65.3 801.3L-66.3 799.6L397.7 529.2L-69.6 793.9L-70.6 792.2L396.8 527.4L-73.8 786.4L-74.7 784.7L395.8 525.7L-77.9 778.9L-78.8 777.1L394.8 524L-81.9 771.3L-82.8 769.5L393.9 522.2L-85.8 763.6L-86.7 761.8L393 520.4L-89.6 755.9L-90.5 754.1L392.1 518.6L-93.4 748.2L-94.2 746.4L391.2 516.8L-97 740.4L-97.8 738.6L390.5 514.9L-100.5 732.6L-101.4 730.8L389.6 513.1L-104 724.7L-104.8 722.9L388.8 511.3L-107.3 716.8L-108.1 715L388 509.5L-110.6 708.9L-111.3 707L387.3 507.6L-113.7 700.9L-114.5 699L386.6 505.7L-116.8 692.8L-117.5 691L385.9 503.8L-119.7 684.8L-120.4 682.9L385.3 501.9L-122.6 676.7L-123.2 674.8L384.6 500.1L-125.4 668.5L-126 666.6L384 498.2L-128 660.4L-128.6 658.5L383.4 496.3L-130.6 652.2L-131.1 650.2L382.8 494.3L-133 643.9L-133.6 642L382.1 492.5L-135.4 635.7L-135.9 633.7L381.8 490.5L-137.6 627.4L-138.1 625.4L381.2 488.6L-139.8 619.1L-140.3 617.1L380.7 486.6L-141.8 610.7L-142.3 608.8L380.3 484.7L-143.8 602.3L-144.2 600.4L379.7 482.7L-145.6 594L-146 592L379.3 480.8L-147.4 585.5L-147.7 583.6L379 478.8L-149 577.1L-149.4 575.1L378.5 476.9L-150.5 568.7L-150.9 566.7L378.3 474.9L-152 560.2L-152.3 558.2L378 472.9L-153.3 551.7L-153.6 549.7L377.6 470.9L-154.5 543.2L-154.8 541.2L377.4 468.9L-155.6 534.7L-155.9 532.7L377.2 467L-156.6 526.1L-156.8 524.2L376.9 465L-157.5 517.6L-157.7 515.6L376.7 463L-158.3 509.1L-158.5 507.1L376.6 461L-159 500.5L-159.2 498.5L376.4 459L-159.6 491.9L-159.7 489.9L376.2 457L-160.1 483.3L-160.2 481.3L376.2 455L-160.5 474.8L-160.6 472.8L376 453L-160.8 466.2V464.2L376.1 451L-160.9 457.6L-161 455.6L376 449H-161V1148H538V611L531.4 1148Z"></path>
                </g>
              </svg> */}
            </div>
          </div>
        </div>
        <div className="flex justify-between content-center items-center flex-col flex-[0_0_auto] pt-[74px] h-min max-w-[1140px] min-w-[280px] overflow-hidden relative w-full">
          <div className="flex justify-center w-full">
            <div className="w-full">
              <Carousel
                opts={{
                  align: "start",
                }}
              >
                <div className="flex flex-col gap-8">
                  <div className="flex justify-between items-center mx-2">
                    <h2 className="text-2xl font-medium tracking-tight w-full">
                      Trending posts
                    </h2>
                    <div className="flex gap-2">
                      <CarouselPrevious className="static translate-y-0" />
                      <CarouselNext className="static translate-y-0" />
                    </div>
                  </div>
                  <CarouselContent>
                    {popular?.map((post: any, index: number) => (
                      <CarouselItem
                        className="basis-full lg:basis-1/2 xl:basis-1/3 pl-6"
                        key={post.id}
                      >
                        <Card className="p-8 gap-6 flex flex-col hover:shadow-lg mb-3">
                          <CardHeader className="p-0">
                            <Link
                              href={`/@${post.author.username}`}
                              className="flex items-center space-x-2"
                            >
                              <Avatar>
                                <AvatarImage
                                  src={post.author.image}
                                  alt={post.author.username}
                                />
                                <AvatarFallback>
                                  {post.author.name.charAt(0) ||
                                    post.author.username.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex gap-0.5">
                                <p className="text-base font-normal leading-none">
                                  {post.author.name || post.author.username}
                                </p>
                                {post.author.verified && (
                                  <Icons.verified className="h-4 w-4 inline fill-verified align-middle" />
                                )}
                              </div>
                            </Link>
                          </CardHeader>
                          <Link
                            href={`/@${post.publicationId === null
                              ? post.author.username
                              : post.publication?.username
                              }/${post.url}`}
                          >
                            <CardContent className="p-0 gap-2 flex flex-col">
                              <h2 className="font-extrabold line-clamp-2 text-lg text-ellipsis leading-tight tracking-normal">
                                {post.title}
                              </h2>
                              <span className="text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <span>{dateFormat(post.createdAt)}</span>
                                  <div className="px-1">·</div>
                                  <span>{post.readingTime}</span>
                                </div>
                              </span>
                            </CardContent>
                          </Link>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </div>
              </Carousel>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:gap-8 gap-4 self-stretch py-[74px] mb-8 ">
            <Card className="self-stretch rounded-3xl lg:flex-[1_0_0px] flex-none h-[400px] lg:h-[464px] w-full lg:w-[1px] relative bg-secondary border-secondary">
              <div className="absolute left-0 bottom-0 overflow-hidden w-full h-96 rounded-b-3xl">
                <div className="absolute inset-0">
                  <Image
                    src="/assets/photo-1602035971641-b5ba4900bdb4.jpg"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                    className="rounded-b-3xl h-full w-full"
                    alt=""
                  />
                </div>
              </div>
              <div className="absolute left-0 bottom-0 overflow-hidden w-full h-96 rounded-b-3xl bg-gradient-to-b from-secondary via-secondary to-transparent" />
              <CardContent className="flex lg:items-start items-center flex-col flex-nowrap lg:gap-3.5 gap-2.5 justify-start left-0 overflow-hidden lg:p-12 p-10 absolute top-0 w-full">
                <div className="flex flex-col shrink-0 transform-none justify-start outline-none">
                  <p className="text-xs font-semibold text-primary lg:text-left text-center">
                    Recommended tags
                  </p>
                </div>
                <div className="flex flex-col shrink-0 transform-none justify-start outline-none">
                  <CardTitle className="line-clamp-2 text-4xl font-extrabold lg:text-left text-center">
                    Explore suggested tags
                  </CardTitle>
                </div>
                <div className="flex flex-col shrink-0 transform-none justify-start outline-none">
                  <CardDescription className="line-clamp-3 text-foreground font-light text-sm lg:text-left text-center">
                    Discover curated tags for tailored content recommendations.
                    Follow suggested tags to stay updated and dive into a world
                    of diverse posts that match your interests
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
            <Card className="self-stretch rounded-3xl lg:flex-[1_0_0px] flex-none md:flex-nowrap md:gap-2.5 md:py-6 md:px-2 md:flex justify-center items-center h-min lg:h-[464px] w-full lg:w-[1px] overflow-hidden relative bg-secondary border-secondary">
              <div className="static md:absolute lg:bottom-0 bottom-auto left-0 md:order-1 lg:-left-5 overflow-visible top-0 w-[110%] md:h-[110%] lg:w-[600px] z-[1]">
                <div className="absolute inset-0">
                  <Image
                    src="/assets/hero_bg.jpg"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                    className="h-full w-full"
                    alt=""
                  />
                </div>
              </div>
              <CardContent className="flex content-center items-center flex-wrap gap-1.5 lg:gap-2.5 h-auto lg:h-full justify-center lg:left-0 left-auto overflow-hidden p-3 lg:p-8 relative lg:absolute z-10 w-full md:top-auto">
                {tags?.map((tag: any) => (
                  <Link href={`/tags/${tag.name}`} key={tag.id}>
                    <TagBadge
                      className="my-1.5 mr-1.5 lg:px-5 md:px-3.5 py-2 lg:py-2.5 h-min gap-2 text-base font-normal"
                      variant={"secondary"}
                    >
                      <Icons.search className="h-4 w-4" />{" "}
                      {tag.name.replace(/-/g, " ")}
                    </TagBadge>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* stats */}
          <Card className="self-stretch rounded-lg mb-10 main-bg text-primary-foreground">
            <CardContent className="p-8 md:p-10 h-full flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="flex flex-col items-center gap-2 flex-1">
                <span className="text-6xl font-extrabold">
                  <CountUp start={0} end={stats.users} />
                </span>
                <span>Authors</span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1">
                <span className="text-6xl font-extrabold">
                  <CountUp start={0} end={stats.posts} />
                </span>
                <span>Posts published</span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1">
                <span className="text-6xl font-extrabold">
                  <CountUp start={0} end={stats.reads} />
                </span>
                <span>Total article reads</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center w-full">
            <div className="mb-20 w-full">
              <Carousel
                opts={{
                  align: "start",
                }}
              >
                <div className="my-10 flex justify-between items-center">
                  <h2 className="text-2xl font-medium tracking-tight w-full">
                    Top level authors
                  </h2>
                  <div className="flex gap-2">
                    <CarouselPrevious className="static translate-y-0" />
                    <CarouselNext className="static translate-y-0" />
                  </div>
                </div>
                <div className="mt-6 mb-10">
                  <CarouselContent>
                    {topUsers.map((follower: any) => (
                      <CarouselItem
                        className="basis-full lg:basis-1/2 xl:basis-1/3 pl-6 mb-3"
                        key={follower.id}
                      >
                        <UserVerticalCard
                          user={follower}
                          className="hover:shadow-lg"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </div>
              </Carousel>
            </div>
          </div>

          <Card className="self-stretch rounded-lg main-bg text-primary-foreground mb-10">
            <CardContent className="xl:p-12 lg:p-11 p-10 gap-6 xl:gap-0 h-full flex flex-col xl:flex-row justify-between items-center">
              <div>
                <CardTitle className="line-clamp-2 mb-4 text-center font-extrabold text-4xl xl:text-left">
                  Start your journey with FalseNotes now!
                </CardTitle>
                <CardDescription className="line-clamp-3 text-primary-foreground font-medium text-sm text-center xl:text-left">
                  Discover new ideas, learn new skills, and connect with
                  like-minded individuals.
                </CardDescription>
              </div>
              <Button
                size={"lg"}
                className="mt-6 w-max mx-auto xl:mx-0 xl:mt-0 xl:ml-auto"
                variant={"secondary"}
                onClick={() => signIn()}
              >
                Start Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
