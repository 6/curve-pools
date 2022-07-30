import { Decimal } from 'decimal.js';
import { percentageDifference } from './percentage-difference';

describe('percentageDifference', () => {
  it('returns the correct difference regardless of order of input', () => {
    expect(percentageDifference(10, 6)).toEqual(new Decimal('0.5'));
    expect(percentageDifference(6, 10)).toEqual(new Decimal('0.5'));
  });

  it('returns the correct difference for values with decimal points', () => {
    expect(percentageDifference(new Decimal('1.01'), new Decimal('0.99'))).toEqual(
      new Decimal('0.02'),
    );

    expect(percentageDifference(new Decimal('1.023'), new Decimal('1.0'))).toEqual(
      new Decimal('0.022738507167572911518'),
    );
  });
});
