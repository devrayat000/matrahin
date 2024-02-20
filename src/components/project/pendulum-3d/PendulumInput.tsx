import { useAtom, useSetAtom } from "jotai";
import { Info, MinusSquare, PlusSquare, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import InputWithSlider from "~/components/ui/input-with-slider";
import { Slider } from "~/components/ui/slider";
import { cn } from "~/lib/utils";
import Pendulum from "./Pendulum";
import { INITIAL_VALUES, inputOptions, pendulumStore } from "./store";

const PendulumInputs = ({
  pendulumRef,
}: {
  pendulumRef: React.RefObject<Pendulum>;
}) => {
  const [length, setLength] = useAtom(pendulumStore.lengthAtom);
  const setSubmittedInputs = useSetAtom(pendulumStore.submittedInputsAtom);
  const [mass, setMass] = useAtom(pendulumStore.massAtom);
  const [gravity, setGravity] = useAtom(pendulumStore.gravityAtom);
  const [angle, setAngle] = useAtom(pendulumStore.angleAtom);
  const [isPlaying, setIsPlaying] = useAtom(pendulumStore.isPlayingAtom);
  const [customGravitySelected, setCustomGravitySelected] = useState(false);
  const [inputChanged, setInputChanged] = useAtom(
    pendulumStore.inputChangedAtom
  );
  const values = useMemo(() => {
    return {
      length,
      mass,
      gravity,
      angle,
    };
  }, [length, mass, gravity, angle]);

  const calculateResults = (
    angle: number,
    length: number,
    mass: number,
    gravity: number
  ) => {
    pendulumRef.current?.setValue("angle", Number((angle * Math.PI) / 180));
    pendulumRef.current?.setValue("length", Number(length));
    pendulumRef.current?.setValue("mass", Number(mass));
    pendulumRef.current?.setValue("gravity", Number(gravity));
    pendulumRef.current?.resetSwingCount();
  };

  const handleChangeInput = (id: number, value: string) => {
    setIsPlaying(false);
    setInputChanged(true);
    switch (id) {
      case 1:
        setAngle(Number(value));
        break;
      case 2:
        setLength(Number(value));
        break;
      case 3:
        setMass(Number(value));
        break;
      case 4:
        setGravity(Number(value));
        break;
    }
    calculateResults(angle, length, mass, gravity);
  };

  const reset = () => {
    setInputChanged(true);
    setLength(INITIAL_VALUES.length);
    setMass(INITIAL_VALUES.mass);
    setGravity(INITIAL_VALUES.gravity);
    setAngle(INITIAL_VALUES.angle);
    calculateResults(
      INITIAL_VALUES.angle,
      INITIAL_VALUES.length,
      INITIAL_VALUES.mass,
      INITIAL_VALUES.gravity
    );
    setIsPlaying(false);

    setCustomGravitySelected(false);

    setSubmittedInputs({
      angle: Math.abs(INITIAL_VALUES.angle),
      length: INITIAL_VALUES.length,
      mass: INITIAL_VALUES.mass,
      gravity: INITIAL_VALUES.gravity,
    });
  };

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  return (
    <div className="w-full  flex-col  rounded-lg   items-center border-gray-950">
      {/* <div className="w-full lg:w-5/6 mx-auto self-start"> */}

      {/* <div className="flex flex-row md:flex-col gap-2 items-center justify-center w-full mx-auto"> */}
      {inputOptions &&
        inputOptions.map((option, index) => (
          <div className="w-72 mb-2 mx-auto" key={index}>
            <InputWithSlider
              label={option.label}
              value={values[option.valueText]}
              id={option.id}
              helperText={option.helperText}
              onChangeInput={handleChangeInput}
              min={option.min}
              max={option.max}
            />
          </div>
        ))}

      {/* <div className="flex flex-row w-64 justify-between flex-wrap items-center gap-1 m-3 font-mono rounded-xl  text-white  shadow-[0_5px_10px_rgb(0,0,0,0.4)] bg-[#2f4454] p-3 px-4"> */}
      <div className="w-72  mx-auto mb-2 ">
        <div className="flex flex-row justify-between flex-wrap items-center gap-1 m-1 font-mono rounded-xl  text-white  shadow-[0_5px_10px_rgb(0,0,0,0.4)] bg-[#2f4454] p-3 px-4">
          {/* <div className="text-xs mt-1 self-start text-gray-500">
          Gravity {"("}where the experiment is being conducted{")"}
        </div> */}

          <div className="flex flex-row justify-between  w-full  gap-0 items-center">
            <label className="mr-2 text-lg font-bold">Gravity</label>

            <input
              className="ml-1 px-2 py-1 rounded-xl border text-white text-lg  bg-[#2f4454] w-[9ch] disabled:cursor-not-allowed"
              type="number"
              step={0.1}
              min={1}
              max={100}
              value={gravity}
              disabled={!customGravitySelected}
              onChange={(e) => handleChangeInput(4, e.target.value)}
            />
          </div>
          <div
            style={{
              display: customGravitySelected ? "flex" : "none",
            }}
            className="mb-2 flex flex-row justify-between  w-full  gap-2 mt-1 items-center"
          >
            <button
              name="-1"
              disabled={gravity <= 0.1}
              className="disabled:opacity-50"
              onClick={() => handleChangeInput(4, (gravity - 1).toString())}
            >
              <MinusSquare />
            </button>
            <Slider
              min={0.1}
              max={100}
              step={1}
              value={[gravity]}
              onValueChange={([val]) => handleChangeInput(4, val.toString())}
              className="mt-2"
            />

            <button
              name="+1"
              disabled={gravity >= 100}
              className="disabled:opacity-50"
              onClick={() => handleChangeInput(4, (gravity + 1).toString())}
            >
              <PlusSquare />
            </button>
          </div>

          <select
            className="p-2 border w-[16ch] text-white   bg-[#2f4454] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            onChange={(e) => {
              if (e.target.value === "-1") {
                setCustomGravitySelected(true);
              } else {
                handleChangeInput(4, e.target.value);
                setCustomGravitySelected(false);
              }
            }}
            defaultValue={9.8}
          >
            <option value="-1">Custom</option>
            <option value="9.8">Earth (9.8)</option>
            <option value="1.6">Moon (1.6)</option>
            <option value="24.8">Jupiter (24.8)</option>
            <option value="8.9">Mars (8.9)</option>
            <option value="10.4">Venus (10.4)</option>
            <option value="24.8">Saturn (24.8)</option>
            <option value="8.9">Mercury (3.7)</option>
            <option value="10.4">Uranus (8.7)</option>
            <option value="24.8">Neptune (11.2)</option>
            <option value="8.9">Pluto (0.6)</option>
          </select>
        </div>
      </div>
      {/* </div> */}

      <center className="flex flex-row items-center justify-around">
        <div
          title="reset"
          className="bg-cyan-300  self-start cursor-pointer hover:shadow-xl hover:scale-125 transition-transform duration-300 transform  p-4   rounded-full "
          onClick={reset}
        >
          <RotateCcw size={25} />
        </div>
        <Button
          disabled={isPlaying || !inputChanged}
          onClick={() => {
            calculateResults(angle, length, mass, gravity);
            setIsPlaying(true);
            setInputChanged(false);
            setSubmittedInputs({
              angle: Math.abs(angle),
              length,
              mass,
              gravity,
            });
          }}
          // className="w-[100px] hover:scale-125 transition-transform duration-300 transform hover:shadow-2xl "
          className={cn(
            "w-[100px] hover:scale-125 transition-transform duration-300 transform hover:shadow-2xl",
            inputChanged ? "bg-green-500 scale-125" : "scale-100"
          )}
        >
          Calculate
        </Button>
      </center>

      {/* info: press calculate to see results */}
      {inputChanged && (
        <div className="flex flex-row items-center justify-center w-full gap-2 mt-2 text-sm text-gray-500">
          <Info size={20} />
          <span>Press Calculate to see results</span>
        </div>
      )}
    </div>
  );
};

export default PendulumInputs;
