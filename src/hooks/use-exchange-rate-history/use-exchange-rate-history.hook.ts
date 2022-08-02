import { useMemo } from 'react';
import lodash from 'lodash';
import moment from 'moment';
import { CurvePoolSimplified } from '../../../data/pools';
import { exchangeRates } from '../../processed-data/logs';

interface DataPoint {
  date: string;
  [tokenPair: string]: number | string;
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
            date: moment(rateData.timestamp * 1000).format('YYYY-MM-DD hh'),
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
