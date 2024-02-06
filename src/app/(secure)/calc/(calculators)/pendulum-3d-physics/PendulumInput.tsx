import { useAtom } from "jotai";
import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import InputWithSlider from "~/components/ui/input-with-slider";
import Pendulum from "./Pendulum";
import { INITIAL_VALUES, inputOptions, pendulumStore } from "./store";

const PendulumInputs = ({
  pendulumRef,
}: {
  pendulumRef: React.RefObject<Pendulum>;
}) => {
  const [length, setLength] = useAtom(pendulumStore.lengthAtom);
  const [mass, setMass] = useAtom(pendulumStore.massAtom);
  const [gravity, setGravity] = useAtom(pendulumStore.gravityAtom);
  const [angle, setAngle] = useAtom(pendulumStore.angleAtom);
  const [isPlaying, setIsPlaying] = useAtom(pendulumStore.isPlayingAtom);
  const [customGravitySelected, setCustomGravitySelected] = useState(false);
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
  };

  const handleChangeInput = (id: number, value: string) => {
    setIsPlaying(false);
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

  return (
    <div className="w-full lg:w-5/6 p-2 flex-col rounded-lg   items-center border-gray-950">
      {/* <div className="w-full lg:w-5/6 mx-auto self-start"> */}

      {inputOptions &&
        inputOptions.map((option, index) => (
          <InputWithSlider
            key={index}
            label={option.label}
            value={values[option.valueText]}
            id={option.id}
            helperText={option.helperText}
            onChangeInput={handleChangeInput}
            min={option.min}
            max={option.max}
          />
        ))}

      <div className="flex flex-row justify-between flex-wrap items-center gap-1 m-3 font-mono rounded-xl  text-white  shadow-[0_5px_10px_rgb(0,0,0,0.4)] bg-[#2f4454] p-3 px-4">
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

        <select
          className="p-2 border text-white text-lg  bg-[#2f4454] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          onChange={(e) => {
            if (e.target.value === "-1") {
              setCustomGravitySelected(true);
            } else {
              handleChangeInput(4, e.target.value);
              setCustomGravitySelected(false);
            }
          }}
        >
          <option value="-1">Custom</option>
          <option selected value="9.8">
            Earth (9.8 m/s²)
          </option>
          <option value="1.6">Moon (1.6 m/s²)</option>
          <option value="24.8">Jupiter (24.8 m/s²)</option>
          <option value="8.9">Mars (8.9 m/s²)</option>
          <option value="10.4">Venus (10.4 m/s²)</option>
          <option value="24.8">Saturn (24.8 m/s²)</option>
          <option value="8.9">Mercury (3.7 m/s²)</option>
          <option value="10.4">Uranus (8.7 m/s²)</option>
          <option value="24.8">Neptune (11.2 m/s²)</option>
          <option value="8.9">Pluto (0.6 m/s²)</option>
        </select>
      </div>

      <center className="flex flex-row items-center justify-around">
        <Button
          disabled={isPlaying}
          onClick={() => {
            calculateResults(angle, length, mass, gravity);
            setIsPlaying(true);
          }}
          className="w-[100px] hover:scale-125 transition-transform duration-300 transform hover:shadow-2xl "
        >
          Calculate
        </Button>
        <div
          className="bg-cyan-300  self-end cursor-pointer hover:shadow-xl hover:scale-125 transition-transform duration-300 transform  p-4   rounded-full "
          onClick={() => {
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
          }}
        >
          <RotateCcw size={25} />
        </div>
      </center>
    </div>
  );
};

export default PendulumInputs;
