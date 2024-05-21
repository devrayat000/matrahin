import { useAtom, useSetAtom } from "jotai";
import { CornerRightDown } from "lucide-react";
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

  const componentStyle =
    "bg-slate-300 border border-slate-950 w-full p-1 sm:p-5 m-1 sm:m-2 font-mono text-md sm:text-3xl cursor-pointer";
  return (
    <div className="mt-3">
      <div className="flex flex-row items-end text-left mx-2 text-xl font-serif">
        Select Component to insert
        <span>
          <CornerRightDown />
        </span>
      </div>
      <div className="flex flex-row sm:flex-col gap-1 sm:gap-3 items-center justify-start p-1 sm:p-3 text-center">
        <div
          className={cn(
            componentStyle,
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
            componentStyle,
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
            componentStyle,
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
            componentStyle,
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
    </div>
  );
};

export default ComponentInput;
