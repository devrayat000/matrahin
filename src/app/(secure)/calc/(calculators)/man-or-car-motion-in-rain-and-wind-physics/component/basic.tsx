"use client";

import { useSearchParams } from "next/navigation";
import RainBasic from "~/components/project/rain_animated/RainBasic";
import RainInput from "~/components/project/rain_animated/RainInput";
import RainWithWind from "~/components/project/rain_animated/RainWithWind";
import TabSelection from "~/components/project/rain_animated/TabSelection";
import Animation from "~/components/project/rain_animated/Animation";

const BasicRainCalculator = () => {
  const searchParams = useSearchParams();
  const Option = searchParams.get("case");
  const activeCase = Option === "with-wind" ? Option : "basic";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4">
      <Animation />
      <div className=" self-start lg:my-3">
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
      </div>
    </div>
  );
};

export default BasicRainCalculator;
