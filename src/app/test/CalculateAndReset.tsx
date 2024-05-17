import { useAtomValue, useSetAtom } from "jotai";
import { Button } from "~/components/ui/button";
import { Solver } from "./Sovler";
import {
  ResistanceAllAtom,
  SolvingStepsAtom,
  TerminalsAtom,
  WiresAtom,
  calculatingAtom,
} from "./store";

const CalculateAndReset = () => {
  const resistances = useAtomValue(ResistanceAllAtom);
  const wires = useAtomValue(WiresAtom);
  const terminals = useAtomValue(TerminalsAtom);
  const setCalculating = useSetAtom(calculatingAtom);
  const setSolvingStepsAtom = useSetAtom(SolvingStepsAtom);
  const solveCircuit = () => {
    // setCalculating(true);
    // console.log("r:", [...resistances], "w", [...wires], [...terminals]);
    const data = new Solver(
      structuredClone(resistances),
      structuredClone(wires),
      terminals[0],
      terminals[1]
    );
    const result = data.solve();
    // console.log(result);
    setSolvingStepsAtom(result);
  };

  return (
    <div className="flex w-full items-center justify-evenly">
      <Button
        type="submit"
        className="font-semibold tracking-widest text-2xl p-4"
        onClick={solveCircuit}
      >
        SOLVE
      </Button>
    </div>
  );
};

export default CalculateAndReset;
