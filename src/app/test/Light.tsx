import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";
import { getLightProperties, wavelengthToRGB } from "./CanvasUtils";
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
        width={200}
        height={140}
        transform="translate(550 0) scale(2, 2)"
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

const getBackgroundColor = (intensity) => {
  return `rgba(255,255,255,${1 - intensity})`;
};

const LightInput = () => {
  const [{ wavelength, intensity }, setInput] = useAtom(LightInputAtom);
  return (
    <div className="w-fit">
      <span id="labelU">{getLightProperties(wavelength)}</span>
      <br />
      <div
        id="wavelength"
        className="slider-special flex rounded-lg  w-fit py-2 items-center bg-[url('/visible_light_2.png')]  bg-contain  "
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
