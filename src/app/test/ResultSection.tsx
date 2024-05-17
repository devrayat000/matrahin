import { EmblaOptionsType } from "embla-carousel";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import EmblaCarousel from "~/components/ui/EmblaCarousel";
import "./../../embla.css";
import ResultingCircuit from "./ResultingCircuit";
import { SolvingStepsAtom, calculatingAtom } from "./store";

const ResultSection = () => {
  const calculating = useAtomValue(calculatingAtom);
  const solvingSteps = useAtomValue(SolvingStepsAtom);
  if (calculating) {
    return <div>Calculating...</div>;
  }
  const OPTIONS: EmblaOptionsType = {
    slidesToScroll: "auto",
  };
  const slides = useMemo(
    () =>
      solvingSteps.map((step, index) => (
        <div key={index} className="w-full">
          <ResultingCircuit {...step} />
        </div>
      )),
    [solvingSteps]
  );
  return (
    <div>
      <EmblaCarousel slides={slides} options={OPTIONS} />
    </div>
  );
};

export default ResultSection;
