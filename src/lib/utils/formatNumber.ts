/**
 * Formats a number for display.
 * If the number is in scientific notation, it will be formatted as coefficient times 10 to the power of exponent.
 * Otherwise, it will be formatted with two decimal places.
 * @param number - The number to format.
 * @returns The formatted number as a string (in LaTeX format).
 */
export const formatNumber = (number: number) => {
  const isScientificNotation = (num: number) =>
    (num >= 999 && num < 1e20) || num < 0.1;

  if (number === 0) return "0";
  if (isScientificNotation(number)) {
    const exponent = Math.floor(Math.log10(number));
    const coefficient = number / 10 ** exponent;

    return `${coefficient.toFixed(2)} \\times 10^{${exponent}}`;
  }

  return `${number.toFixed(2)}`;
};
