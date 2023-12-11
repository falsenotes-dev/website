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
    <div className="flex flex-col items-center justify-center gap-4 h-screen w-screen">
<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 254.14 261.78">
  <defs>
    <style>
      .cls-1 {
        stroke-dasharray: 0 0 13.12 13.12;
      }

      .cls-1, .cls-2, .cls-3, .cls-4, .cls-5, .cls-6, .cls-7, .cls-8, .cls-9, .cls-10, .cls-11, .cls-12, .cls-13, .cls-14 {
        fill: none;
      }

      .cls-1, .cls-2, .cls-3, .cls-4, .cls-5, .cls-7, .cls-8, .cls-9, .cls-10, .cls-11, .cls-12, .cls-13, .cls-14 {
        stroke: #000;
        stroke-miterlimit: 10;
        stroke-width: .75px;
      }

      .cls-2 {
        stroke-dasharray: 0 0 13.95 13.95;
      }

      .cls-3 {
        stroke-dasharray: 0 0 13.94 13.94;
      }

      .cls-4 {
        stroke-dasharray: 0 0 12.69 12.69;
      }

      .cls-5 {
        stroke-dasharray: 0 0 13.87 13.87;
      }

      .cls-6, .cls-15 {
        stroke-width: 0px;
      }

      .cls-7 {
        stroke-dasharray: 0 0 13.12 13.12;
      }

      .cls-16 {
        mask: url(#mask);
      }

      .cls-8 {
        stroke-dasharray: 0 0 12.69 12.69;
      }

      .cls-9 {
        stroke-dasharray: 0 0 13.14 13.14;
      }

      .cls-10 {
        stroke-dasharray: 0 0 12.76 12.76;
      }

      .cls-11 {
        stroke-dasharray: 0 0 13.89 13.89;
      }

      .cls-13 {
        stroke-dasharray: 0 0 13.98 13.98;
      }

      .cls-14 {
        stroke-dasharray: 0 0 12.78 12.78;
      }

      .cls-15 {
        fill: #fff;
      }
    </style>
    <mask id="mask" x="11.76" y="0" width="242.38" height="261.03" maskUnits="userSpaceOnUse">
      <g id="a">
        <ellipse className="cls-15" cx="181.62" cy="72.71" rx="72.51" ry="72.7"/>
      </g>
    </mask>
  </defs>
  <g>
    <g>
      <polyline className="cls-12" points="89.29 176.13 92.29 170.93 98.29 170.93"/>
      <line className="cls-10" x1="111.04" y1="170.93" x2="130.18" y2="170.93"/>
      <polyline className="cls-12" points="136.56 170.93 142.56 170.93 142.56 170.93 139.56 176.13"/>
      <polyline className="cls-9" points="133 187.51 117.55 214.31 96.9 250.14"/>
      <polyline className="cls-12" points="93.62 255.84 90.62 261.03 87.63 255.84"/>
      <line className="cls-14" x1="81.25" y1="244.77" x2="71.68" y2="228.16"/>
      <polyline className="cls-12" points="68.48 222.63 65.49 217.43 68.48 212.23"/>
      <line className="cls-11" x1="75.42" y1="200.19" x2="85.82" y2="182.14"/>
    </g>
    <g>
      <polyline className="cls-12" points="96.62 80.83 90.62 80.83 87.63 86.03"/>
      <line className="cls-8" x1="81.29" y1="97.02" x2="71.79" y2="113.5"/>
      <polyline className="cls-12" points="68.62 119 65.62 124.2 71.62 124.2"/>
      <line className="cls-1" strokeDasharray={'4 4'} x1="84.75" y1="124.2" x2="156.93" y2="124.2"/>
      <polyline className="cls-12" points="163.49 124.2 169.49 124.2 172.48 119"/>
      <line className="cls-4" x1="178.82" y1="108.01" x2="188.32" y2="91.52"/>
      <polyline className="cls-12" points="191.49 86.03 194.49 80.83 188.49 80.83"/>
      <line className="cls-7" x1="175.36" y1="80.83" x2="103.18" y2="80.83"/>
    </g>
    <g>
      <polyline className="cls-12" points="68.59 129.41 65.62 124.21 65.61 124.2 59.61 124.2"/>
      <line className="cls-2" x1="45.66" y1="124.2" x2="24.73" y2="124.2"/>
      <polyline className="cls-12" points="17.76 124.2 11.76 124.2 14.75 129.4"/>
      <line className="cls-13" x1="21.73" y1="141.51" x2="32.2" y2="159.68"/>
      <polyline className="cls-12" points="35.69 165.73 38.69 170.93 44.69 170.93"/>
      <line className="cls-5" x1="58.56" y1="170.93" x2="79.35" y2="170.93"/>
      <polyline className="cls-12" points="86.29 170.93 92.29 170.93 89.31 165.72"/>
      <line className="cls-3" x1="82.4" y1="153.62" x2="72.04" y2="135.46"/>
    </g>
  </g>
  <g>
    <ellipse className="cls-6" cx="181.63" cy="72.7" rx="72.51" ry="72.7"/>
    <path className="cls-6" d="m253.65,72.7c0,39.88-32.24,72.21-72.02,72.21s-72.03-32.33-72.03-72.21S141.85.5,181.63.5s72.02,32.33,72.02,72.2h0Z"/>
  </g>
  <g className="cls-16">
    <path className="cls-6" d="m92.29,170.93h50.27s-25,43.38-25,43.38l-26.93,46.72-25.13-43.61,26.8-46.5Zm-1.67-90.1l-25,43.37h103.87l25-43.37h-103.87Zm-25.01,43.37H11.76l26.93,46.73h53.6l-26.67-46.72h0Z"/>
  </g>
</svg>
      <h2 className="font-medium text-xl">Something went wrong!</h2>
      <Button size={"lg"} onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
