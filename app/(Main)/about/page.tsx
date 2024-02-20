'use client';
import { SparklesCore } from "@/components/ui/sparkles";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { useTheme } from "next-themes";

export default function AboutPage() {
  const theme = useTheme();
  return (
    <>
      <main
        className="flex flex-col items-center justify-between dark:bg-dot-white/[0.2] bg-dot-black/[0.2]"
        style={{
          minHeight: "calc(100vh - 180px)",
        }}
      >
        <div className="max-w-2xl mx-auto flex-[1_0_auto]">
          <div className="my-10 w-full bg-transparent flex flex-col items-center justify-center overflow-hidden rounded-md">
            <h1 className="md:text-7xl text-3xl font-bold text-center text-foreground relative z-20">
              About FalseNotes
            </h1>
            <div className="w-[40rem] h-40 relative">
              {/* Gradients */}
              <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-primary to-transparent h-[2px] w-3/4 blur-sm" />
              <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-primary to-transparent h-px w-3/4" />
              <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-verified to-transparent h-[5px] w-1/4 blur-sm" />
              <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-verified to-transparent h-px w-1/4" />

              {/* Core component */}
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={1200}
                className="w-full h-full"
                particleColor={theme.resolvedTheme === "dark" ? "rgba(255, 255, 255, 1)" : "rgba(0, 0, 0, 1)"}
              />

              {/* Radial Gradient to prevent sharp edges */}
              <div className="absolute inset-0 w-full h-full bg-background dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
            </div>
          </div>

          <TextGenerateEffect words="This page has not constructed yet. Please check back later." className="text-2xl text-center font-medium" />
        </div>
      </main>
    </>
  );
}
