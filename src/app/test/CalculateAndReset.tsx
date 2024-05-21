import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Solver } from "./Solver";
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
  const setSolvingSteps = useSetAtom(SolvingStepsAtom);
  const solveCircuit = useCallback(() => {
    const data = new Solver(
      structuredClone(resistances),
      structuredClone(wires),
      terminals[0],
      terminals[1]
    );
    const result = data.solve();
    setSolvingSteps(result);
  }, [resistances, wires, terminals, setSolvingSteps]);

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
