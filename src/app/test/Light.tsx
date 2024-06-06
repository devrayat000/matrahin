import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";
import { wavelengthToRGB } from "./CanvasUtils";
import TorchLight from "./TorchLight";
import { LightInputAtom } from "./store";

import "./style.css";
const Light = () => {
  const { intensity, wavelength } = useAtomValue(LightInputAtom);

  const color = useMemo(
    () => wavelengthToRGB(wavelength, intensity / 2),
    [wavelength, intensity]
  );
  return (
    <g>
      <foreignObject
        width={350}
        height={200}
        transform="translate(480 -40) scale(2, 2)"
      >
        {/* light wavelength input */}
        <LightInput />
      </foreignObject>
      <LightRay fillColor={color} />
      <g transform="translate(-250 100) scale(1.25 1.25) rotate(-60 200 -150) ">
        <TorchLight color={color} />
      </g>
    </g>
  );
};

export default Light;

const LightRay = ({ fillColor }) => {
  return (
    <polygon
      points="250 340 349 185 455 247 250 565"
      fill={fillColor}
      stroke="none"
    />
  );
};

const LightInput = () => {
  const [{ wavelength, intensity }, setInput] = useAtom(LightInputAtom);

  const handleWavelengthChange = (value: number) => {
    setInput((input) => ({
      ...input,
      wavelength: value,
    }));
  };
  return (
    <div className="w-fit">
      <h4 className="text-center">Light Properties</h4>
      {/* <span id="labelU">{getLightProperties(wavelength)}</span> */}
      <div className="flex items-center justify-center gap-1   flex-wrap">
        <div className="flex items-center ">
          <input
            type="number"
            value={wavelength}
            className="w-14 border-2 border-slate-800 rounded-md "
            onChange={(e) => handleWavelengthChange(Number(e.target.value))}
          />
          nm
        </div>
        <div className="flex items-center">
          <input
            type="number"
            value={(300 / wavelength).toFixed(2)} //to 10^15 Hz
            className="w-14 border-2 border-slate-800 rounded-md "
            onChange={(e) => handleWavelengthChange(Number(e.target.value))}
          />
          THz
        </div>
        <div className="flex items-center">
          <input
            type="number"
            // 6.62607015 * 10^-34 * 3 * 10^8 / (wavelength * 10^-9) / 1.6 * 10^-19 = 1242.375 / wavelength
            value={(1242.375 / wavelength).toFixed(2)}
            className="w-14 border-2 border-slate-800 rounded-md "
            onChange={(e) => handleWavelengthChange(Number(e.target.value))}
          />
          eV
        </div>
      </div>
      <div
        id="wavelength"
        className="slider-special flex rounded-lg mt-1 w-fit py-2 items-center bg-[url('/visible_light_2.png')]  bg-contain  "
      >
        <input
          className="slider-special "
          type="range"
          id="rangeU"
          min="100"
          max="850"
          value={wavelength}
          onChange={(e) => {
            setInput((input) => ({
              ...input,
              wavelength: Number(e.target.value),
            }));
          }}
        ></input>
      </div>
      <span id="labelU" className="">
        Intensity: {(intensity * 100).toFixed(0)}%
      </span>
      <div className="border-slate-700 bg-gradient-to-r from-black to-white  slider-special flex w-fit py-2 items-center rounded-md ">
        <input
          className="  border-slate-700 rounded-full cursor-pointer"
          type="range"
          id="rangeU"
          min="0"
          max="100"
          step={1}
          value={intensity * 100}
          onChange={(e) => {
            setInput((input) => ({
              ...input,
              intensity: Number(e.target.value) / 100,
            }));
          }}
        ></input>
      </div>
    </div>
  );
};
