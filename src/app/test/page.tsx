"use client";

import Ammeter from "./Ammeter";
import TubeCanvas from "./TubeCanvas";
import VoltageInput from "./VoltageInput";
import VoltagePart from "./VoltagePart";
import VoltageSources from "./VoltageSources";

const page = () => {
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

        <line x1="800" y1="600" x2="800" y2="800" />

        {/* horizontal bottom line */}
        <line x1="96" y1="800" x2="300" y2="800" />
        <line x1="600" y1="800" x2="804" y2="800" />

        <TubeCanvas />
        <Ammeter />
        <VoltagePart />
        <g transform="translate(300,850)">
          <foreignObject width="300" height="300" fontSize={34} scale={2}>
            <VoltageInput />
          </foreignObject>
        </g>
        <VoltageSources />
      </svg>
    </center>
  );
};

export default page;
