import { useAtom, useSetAtom } from "jotai";
import { BrainCircuit, Redo, Trash2, Undo } from "lucide-react";
import { useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Solver } from "./Solver";
import {
  Circuit,
  FinalResultAtom,
  HistoryAtom,
  RedoListAtom,
  Resistance,
  ResistanceAllAtom,
  SolvingStepsAtom,
  TerminalsAtom,
  USER_ACTION,
  Wire,
  WiresAtom,
} from "./store";

const ControlButtons = () => {
  const [resistanceAll, setResistanceAll] = useAtom(ResistanceAllAtom);
  const [wires, setWires] = useAtom(WiresAtom);
  const [history, setHistory] = useAtom(HistoryAtom);
  const [redoList, setRedoList] = useAtom(RedoListAtom);
  const [terminals, setTerminals] = useAtom(TerminalsAtom);

  const setFinalResult = useSetAtom(FinalResultAtom);

  const setSolvingSteps = useSetAtom(SolvingStepsAtom);
  const solveCircuit = useCallback(() => {
    const data = new Solver(
      structuredClone(resistanceAll),
      structuredClone(wires),
      terminals[0],
      terminals[1]
    );
    const result = data.solve();
    setSolvingSteps(result);
    setFinalResult(result[result.length - 1].resultingResistances[0]);
  }, [resistanceAll, wires, terminals, setSolvingSteps]);

  const undo = () => {
    const lastAction = history.pop();
    if (lastAction) {
      switch (lastAction.action) {
        case USER_ACTION.ADD_RESISTANCE:
          setResistanceAll((resistances) => resistances.slice(0, -1));
          break;
        case USER_ACTION.ADD_WIRE:
          setWires((wires) => wires.slice(0, -1));
          break;
        case USER_ACTION.REMOVE_RESISTANCE:
          setResistanceAll((prev) => [
            ...prev,
            {
              ...(lastAction.params as Resistance),
              name: `R${prev.length + 1}`,
            },
          ]);
          break;
        case USER_ACTION.REMOVE_WIRE:
          setWires((prev) => [
            ...prev,
            {
              ...(lastAction.params as Wire),
            },
          ]);
          break;
        case USER_ACTION.CLEAR_CKT:
          setResistanceAll([...(lastAction.params as Circuit).resistances]);
          setWires([...(lastAction.params as Circuit).wires]);
          break;

        default:
          break;
      }

      setRedoList((prev) => [...prev, { ...lastAction }]);
    }
  };

  const redo = () => {
    const lastAction = redoList.pop();
    if (lastAction) {
      switch (lastAction.action) {
        case USER_ACTION.ADD_RESISTANCE:
          setResistanceAll((prev) => [
            ...prev,
            {
              ...(lastAction.params as Resistance),
            },
          ]);
          break;
        case USER_ACTION.ADD_WIRE:
          setWires((prev) => [
            ...prev,
            {
              ...(lastAction.params as Wire),
            },
          ]);
          break;
        case USER_ACTION.REMOVE_RESISTANCE:
          setResistanceAll((resistances) => resistances.slice(0, -1));
          break;
        case USER_ACTION.REMOVE_WIRE:
          setWires((wires) => wires.slice(0, -1));
          break;
        case USER_ACTION.CLEAR_CKT:
          setResistanceAll([]);
          setWires([]);
          break;

        default:
          break;
      }

      setHistory((prev) => [...prev, { ...lastAction }]);
    }
  };

  const reset = () => {
    setHistory((prev) => [
      ...prev,
      {
        action: USER_ACTION.CLEAR_CKT,
        params: {
          resistances: structuredClone(resistanceAll),
          wires: structuredClone(wires),
        },
      },
    ]);
    setRedoList([]);
    setResistanceAll([]);
    setWires([]);
    setTerminals(["-1__-1", "-1__-1"]);
  };

  return (
    <div className="flex w-full items-center justify-center gap-2 flex-wrap sm:gap-8 p-1 ">
      <Button
        variant="destructive"
        className=" flex flex-row gap-3 p-4 text-lg"
        name="reset"
        onClick={reset}
      >
        <Trash2 /> Clear All
      </Button>
      <Button
        className=" flex flex-row gap-3 p-4 text-lg"
        name="undo"
        disabled={history.length === 0}
        onClick={undo}
      >
        <Undo />
        Undo
      </Button>
      <Button
        className=" flex flex-row gap-3 p-4 text-lg"
        name="redo"
        disabled={redoList.length === 0}
        onClick={redo}
      >
        Redo
        <Redo />
      </Button>

      <Button
        className="font-semibold tracking-widest text-2xl p-6 flex flex-row gap-3"
        onClick={solveCircuit}
        disabled={terminals[0] === "-1__-1" || terminals[1] === "-1__-1"}
        name="solve"
        variant="success"
      >
        <BrainCircuit /> SOLVE
      </Button>
    </div>
  );
};

export default ControlButtons;
