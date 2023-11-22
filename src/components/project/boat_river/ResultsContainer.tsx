import { useAtomValue } from "jotai";

import ResultTable from "./ResultTable";
import { boatRiverAtom } from "./store";

export default function ResultsContainer() {
  const projectileParams = useAtomValue(boatRiverAtom);

  if (!projectileParams) {
    return null;
  }

  return (
    <div>
      <div className="flex gap-10 items-start">
        <ResultTable />
      </div>
      <div>{/* <Graphs /> */}</div>
    </div>
  );
}
