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
  isMissingData: boolean;
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
    const data = exchangeRates[pool.address.toLowerCase()];
    if (!data?.graph) {
      return;
    }
    const pairs = Object.keys(data.graph);
    if (!pairs?.length) {
      return;
    }
    const dataPoints = lodash.flatten(
      pairs.map((pair) => {
        return data.graph[pair].map((rateData) => {
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
      isMissingData: data.isMissingData,
    };
  }, [pool]);
};
