import { useAtom } from "jotai";
import { VoltageAtom } from "./store";

const VoltageInput = () => {
  const [voltage, setVoltage] = useAtom(VoltageAtom);
  return (
    <div className="w-fit mt-2">
      {/* <Slider
        className="mt-4"
        min={0}
        max={8}
        step={0.01}
        value={[voltage]}
        onValueChange={(value) => {
          setVoltage(value[0]);
        }}
      /> */}

      <input
        className="border-slate-700 mt-2 rounded-full cursor-pointer"
        type="range"
        id="rangeU"
        min="0"
        max="8"
        step={0.01}
        value={voltage}
        onChange={(e) => {
          setVoltage(Number(e.target.value));
        }}
      ></input>
      <span className="flex justify-between -mt-2 select-none">
        {/* <span>-5</span> */}
        <span>0.00</span>

        <span>8.00</span>
      </span>
    </div>
  );
};

export default VoltageInput;
