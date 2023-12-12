Number.prototype.toCalc = function (fractionalDigits?: number) {
  return this.toLocaleString(undefined, {
    maximumFractionDigits: fractionalDigits || 3,
  });
};

declare global {
  interface Number {
    /**
     * Formats the number to 3 fractional digits.
     */
    toCalc(): string;
    /**
     * Formats the number to desired fractional digits.
     * @param fractionalDigits The number of fractional digits to format the number to.
     */
    toCalc(fractionalDigits: number): string;
  }
}
export {};
