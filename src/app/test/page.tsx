"use client";

import { useAtom } from "jotai";
import { useState } from "react";
import Ammeter from "./Ammeter";
import Light from "./Light";
import TubeCanvas from "./TubeCanvas";
import VoltageInput from "./VoltageInput";
import VoltagePart from "./VoltagePart";
import VoltageSources from "./VoltageSources";
import { WorkFunctionAtom } from "./store";

const page = () => {
  return (
    <center className="mt-3">
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
        <line x1="100" y1="450" x2="100" y2="800" />
        {/* horizontal top line */}
        <line x1="100" y1="450" x2="250" y2="450" />
        <line x1="650" y1="450" x2="800" y2="450" />
        {/* vertical second line */}
        {/* before and after ammeter line */}
        <line x1="800" y1="450" x2="800" y2="630" />
        <Ammeter />
        <line x1="800" y1="770" x2="800" y2="800" />
        {/* horizontal bottom line */}
        <line x1="98" y1="800" x2="300" y2="800" />
        <line x1="600" y1="800" x2="802" y2="800" />

        <g>
          <Light />
        </g>

        {/* work function input */}
        <foreignObject
          height={250}
          width={300}
          transform="translate(10,100)"
          fontSize={30}
        >
          <WorkFunctionInput />
        </foreignObject>

        {/* canvas */}
        <g transform="translate(200 270) scale(0.5 0.5) ">
          <foreignObject width="1000" height="1000" fontSize={34}>
            <TubeCanvas />
          </foreignObject>
        </g>

        <VoltagePart />
        <g transform="translate(-450 800)">
          <foreignObject width={1000} height={200} transform="scale(1.8, 2)">
            <VoltageInput />
          </foreignObject>
        </g>
        <VoltageSources />
      </svg>
    </center>
  );
};

export default page;

const WorkFunctionInput = () => {
  const [wf, setWf] = useAtom(WorkFunctionAtom);
  const [customWfSelected, setCustomWfSelected] = useState(false);

  let workFunctions: number[] = [
    2.12, 2.27, 2.51, 4.36, 4.28, 3.46, 4.18, 3.92, 3.74, 4.84, 4.47, 4.5, 4.51,
    3.74, 4.58, 4.02,
  ];
  let metalNames: String[] = [
    "Cs (2.12)",
    "Na (2.27eV)",
    "Ba (2.51eV)",
    "Fe (4.36eV)",
    "Ag (4.28eV)",
    "Mg (3.46eV)",
    "Co (4.18eV)",
    "Cd (3.92eV)",
    "Al (3.74eV)",
    "Ni (4.84eV)",
    "Cu (4.47eV)",
    "W (4.50eV)",
    "Cr (4.51eV)",
    "Zn (3.74eV)",
    "Au (4.58eV)",
    "Pb (4.02eV)",
  ];
  return (
    <div className="flex flex-col items-start gap-3">
      <div>Work Function</div>
      <select
        className="p-2 border w-[16ch]   rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        onChange={(e) => {
          if (e.target.value === "-1") {
            setCustomWfSelected(true);
          } else {
            setWf(Number(e.target.value));
            setCustomWfSelected(false);
          }
        }}
        defaultValue={2.27}
      >
        {workFunctions.map((wf, index) => (
          <option key={index} value={wf} className="text-lg">
            {metalNames[index]}
          </option>
        ))}
        {/* <option value="-1" className="text-lg">
          Custom
        </option> */}
      </select>
      {/* {customWfSelected && (
        <div className="text-xl">
          Custom Work Function (eV):
          <div className="flex flex-row gap-2">
            <input
              className="border rounded-md"
              type="number"
              required
              min={0}
              max={50}
              onChange={(e) => {
                setWf(Number(e.target.value));
              }}
            />
            <Button onClick={() => setCustomWfSelected(false)}>Set</Button>
          </div>
        </div>
      )} */}
    </div>
  );
};
