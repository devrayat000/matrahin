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
  const SLIDES = useMemo(
    () =>
      solvingSteps.map((step, index) => {
        return <ResultingCircuit key={index} {...step} />;
      }),
    [solvingSteps]
  );
  return (
    <div>
      <EmblaCarousel slides={SLIDES} options={OPTIONS} />
    </div>
  );
};

export default ResultSection;
