import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import { cn } from "~/lib/utils";
import { ComponentSelectedAtom, currentPointAtom } from "./store";

const ComponentInput = () => {
  const [ComponentSelectionType, setComponentSelectionType] = useAtom(
    ComponentSelectedAtom
  );
  const setCurrentPoint = useSetAtom(currentPointAtom);

  useEffect(() => {
    setCurrentPoint({ x: -1, y: -1 });
  }, [ComponentSelectionType]);

  return (
    <div className="flex flex-col gap-3 items-center justify-start p-3 text-center">
      <div
        className={cn(
          "bg-slate-300 border border-slate-950 w-full p-5 m-2 font-mono text-3xl cursor-pointer",
          ComponentSelectionType === "R" && "bg-slate-950 text-white"
        )}
        onClick={() =>
          ComponentSelectionType === "R"
            ? setComponentSelectionType("none")
            : setComponentSelectionType("R")
        }
      >
        Resistor
      </div>
      <div
        className={cn(
          "bg-slate-300 border border-slate-950 w-full p-5 m-2 font-mono text-3xl cursor-pointer",
          ComponentSelectionType === "wire" && "bg-slate-950 text-white"
        )}
        onClick={() =>
          ComponentSelectionType === "wire"
            ? setComponentSelectionType("none")
            : setComponentSelectionType("wire")
        }
      >
        Wire
      </div>
      <div
        className={cn(
          "bg-slate-300 border border-slate-950 w-full p-5 m-2 font-mono text-3xl cursor-pointer",
          ComponentSelectionType === "t1" && "bg-blue-900 text-white"
        )}
        onClick={() =>
          ComponentSelectionType === "t1"
            ? setComponentSelectionType("none")
            : setComponentSelectionType("t1")
        }
      >
        Terminal1
      </div>
      <div
        className={cn(
          "bg-slate-300 border border-slate-950 w-full p-5 m-2 font-mono text-3xl cursor-pointer",
          ComponentSelectionType === "t2" && "bg-green-600 text-white"
        )}
        onClick={() =>
          ComponentSelectionType === "t2"
            ? setComponentSelectionType("none")
            : setComponentSelectionType("t2")
        }
      >
        Terminal2
      </div>
    </div>
  );
};

export default ComponentInput;
