import { Decimal } from 'decimal.js';
// https://www.calculator.net/percent-calculator.html#:~:text=Percentage%20Difference%20Formula,percent%2C%20rather%20than%20decimal%20form.
// https://www.calculatorsoup.com/calculators/algebra/percent-difference-calculator.php
export const percentageDifference = (
  number1: Decimal | number,
  number2: Decimal | number,
): Decimal => {
  const n1 = new Decimal(number1);
  const n2 = new Decimal(number2);
  const numerator = n1.minus(n2).absoluteValue();
  const denominator = n1.plus(n2).dividedBy(2);
  return numerator.dividedBy(denominator);
};

// https://www.calculatorsoup.com/calculators/algebra/percent-change-calculator.php
export const percentageChange = (
  originalValue: Decimal | number,
  newValue: Decimal | number,
): Decimal => {
  const originalV = new Decimal(originalValue);
  const newV = new Decimal(newValue);
  return newV.minus(originalV).dividedBy(originalV.abs());
};
