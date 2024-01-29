"use client";

import { MathJaxContext } from "better-react-mathjax";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import RainBasic from "~/components/project/rain_animated/RainBasic";
import RainInput from "~/components/project/rain_animated/RainInput";
import RainWithWind from "~/components/project/rain_animated/RainWithWind";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const config = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
  },
};

const RiverPage = () => {
  const searchParams = useSearchParams();
  const Option = searchParams.get("case");
  const activeCase = Option === "with-wind" ? Option : "basic";

  return (
    <div>
      <MathJaxContext version={3} config={config}>
        <div className="flex flex-row gap-3 justify-evenly items-center mb-2">
          <Link href={`?case=basic`}>
            <Button
              disabled={activeCase === "basic"}
              className={cn(
                activeCase === "basic"
                  ? "bg-green-500 text-white"
                  : "bg-slate-100 text-black",
                "hover:text-black hover:bg-green-300"
              )}
            >
              Normal
            </Button>
          </Link>
          <Link href={`?case=with-wind`}>
            <Button
              disabled={activeCase === "with-wind"}
              className={cn(
                activeCase === "with-wind"
                  ? "bg-green-500 text-white"
                  : "bg-slate-100 text-black",
                "hover:text-black hover:bg-green-300"
              )}
            >
              With Wind
            </Button>
          </Link>
        </div>

        <div>
          <RainInput wind={activeCase !== "with-wind"} />
          {activeCase === "basic" && <RainBasic />}
          {activeCase === "with-wind" && <RainWithWind />}
        </div>
      </MathJaxContext>
    </div>
  );
};

export default RiverPage;
