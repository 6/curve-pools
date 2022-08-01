import { Decimal } from 'decimal.js';
import moment, { Moment } from 'moment';
import { CurvePoolExtended } from '../../data/pools';
import { EtherscanTxListResult } from './etherscan';
import { CurveTransactionType, parseTransaction } from './parse-transaction';
import { percentageChange } from './percentage-calculations';

interface GraphDataPoint {
  added: Decimal;
  removed: Decimal;
  date: string;
}
export type PoolLiquidityHistory = {
  graph: Array<GraphDataPoint>;
  totalAdded: Decimal;
  totalRemoved: Decimal;
  tvlPercentChange: Decimal;
};

interface GeneratePoolLiquidityGraphProps {
  minimumTimestamp: Moment;
  pool: CurvePoolExtended;
  txs: EtherscanTxListResult;
}
export const generatePoolLiquidityGraph = ({
  minimumTimestamp,
  pool,
  txs,
}: GeneratePoolLiquidityGraphProps): PoolLiquidityHistory | void => {
  const dataPointsByDate: Record<string, GraphDataPoint> = {};
  for (const tx of txs) {
    try {
      const { transaction } = parseTransaction({ pool, tx });
      if (
        !transaction ||
        ![CurveTransactionType.ADD_LIQUIDITY, CurveTransactionType.REMOVE_LIQUIDITY].includes(
          transaction.type,
        )
      ) {
        continue;
      }
      const timestampMoment = moment(transaction.timestamp * 1000);
      if (timestampMoment.isBefore(minimumTimestamp)) {
        continue;
      }
      const date = timestampMoment.format('YYYY-MM-DD');
      dataPointsByDate[date] ??= {
        added: new Decimal(0),
        removed: new Decimal(0),
        date,
      };
      if (transaction.type === CurveTransactionType.ADD_LIQUIDITY) {
        dataPointsByDate[date].added = dataPointsByDate[date].added.plus(
          transaction.totalUsdAmount,
        );
      } else if (transaction.type === CurveTransactionType.REMOVE_LIQUIDITY) {
        dataPointsByDate[date].removed = dataPointsByDate[date].added.plus(
          transaction.totalUsdAmount,
        );
      }
    } catch (e) {
      console.log('error parsing tx', e);
    }
  }
  const dates = Object.keys(dataPointsByDate);
  if (!dates.length) {
    return;
  }
  const graph = dates.sort().map((date) => dataPointsByDate[date]);
  const totalAdded = Decimal.sum(...graph.map((dataPoint) => dataPoint.added));
  const totalRemoved = Decimal.sum(...graph.map((dataPoint) => dataPoint.removed));
  const relativeChange = totalAdded.minus(totalRemoved);
  const totalTvlNow = new Decimal(pool.usdTotal);
  const totalTvlBefore = new Decimal(pool.usdTotal).minus(relativeChange);
  const tvlPercentChange = percentageChange(totalTvlBefore, totalTvlNow);

  return {
    graph,
    totalAdded,
    totalRemoved,
    tvlPercentChange,
  };
};
