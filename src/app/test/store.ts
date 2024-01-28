import { atom } from "jotai";

type RainVelocityType = {
  label: string;
  helperText: string;
};

export const rainUmbrellaData: RainVelocityType[] = [
  { label: "Rain", helperText: "Downwards" },
  { label: "Object", helperText: "(-) means left direction" },
  { label: "Wind", helperText: "(-) means left direction" },
];

export const inputValuesAtom = atom<number[]>([3, 4, 1]);

export type RainVelocityResultsType = {
  v_rain: number;
  v_object: number;
  v_wind: number;
  v_wind_object: number;
  v_rain_object_angle: number;
  v_rain_object_magnitude: number;
  helperText?: string;
};
export const resultAtom = atom<RainVelocityResultsType>({
  // v_rain: 3,
  // v_object: 4,
  // v_wind: 1,
  // v_wind_object: -3,
  // v_rain_object_angle: Math.atan(-1),
  // v_rain_object_magnitude: 3 * Math.sqrt(2),
} as RainVelocityResultsType);
