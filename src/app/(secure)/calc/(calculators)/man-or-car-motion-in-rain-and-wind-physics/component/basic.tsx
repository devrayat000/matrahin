"use client";

import { useSetAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import Spinner from "~/components/common/Spinner";
import Animation from "~/components/project/rain_animated/Animation";
import RainBasic from "~/components/project/rain_animated/RainBasic";
import RainInput from "~/components/project/rain_animated/RainInput";
import RainWithWind from "~/components/project/rain_animated/RainWithWind";
import TabSelection from "~/components/project/rain_animated/TabSelection";
import {
  defaultInputValues,
  inputValuesAtom,
} from "~/components/project/rain_animated/store";

function RainCalculatorInput() {
  const searchParams = useSearchParams();
  const Option = searchParams.get("case");
  const activeCase = Option === "with-wind" ? Option : "basic";

  // const setResultsReset = useSetAtom(resultAtom);
  const setInputsReset = useSetAtom(inputValuesAtom);

  useEffect(() => {
    return () => {
      // setResultsReset(undefined);
      setInputsReset(defaultInputValues);
    };
  }, []);

  return (
    <div>
      <div className="flex flex-row gap-3 justify-evenly items-center mb-2">
        <TabSelection
          activeCase={"basic"}
          currentCase={activeCase}
          text={"Normal"}
        />
        <TabSelection
          activeCase={"with-wind"}
          currentCase={activeCase}
          text={"With Wind"}
        />
      </div>

      <div>
        <RainInput wind={activeCase === "with-wind"} />
        <div className="mt-2">
          {activeCase === "basic" && <RainBasic />}
          {activeCase === "with-wind" && <RainWithWind />}
        </div>
      </div>
    </div>
  );
}

const BasicRainCalculator = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4">
      <Animation />
      <div className=" self-start lg:my-3">
        <Suspense fallback={<Spinner />}>
          <RainCalculatorInput />
        </Suspense>
      </div>
    </div>
  );
};

export default BasicRainCalculator;
