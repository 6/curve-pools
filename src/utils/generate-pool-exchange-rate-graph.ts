import { Decimal } from 'decimal.js';
import lodash from 'lodash';
import { CurvePoolExtended } from '../../data/pools';
import { CurveAssetTypeName } from './curve.constants';
import { LogCurveTokenAmount, ParsedCurveLog } from './parse-log';
import { CurveTransactionType } from './parse-transaction';

interface GraphDataPoint {
  rate: Decimal;
  timestamp: number;
}
export type GraphDataPoints = Record<string, Array<GraphDataPoint>>;

interface GeneratePoolExchangeRateGraphProps {
  pool: CurvePoolExtended;
  logs: Array<ParsedCurveLog>;
}
export const generatePoolExchangeRateGraph = ({
  pool,
  logs,
}: GeneratePoolExchangeRateGraphProps): GraphDataPoints | void => {
  if (pool.assetTypeName === CurveAssetTypeName.UNKNOWN) {
    // Don't support crypto pools like tricrypto with uncorrelated assets.
    return;
  }
  const relevantLogs = logs.filter(
    (log) => log.type === CurveTransactionType.EXCHANGE && log.totalUsdAmount.greaterThan(0),
  );
  if (!relevantLogs.length) {
    return;
  }

  // For each distinct possible asset pair, generate the graph of exchange rate
  // overtime:
  const dataPointsByTokenPair: Record<string, Array<GraphDataPoint>> = {};

  for (const log of relevantLogs) {
    // Note: `usdPrice` is static value for all logs
    const tokensOrdered = lodash.orderBy(log.tokens, 'usdPrice', 'asc');
    const tokenPairKey = tokensOrdered.map((t) => t.symbol).join('/');
    dataPointsByTokenPair[tokenPairKey] ??= [];

    const token1 = tokensOrdered[0] as LogCurveTokenAmount;
    const token2 = tokensOrdered[1] as LogCurveTokenAmount;
    const rate = token2.tokenAmount.dividedBy(token1.tokenAmount);
    dataPointsByTokenPair[tokenPairKey] = dataPointsByTokenPair[tokenPairKey].concat({
      rate,
      timestamp: log.timestamp,
    });
  }
  return dataPointsByTokenPair;
};
