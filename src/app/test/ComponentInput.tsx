import { useAtom } from "jotai";
import { cn } from "~/lib/utils";
import { ComponentSelectedAtom } from "./store";

const ComponentInput = () => {
  const [ComponentSelectionType, setComponentSelectionType] = useAtom(
    ComponentSelectedAtom
  );
  return (
    <div className="flex flex-col gap-3 items-center justify-start p-3 text-center">
      <div
        className={cn(
          "bg-slate-300 border border-slate-950 w-full p-5 m-2 font-mono text-3xl cursor-pointer",
          ComponentSelectionType === "R" && "bg-slate-950 text-white"
        )}
        onClick={() => setComponentSelectionType("R")}
      >
        Resistor
      </div>
      <div
        className={cn(
          "bg-slate-300 border border-slate-950 w-full p-5 m-2 font-mono text-3xl cursor-pointer",
          ComponentSelectionType === "wire" && "bg-slate-950 text-white"
        )}
        onClick={() => setComponentSelectionType("wire")}
      >
        Wire
      </div>
    </div>
  );
};

export default ComponentInput;
