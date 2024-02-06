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
    <div className="w-full lg:w-5/6 mx-auto self-start">
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

      <div className="flex flex-col gap-1 items-center mb-2 border px-6 py-3 bg-stone-50 ">
        {/* <div className="text-xs mt-1 self-start text-gray-500">
          Gravity {"("}where the experiment is being conducted{")"}
        </div> */}

        <div className="flex flex-row justify-between  w-full  gap-1 items-center">
          <label style={{ marginRight: "5px" }}>
            Gravity {"("}m/s<sup>2</sup>
            {")"}
          </label>

          <input
            className="ml-1 p-2 border w-[9ch] disabled:bg-gray-100 disabled:cursor-not-allowed"
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
          className="p-2 border"
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
