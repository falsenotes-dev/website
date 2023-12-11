"use client";

import { Theme } from "@/lib/theme";
import NextTopLoader from "nextjs-toploader";
import { useTheme } from "next-themes";

function TopLoader() {
  return (
    <NextTopLoader
      color="#2564eb"
      initialPosition={0.1}
      height={3}
      showSpinner={true}
      crawl={true}
      crawlSpeed={100}
      shadow="0 0 10px #2463eb,0 0 5px #2463eb"
    />
  );
}

export default TopLoader;