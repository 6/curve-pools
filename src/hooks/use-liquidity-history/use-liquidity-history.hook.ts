import { useMemo } from 'react';
import { Decimal } from 'decimal.js';
import { CurvePoolSimplified } from '../../../data/pools';
import { liquidityHistory } from '../../processed-data/txs';

interface DataPoint {
  date: string;
  [tokenLiquidityEvent: string]: number | string;
}
interface LiquidityHistory {
  seriesLabels: Array<string>;
  dataPoints: Array<DataPoint>;
}
interface UseLiquidityHistoryProps {
  pool: CurvePoolSimplified;
}
export const useLiquidityHistory = ({
  pool,
}: UseLiquidityHistoryProps): LiquidityHistory | void => {
  return useMemo(() => {
    // if (pool.network !== 'ethereum') {
    //   return;
    // }
    const data = liquidityHistory[pool.address.toLowerCase()];
    // Consider < 3 datapoints to be insufficient data
    if (!data?.graph || !data?.graph?.length || data.graph.length < 3) {
      return;
    }
    const dataPoints = data.graph.map(({ date, tokens }) => {
      const flattenedTokenData: Record<string, number> = {};
      for (const [tokenSymbol, tokenData] of Object.entries(tokens)) {
        flattenedTokenData[tokenSymbol] ??= 0;
        if (tokenData.added.greaterThan(0)) {
          flattenedTokenData[tokenSymbol] = new Decimal(flattenedTokenData[tokenSymbol])
            .plus(tokenData.added)
            .toNumber();
        }
        if (tokenData.removed.greaterThan(0)) {
          flattenedTokenData[tokenSymbol] = new Decimal(flattenedTokenData[tokenSymbol])
            .minus(tokenData.removed)
            .toNumber();
        }
      }
      return {
        date,
        ...flattenedTokenData,
      };
    });
    const seriesLabels = [];
    for (const key in dataPoints[0]) {
      if (key === 'date') {
        continue;
      }
      seriesLabels.push(key);
    }
    return {
      seriesLabels,
      dataPoints,
    };
  }, [pool]);
};
