import { useMemo } from 'react';
import moment, { Moment } from 'moment';
import lodash from 'lodash';
import { CurvePoolSimplified } from '../../../data/pools';
import { exchangeRates } from '../../processed-data/logs';

interface DataPoint {
  pair: string;
  rate: number;
  timestamp: Moment;
}
interface UseExchangeRateHistoryProps {
  pool: CurvePoolSimplified;
}
export const useExchangeRateHistory = ({ pool }: UseExchangeRateHistoryProps): Array<DataPoint> => {
  if (pool.network !== 'ethereum') {
    return [];
  }
  return useMemo(() => {
    const ratesForPool = exchangeRates[pool.address.toLowerCase()];
    if (!ratesForPool) {
      return [];
    }
    const pairs = Object.keys(ratesForPool);
    if (!pairs.length) {
      return [];
    }
    return lodash.flatten(
      pairs.map((pair) => {
        return ratesForPool[pair].map((rateData) => {
          return {
            pair,
            rate: Number(rateData.rate),
            timestamp: moment(rateData.timestamp * 1000),
          };
        });
      }),
    );
  }, [pool]);
};
