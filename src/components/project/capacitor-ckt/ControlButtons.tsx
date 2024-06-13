import { useAtom, useSetAtom } from "jotai";
import { BrainCircuit, Redo, Trash2, Undo } from "lucide-react";
import { useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Solver } from "./Solver";
import {
  Capacitance,
  CapacitanceAllAtom,
  CapacitorHistoryAtom,
  Circuit,
  FinalResultCapacitorAtom,
  CapacitorRedoListAtom as RedoListAtom,
  SolvingStepscapacitorAtom,
  TerminalsCapacitorAtom,
  USER_ACTION,
  Wire,
  WiresCapacitorAtom,
} from "./store";

const ControlButtons = () => {
  const [resistanceAll, setCapacitanceAll] = useAtom(CapacitanceAllAtom);
  const [wires, setWires] = useAtom(WiresCapacitorAtom);
  const [history, setHistory] = useAtom(CapacitorHistoryAtom);
  const [redoList, setRedoList] = useAtom(RedoListAtom);
  const [terminals, setTerminals] = useAtom(TerminalsCapacitorAtom);

  const setFinalResult = useSetAtom(FinalResultCapacitorAtom);

  const setSolvingSteps = useSetAtom(SolvingStepscapacitorAtom);
  const solveCircuit = useCallback(() => {
    const data = new Solver(
      structuredClone(resistanceAll),
      structuredClone(wires),
      terminals[0],
      terminals[1],
      10
    );
    const result = data.solve();
    setSolvingSteps(result);
    setFinalResult(result[result.length - 1].resultingCapacitances[0]);
  }, [resistanceAll, wires, terminals, setSolvingSteps]);

  const undo = () => {
    const lastAction = history.pop();
    if (lastAction) {
      switch (lastAction.action) {
        case USER_ACTION.ADD_RESISTANCE:
          setCapacitanceAll((resistances) => resistances.slice(0, -1));
          break;
        case USER_ACTION.ADD_WIRE:
          setWires((wires) => wires.slice(0, -1));
          break;
        case USER_ACTION.REMOVE_RESISTANCE:
          setCapacitanceAll((prev) => [
            ...prev,
            {
              ...(lastAction.params as Capacitance),
              // name: `R${prev.length + 1}`,
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
          setCapacitanceAll([...(lastAction.params as Circuit).resistances]);
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
          setCapacitanceAll((prev) => [
            ...prev,
            {
              ...(lastAction.params as Capacitance),
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
          setCapacitanceAll((resistances) => resistances.slice(0, -1));
          break;
        case USER_ACTION.REMOVE_WIRE:
          setWires((wires) => wires.slice(0, -1));
          break;
        case USER_ACTION.CLEAR_CKT:
          setCapacitanceAll([]);
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
    setCapacitanceAll([]);
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
