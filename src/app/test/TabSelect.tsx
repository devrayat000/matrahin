"use client";

import { useAtom } from "jotai";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { STORE, tabOpenedAtom } from "./store";

const TabSelect = () => {
  const [tabOpened, setTabOpened] = useAtom(tabOpenedAtom);
  return (
    <div className="flex flex-row gap-3 justify-evenly items-center mb-2">
      <Button
        className={cn(
          tabOpened === STORE.withOutWind
            ? "bg-green-500 text-white"
            : "bg-slate-100 text-black",
          "hover:text-black hover:bg-green-300"
        )}
        onClick={() => setTabOpened(STORE.withOutWind)}
      >
        Normal
      </Button>
      <Button
        className={cn(
          tabOpened === STORE.withWind
            ? "bg-green-500 text-white"
            : "bg-slate-100 text-black",
          "hover:text-black hover:bg-green-300"
        )}
        onClick={() => setTabOpened(STORE.withWind)}
      >
        With Wind
      </Button>
    </div>
  );
};

export default TabSelect;
