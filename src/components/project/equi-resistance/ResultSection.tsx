import { EmblaOptionsType } from "embla-carousel";
import { useAtomValue } from "jotai";
import { Info } from "lucide-react";
import { useMemo, useEffect } from "react";
import EmblaCarousel from "~/components/ui/EmblaCarousel";
import "./../../../embla.css";
import ResultingCircuit from "./ResultingCircuit";
import { SolvingStepsAtom } from "./store";

const ResultSection = ({ resultRef }) => {
  const solvingSteps = useAtomValue(SolvingStepsAtom);

  const OPTIONS: EmblaOptionsType = {
    slidesToScroll: "auto",
  };

  const slides = useMemo(
    () =>
      solvingSteps.map((step, index) => (
        <div key={index} className="w-full ">
          <div className=" ">
            <ResultingCircuit {...step} />
          </div>

          <p className="text-center justify-center text-lg sm:text-xl font-semibold flex items-center gap-2 ">
            <span>
              <Info className="w-6 h-6 m-auto" />
            </span>
            {step.message}
          </p>
        </div>
      )),
    [solvingSteps]
  );

  useEffect(() => {
    if (slides.length > 0 && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [slides, resultRef]);

  return (
    <>
      {slides.length > 0 && (
        <div ref={resultRef}>
          <EmblaCarousel slides={slides} options={OPTIONS} />
        </div>
      )}
    </>
  );
};

export default ResultSection;
