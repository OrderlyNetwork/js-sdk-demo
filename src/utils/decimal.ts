import Decimal from "decimal.js-light";

export const getNumberDigits = (num: number) => {
  // get the number decimal digits
  const str = new Decimal(num).toFixed();

  const index = str.indexOf(".");
  if (index === -1) return 0;
  return str.length - index - 1;
};
