"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 h-screen w-screen">
      <svg
        fill="none"
        viewBox="-80 0 369 271"
        width="360"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clip-rule="evenodd"
          d="m92.29,170.93h50.27s-25,43.38-25,43.38l-26.93,46.72-25.13-43.61,26.8-46.5Zm-1.67-90.1l-25,43.37h103.87l25-43.37h-103.87Zm-25.01,43.37H11.76l26.93,46.73h53.6l-26.67-46.72h0Z"
          fill="hsl(var(--background))"
          fill-rule="evenodd"
          stroke="hsl(var(--foreground) / 0.3)"
          stroke-dasharray="4 4"
          stroke-width="1.75"
        ></path>
        <g filter="url(#filter0_d)">
          <ellipse
            cx="182.68"
            cy="142.48"
            fill="hsl(var(--background))"
            rx="70"
            ry="70"
          ></ellipse>
          <ellipse
            cx="182.68"
            cy="142.48"
            stroke="hsl(var(--foreground) / 0.3)"
            rx="70"
            ry="70"
          ></ellipse>
        </g>
        <mask
          height="150"
          id="a"
          maskUnits="userSpaceOnUse"
          width="149"
          x="108"
          y="81"
        >
          <ellipse
            cx="182.68"
            cy="142.48"
            fill="#fff"
            rx="70"
            ry="70"
          ></ellipse>
        </mask>
        <g mask="url(#a)">
          <path
            clip-rule="evenodd"
            d="m92.29,170.93h50.27s-25,43.38-25,43.38l-26.93,46.72-25.13-43.61,26.8-46.5Zm-1.67-90.1l-25,43.37h103.87l25-43.37h-103.87Zm-25.01,43.37H11.76l26.93,46.73h53.6l-26.67-46.72h0Z"
            fill="hsl(var(--foreground))"
            fill-rule="evenodd"
          ></path>
        </g>
        <defs>
          <filter
            color-interpolation-filters="sRGB"
            filterUnits="userSpaceOnUse"
            height="213.03"
            id="filter0_d"
            width="212.65"
            x="76.35"
            y="57.97"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
            <feColorMatrix
              in="SourceAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            ></feColorMatrix>
            <feOffset dy="8"></feOffset>
            <feGaussianBlur stdDeviation="16"></feGaussianBlur>
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"></feColorMatrix>
            <feBlend
              in2="BackgroundImageFix"
              result="effect1_dropShadow"
            ></feBlend>
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow"
              result="shape"
            ></feBlend>
          </filter>
        </defs>
      </svg>
      <h2 className="font-medium text-3xl">Something went wrong!</h2>
      <Button size={"lg"} onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
