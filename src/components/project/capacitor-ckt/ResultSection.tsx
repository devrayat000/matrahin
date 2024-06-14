import { EmblaOptionsType } from "embla-carousel";
import { useAtomValue } from "jotai";
import { Info } from "lucide-react";
import { useEffect, useMemo } from "react";
import EmblaCarousel from "~/components/ui/EmblaCarousel";
import "./../../../embla.css";
import ResultingCircuit from "./ResultingCircuit";
import { SolvingStepscapacitorAtom, StepsInfo } from "./store";

const formatMessage = (message) => {
  return { __html: message.replaceAll("\n", "<br/>") };
};
const ResultSection = ({ resultRef }) => {
  const solvingSteps = useAtomValue(SolvingStepscapacitorAtom);

  const OPTIONS: EmblaOptionsType = {
    slidesToScroll: "auto",
  };

  const slides = useMemo(
    () =>
      solvingSteps.slice(0, solvingSteps.length / 2).map((step, index) => (
        <div key={index} className="w-full ">
          <div className=" ">
            <ResultingCircuit {...step} />
          </div>

          <p className="text-center select-none justify-center text-lg sm:text-xl font-semibold flex items-center gap-2 ">
            <span>
              <Info className="w-6 h-6 m-auto" />
            </span>
            {step.message.replaceAll("\n", "<br/>")}
            {/* <p
              className="text-left"
              dangerouslySetInnerHTML={formatMessage(step.message)}
            /> */}
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
      <div id="slides">
        {slides.length > 0 && (
          <div>
            <h2 ref={resultRef} className="text-3xl font-semibold text-center">
              Solving Steps
            </h2>
            <EmblaCarousel slides={slides} options={OPTIONS} />
          </div>
        )}
      </div>
      <div id="steps">
        {solvingSteps.length > 0 && (
          <StepsBackward steps={solvingSteps.slice(solvingSteps.length / 2)} />
        )}
      </div>
    </>
  );
};

export default ResultSection;

const StepsBackward = ({ steps }: { steps: StepsInfo[] }) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl font-semibold text-center">
        Calculation of Charge, Voltage & Energy
      </h2>
      {steps.map((step, i) => {
        return i % 2 === 0 ? (
          <div key={i} className="w-full ">
            <div className="grid grid-cols-2 gap-2">
              <ResultingCircuit {...steps[i + 1]} />
              <ResultingCircuit {...steps[i]} />
            </div>
            <p className="text-center w-full px-3  select-none justify-center text-lg sm:text-xl  flex items-center gap-2 ">
              <span
                className="text-left"
                dangerouslySetInnerHTML={formatMessage(step.message)}
              />
            </p>
          </div>
        ) : null;
      })}
    </div>
  );
};
