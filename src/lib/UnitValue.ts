export interface IUnitValue<U extends string> {
  value: number;
  unit: U;
}

export default class UnitValue<U extends string> implements IUnitValue<U> {
  constructor(public readonly value: number, public readonly unit: U) {}
}
