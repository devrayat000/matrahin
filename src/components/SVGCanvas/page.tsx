"use client";

import { useAtom } from "jotai";
import GraphSVG from "~/components/SVGCanvas/graphContainer";
import Circle from "~/components/SVGCanvas/shapes/circle";
import { scaleAtom } from "~/components/SVGCanvas/store";

export default function Page() {
  const [scale, setScale] = useAtom(scaleAtom);
  return (
    <div className="min-h-screen flex flex-col items-center justify-start gap-4 mb-4">
      <h1 className="text-center text-4xl py-3 mt-3 text-primary font-bold leading-8 text-gray-900 ">
        Projectile Motion
      </h1>
      <div className="grid w-full grid-cols-1 md:grid-cols-3 p-2 m-2 gap-2">
        <div className="min-h-96 md:col-span-2 ">
          <GraphSVG origin="center" xOffset={0} yOffset={0}>
            <Circle cx={30} cy={10} r={10} fill="red" sizeFixed={false} />
            <circle cx={-30 * scale} cy={10} r="10" fill="green" />
          </GraphSVG>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setScale((s) => s + 1)}
            className="bg-primary text-white p-2 rounded-md"
          >
            Zoom In
          </button>
          <button
            onClick={() => setScale((s) => Math.max(1, s - 1))}
            className="bg-primary text-white p-2 rounded-md"
          >
            Zoom Out
          </button>
          <div>{scale}</div>
        </div>
      </div>
    </div>
  );
}

/*
// <div className="w-[40vw]">
    //   <svg viewBox="0, 300, 300,300">
    //     <rect
    //       x="10"
    //       y="10"
    //       width="200"
    //       height="200"
    //       fill="none"
    //       stroke="black"
    //       strokeWidth={2}
    //     />
    //     <rect x="0" y="0" width="300" height="300" fill="none" stroke="black" />
        <path
        d="M0,1000  Q500,750  1000,1000"
        stroke="black"
        fill="transparent"
      /> *

        <circle cx="500" cy="750" r="10" fill="red" />

      <path
        d="M 0,1000 Q 500,500 1000,1000"
        stroke="black"
        fill="transparent"
      />
      <circle cx="0" cy="0" r="10" fill="red">
        <animateMotion
          dur="5s"
          repeatCount="indefinite"
          path="M 0,1000 Q 500,500 1000,1000"
        />
      </circle> 
    //   </svg>
    // </div>

    */
