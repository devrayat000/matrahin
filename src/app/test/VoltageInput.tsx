import { useAtom } from "jotai";
import { Slider } from "~/components/ui/slider";
import { VoltageAtom } from "./store";

const VoltageInput = () => {
  const [voltage, setVoltage] = useAtom(VoltageAtom);
  return (
    <div className=" mt-2">
      <Slider
        className="mt-4"
        min={0}
        max={8}
        step={0.01}
        value={[voltage]}
        onValueChange={(value) => {
          setVoltage(value[0]);
        }}
      />
      <div className="flex justify-between">
        {/* <span>-5</span> */}
        <span>0</span>

        <span>8</span>
      </div>
    </div>
  );
};

export default VoltageInput;
