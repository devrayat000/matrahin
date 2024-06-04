import { useAtom } from "jotai";
import { useState } from "react";
import { WorkFunctionAtom } from "./store";

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

export default WorkFunctionInput;
