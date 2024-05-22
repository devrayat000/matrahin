import { useAtom, useSetAtom } from "jotai";
import { Button } from "~/components/ui/button";
import {
  HistoryAtom,
  RedoListAtom,
  Resistance,
  ResistanceAllAtom,
  USER_ACTION,
  Wire,
  WiresAtom,
} from "./store";

const UndoRedoReset = () => {
  const setResistanceAll = useSetAtom(ResistanceAllAtom);
  const setWires = useSetAtom(WiresAtom);
  const [history, setHistory] = useAtom(HistoryAtom);
  const [redoList, setRedoList] = useAtom(RedoListAtom);

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
          setResistanceAll([]);
          setWires([]);
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

  return (
    <div className="flex w-full items-center justify-evenly">
      <Button
        className="font-semibold tracking-widest text-2xl p-4"
        name="undo"
        disabled={history.length === 0}
        onClick={undo}
      >
        UNDO
      </Button>
      <Button
        className="font-semibold tracking-widest text-2xl p-4"
        name="redo"
        disabled={redoList.length === 0}
        onClick={redo}
      >
        REDO
      </Button>
    </div>
  );
};

export default UndoRedoReset;
