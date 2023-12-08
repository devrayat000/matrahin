import UnitValue, { IUnitValue } from "./UnitValue";

export default class UnitConverter<T extends string> {
  constructor(private conversionFactors: Record<T, number>) {}

  convert<U extends T>(unitValue: IUnitValue<T>, toUnit: U): IUnitValue<U> {
    const valueInBaseUnit =
      unitValue.value / this.conversionFactors[unitValue.unit];
    const result = valueInBaseUnit * this.conversionFactors[toUnit];
    return new UnitValue<U>(result, toUnit);
  }

  get units(): T[] {
    return Object.keys(this.conversionFactors) as T[];
  }
}

export const lenghtConverter = new UnitConverter({
  m: 1,
  km: 0.001,
  cm: 100,
  mm: 1000,
  ft: 3.28084,
  in: 39.3701,
});

export const massConverter = new UnitConverter({
  g: 1000,
  kg: 1,
  lb: 2.20462,
});

export const velocityConverter = new UnitConverter({
  "m/s": 1,
  "km/h": 0.277778,
  "mile/h": 0.44704,
  "ft/s": 0.3048,
});

export const angleConverter = new UnitConverter({
  deg: 1,
  rad: Math.PI / 180,
  grad: 0.9,
});

export const timeConverter = new UnitConverter({
  s: 1,
  min: 60,
  h: 3600,
});
