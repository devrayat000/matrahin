"use client";

import { useState } from "react";
import { Slider } from "~/components/ui/slider";
import VoltageSource from "./VoltageSource";

const page = () => {
  const [voltage, setVoltage] = useState(2);
  const [currentValue, setCurrentValue] = useState(2);
  const [plusLeft, setPlusLeft] = useState(true);
  return (
    <center>
      <svg
        style={{
          width: "50vw",
          height: "80vh",
        }}
        // className="border border-slate-900"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth="4  "
        stroke="black"
        fill="none"
      >
        <rect x="0" y="0" width="1000" height="1000" />
        {/* vertical first line */}
        <line x1="100" y1="200" x2="100" y2="800" />
        {/* vertical second line */}
        <line x1="800" y1="200" x2="800" y2="400" />
        {/* ammeter */}
        {/* <rect x="715" y="400" width="170" height="100" /> */}
        <circle cx="800" cy="500" r="100" fill="none" />
        {/* text indicating current value placed at the center aligned of the circle */}
        <text
          x="800"
          y="485"
          fontSize="40"
          strokeWidth={3}
          alignmentBaseline="middle"
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {currentValue.toFixed(2)}
        </text>

        <text
          x="800"
          y="525"
          fontSize="40"
          strokeWidth={3}
          alignmentBaseline="middle"
          dominantBaseline="middle"
          textAnchor="middle"
        >
          mA
        </text>

        <line x1="800" y1="600" x2="800" y2="800" />

        {/* horizontal bottom line */}
        <line x1="96" y1="800" x2="300" y2="800" />
        <line x1="600" y1="800" x2="804" y2="800" />

        {/* circle from voltage source wire */}
        <circle
          cx="300"
          cy="800"
          r="20"
          fill={plusLeft ? "red" : "black"}
          strokeWidth="0"
        />
        <circle
          cx="600"
          cy="800"
          r="20"
          fill={!plusLeft ? "red" : "black"}
          strokeWidth="0"
        />
        <text x="290" y="780" fontSize="36" strokeWidth={2}>
          {plusLeft ? "+" : "-"}
        </text>
        <text x="590" y="780" fontSize="36" strokeWidth={2}>
          {!plusLeft ? "+" : "-"}
        </text>
        {/* voltage value */}

        <text x="400" y="800" fontSize="40" strokeWidth={3}>
          {Math.abs(voltage).toFixed(2)} V
        </text>
        {/* voltage source */}
        <rect x="250" y="650" width="400" height="300" />

        <g transform="translate(300,850)">
          <foreignObject width="300" height="300" fontSize={34} scale={2}>
            <div className=" mt-2">
              <Slider
                className="mt-4"
                min={0}
                max={5}
                step={0.01}
                value={[voltage]}
                onValueChange={(value) => {
                  setVoltage(value[0]);
                }}
              />
              <div className="flex justify-between">
                {/* <span>-5</span> */}
                <span>0</span>

                <span>5</span>
              </div>
            </div>
          </foreignObject>
        </g>
        {/* splitting the voltage source */}
        <rect
          x="300"
          y="670"
          width="110"
          height="70"
          strokeWidth={1}
          fill={plusLeft ? "#00ffaa" : "none"}
        />
        {/* draw voltage sorce */}
        <g transform="translate(300 670)  ">
          <VoltageSource size={100} plusLeft={true} />
        </g>

        <rect
          x="490"
          y="670"
          width="110"
          height="70"
          strokeWidth={1}
          fill={!plusLeft ? "#00ffaa" : "none"}
        />
        <g transform="translate(490 670)  ">
          <VoltageSource size={100} plusLeft={false} />
        </g>
        <rect
          x="490"
          y="670"
          width="110"
          height="70"
          opacity={0}
          fill="red"
          cursor="pointer"
          onClick={() => setPlusLeft((prev) => !prev)}
        />
        <rect
          x="300"
          y="670"
          width="110"
          height="70"
          opacity={0}
          fill="red"
          cursor="pointer"
          onClick={() => setPlusLeft((prev) => !prev)}
        />
      </svg>
    </center>
  );
};

export default page;
