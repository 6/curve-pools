import { useMemo } from 'react';
import lodash from 'lodash';
import { CurvePoolSimplified } from '../../../data/pools';
import { exchangeRates } from '../../processed-data/logs';

interface DataPoint {
  timestamp: number;
  [tokenPair: string]: number;
}
interface ExchangeRateHistory {
  seriesLabels: Array<string>;
  dataPoints: Array<DataPoint>;
}
interface UseExchangeRateHistoryProps {
  pool: CurvePoolSimplified;
}
export const useExchangeRateHistory = ({
  pool,
}: UseExchangeRateHistoryProps): ExchangeRateHistory | void => {
  return useMemo(() => {
    if (pool.network !== 'ethereum') {
      return;
    }
    const ratesForPool = exchangeRates[pool.address.toLowerCase()];
    if (!ratesForPool) {
      return;
    }
    const pairs = Object.keys(ratesForPool);
    if (!pairs?.length) {
      return;
    }
    const dataPoints = lodash.flatten(
      pairs.map((pair) => {
        return ratesForPool[pair].map((rateData) => {
          return {
            [pair]: Number(rateData.rate),
            timestamp: rateData.timestamp,
          };
        });
      }),
    );
    return {
      seriesLabels: pairs,
      dataPoints,
    };
  }, [pool]);
};
