import { useAtomValue, useSetAtom } from "jotai";
import { Button } from "~/components/ui/button";
import { Solver } from "./Sovler";
import {
  ResistanceAllAtom,
  SolvingStepsAtom,
  TerminalsAtom,
  WiresAtom,
} from "./store";

const CalculateAndReset = () => {
  const resistances = useAtomValue(ResistanceAllAtom);
  const wires = useAtomValue(WiresAtom);
  const terminals = useAtomValue(TerminalsAtom);
  // const setCalculating = useSetAtom(calculatingAtom);
  const setSolvingStepsAtom = useSetAtom(SolvingStepsAtom);
  const solveCircuit = () => {
    const data = new Solver(
      structuredClone(resistances),
      structuredClone(wires),
      terminals[0],
      terminals[1]
    );
    const result = data.solve();
    setSolvingStepsAtom(result);
  };

  return (
    <div className="flex w-full items-center justify-evenly">
      <Button
        type="submit"
        className="font-semibold tracking-widest text-2xl p-4"
        onClick={solveCircuit}
        disabled={terminals[0] === "-1__-1" || terminals[1] === "-1__-1"}
        name="solve"
      >
        SOLVE
      </Button>
    </div>
  );
};

export default CalculateAndReset;
