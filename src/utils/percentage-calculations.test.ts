import { Decimal } from 'decimal.js';
import { percentageChange, percentageDifference } from './percentage-calculations';

describe('percentage calculations', () => {
  describe('percentageDifference', () => {
    it('returns the correct difference regardless of order of input', () => {
      expect(percentageDifference(10, 6)).toEqual(new Decimal('0.5'));
      expect(percentageDifference(6, 10)).toEqual(new Decimal('0.5'));
    });

    it('returns the correct difference for values with decimal points', () => {
      expect(percentageDifference(new Decimal('1.01'), new Decimal('0.99'))).toEqual(
        new Decimal('0.02'),
      );

      expect(percentageDifference(new Decimal('1.0'), new Decimal('1.02'))).toEqual(
        new Decimal('0.01980198019801980198'),
      );
    });
  });

  describe('percentageChange', () => {
    it('returns the correct change', () => {
      expect(percentageChange(1, 1.02)).toEqual(new Decimal('0.02'));
      expect(percentageChange(1, 0.98)).toEqual(new Decimal('-0.02'));
    });
  });
});
