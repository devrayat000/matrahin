"use client";

import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import InputWithSlider from "~/components/ui/input-with-slider";
import {
  defaultInputValues,
  inputValuesAtom,
  rainUmbrellaData,
  resultAtom,
} from "./store";

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

  useEffect(() => {
    handleSubmit();
  }, []);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const rainVelocity = inputValues;

    const checkInputs = rainVelocity.some(
      (velocity) => velocity > 10 || isNaN(velocity)
    );
    // const checkObjectVelocity = rainVelocity[1] === 0;
    // console.log(checkInputs, checkObjectVelocity);

    if (checkInputs) return;
    const v_wind_object = (wind ? rainVelocity[2] : 0) - rainVelocity[1];

    if (v_wind_object === 0) {
      setResultValues({
        v_rain: rainVelocity[0],
        v_object: rainVelocity[1],
        v_wind: wind ? rainVelocity[2] : 0,
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
        v_wind: wind ? rainVelocity[2] : 0,
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
      v_wind: wind ? rainVelocity[2] : 0,
      v_wind_object,
      v_rain_object_angle,
      v_rain_object_magnitude,
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-row justify-center gap-4 items-center">
        {rainUmbrellaData.map(({ label, helperText }, index) => {
          if (!wind && index === 2) return null;

          return (
            <div className="w-64" key={index}>
              <InputWithSlider
                key={index}
                id={index}
                label={label}
                value={inputValues[index]}
                helperText={helperText}
                onChangeInput={handleChangeInput}
                min={index > 0 ? -10 : 0}
                max={10}
              />
            </div>
          );
        })}
      </div>
      <div className="flex flex-row flex-wrap justify-around gap-4 items-center">
        <Button
          title="Reset to Default"
          className="bg-red-700"
          onClick={() => setInputValues(defaultInputValues)}
        >
          Reset
        </Button>
        <Button title="Calculate Result" className="bg-primary" type="submit">
          Calculate
        </Button>
      </div>
    </form>
  );
};

export default RainInput;
