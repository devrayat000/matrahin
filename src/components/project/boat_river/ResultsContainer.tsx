import { useAtomValue } from "jotai";

import BoatRiverAnimation from "./BoatRiverAnimation";
import ResultTable from "./ResultTable";
import { boatRiverAtom } from "./store";

export default function ResultsContainer() {
  const boatRiverParams = useAtomValue(boatRiverAtom);

  if (!boatRiverParams) {
    return null;
  }

  return (
    <div>
      <div className="flex gap-10 items-center lg:items-start flex-col lg:flex-row justify-center">
        <BoatRiverAnimation />
        <ResultTable />
      </div>
    </div>
  );
}
