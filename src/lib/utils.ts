import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function makeRadian(degree: number) {
  return (degree * Math.PI) / 180;
}

export function makeDegree(radian: number) {
  return (radian * 180) / Math.PI;
}
