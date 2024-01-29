"use client";

import { useAtom, useSetAtom } from "jotai";
import InputWithSlider from "~/components/ui/input-with-slider";
import { inputValuesAtom, rainUmbrellaData, resultAtom } from "./store";

const RainInput = ({ wind }: { wind: boolean }) => {
  const [inputValues, setInputValues] = useAtom(inputValuesAtom);
  const setResultValues = useSetAtom(resultAtom);

  const handleChangeInput = (id: number, value: string) => {
    setInputValues((prevVelocities) =>
      prevVelocities.map((velocity, index) =>
        index === id ? parseFloat(value) : velocity
      )
    );
  };
  const handleSubmit = () => {
    const rainVelocity = inputValues;
    const v_wind_object = rainVelocity[2] - rainVelocity[1];

    if (v_wind_object === 0) {
      setResultValues({
        v_rain: rainVelocity[0],
        v_object: rainVelocity[1],
        v_wind: rainVelocity[2],
        v_wind_object,
        v_rain_object_angle: -Math.PI / 2,
        v_rain_object_magnitude: rainVelocity[0],
      });
      return;
    }
    if (rainVelocity[0] === 0) {
      setResultValues({
        v_rain: rainVelocity[0],
        v_object: rainVelocity[1],
        v_wind: rainVelocity[2],
        v_wind_object,
        v_rain_object_angle: 0,
        v_rain_object_magnitude: rainVelocity[0],
        helperText: "You don't need an umbrella :)",
      });
      return;
    }

    const v_rain_object_angle = Math.atan2(-rainVelocity[0], v_wind_object);
    const v_rain_object_magnitude = Math.sqrt(
      rainVelocity[0] ** 2 + v_wind_object ** 2
    );

    setResultValues({
      v_rain: rainVelocity[0],
      v_object: rainVelocity[1],
      v_wind: rainVelocity[2],
      v_wind_object,
      v_rain_object_angle,
      v_rain_object_magnitude,
    });
  };
  return (
    <>
      <div className="flex flex-row flex-wrap justify-center gap-4 items-center">
        {rainUmbrellaData.map(({ label, helperText }, index) => {
          if (wind && index === 2) return null;

          return (
            <InputWithSlider
              key={index}
              id={index}
              label={label}
              value={inputValues[index]}
              helperText={helperText}
              onChangeInput={handleChangeInput}
              min={index > 0 ? -10 : 0}
            />
          );
        })}
      </div>
      <div className="flex flex-row flex-wrap justify-center gap-4 items-center">
        <button
          title="Calculate Result"
          className="bg-primary text-white p-2 rounded-md"
          onClick={handleSubmit}
        >
          Calculate
        </button>
      </div>
    </>
  );
};

export default RainInput;
