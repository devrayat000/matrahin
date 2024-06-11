import { useAtom } from "jotai";
import { useState } from "react";
import { WorkFunctionAtom } from "./store";

const WorkFunctionInput = () => {
  const [wf, setWf] = useAtom(WorkFunctionAtom);
  const [customWfSelected, setCustomWfSelected] = useState(false);

  // let workFunctions: number[] = [
  //   2.12, 2.27, 2.51, 4.36, 4.28, 3.46, 4.18, 3.92, 3.74, 4.84, 4.47, 4.5, 4.51,
  //   3.74, 4.58, 4.02,
  // ];
  // let metalNames: String[] = [
  //   "Cs (2.12)",
  //   "Na (2.27eV)",
  //   "Ba (2.51eV)",
  //   "Fe (4.36eV)",
  //   "Ag (4.28eV)",
  //   "Mg (3.46eV)",
  //   "Co (4.18eV)",
  //   "Cd (3.92eV)",
  //   "Al (3.74eV)",
  //   "Ni (4.84eV)",
  //   "Cu (4.47eV)",
  //   "W (4.50eV)",
  //   "Cr (4.51eV)",
  //   "Zn (3.74eV)",
  //   "Au (4.58eV)",
  //   "Pb (4.02eV)",
  // ];

  let workFunctions: { name: string; value: number }[] = [
    { name: "Cs", value: 2.12 },
    { name: "Na", value: 2.27 },
    { name: "Ba", value: 2.51 },
    { name: "Fe", value: 4.36 },
    { name: "Ag", value: 4.28 },
    { name: "Mg", value: 3.46 },
    { name: "Co", value: 4.18 },
    { name: "Cd", value: 3.92 },
    { name: "Al", value: 3.74 },
    { name: "Ni", value: 4.84 },
    { name: "Cu", value: 4.47 },
    { name: "W", value: 4.5 },
    { name: "Cr", value: 4.51 },
    { name: "Zn", value: 3.74 },
    { name: "Au", value: 4.58 },
    { name: "Pb", value: 4.02 },
  ];
  return (
    <div className="flex flex-col items-start gap-3">
      <div>Work Function</div>
      <div>
        <input
          type="number"
          value={wf}
          min={0}
          step={0.01}
          className="p-2 border w-[10ch]   rounded-xl"
          onChange={(e) => setWf(Number(e.target.value))}
        />
        &nbsp; eV
      </div>
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
        value={wf}
      >
        {/* {workFunctions.map((wf, index) => (
          <option key={index} value={wf} className="text-lg">
            {metalNames[index]}
          </option>
        ))} */}

        {workFunctions.map((wf, index) => (
          <option key={index} value={wf.value} className="text-sm">
            {wf.name} ({wf.value} eV)
          </option>
        ))}
      </select>
    </div>
  );
};

export default WorkFunctionInput;
