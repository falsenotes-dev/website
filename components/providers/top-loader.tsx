"use client";

import { Theme } from "@/lib/theme";
import NextTopLoader from "nextjs-toploader";
import { useTheme } from "next-themes";

function TopLoader() {
  return (
    <NextTopLoader
    color="#7c3aed"
    initialPosition={1}
    crawlSpeed={200}
    height={3}
    crawl={true}
    easing="ease"
    speed={200}
    />
  );
}

export default TopLoader;