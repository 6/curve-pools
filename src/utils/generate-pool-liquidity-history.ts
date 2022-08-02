import { Decimal } from 'decimal.js';
import { ethers } from 'ethers';
import moment, { Moment } from 'moment';
import { CurvePoolExtended } from '../../data/pools';
import { EtherscanTxListResult } from './etherscan';
import { CurveTransactionType, parseTransaction } from './parse-transaction';
import { percentageChange } from './percentage-calculations';

interface GraphDataPoint {
  tokens: Record<string, { added: Decimal; removed: Decimal }>;
  date: string;
}
type TokenSummary = {
  symbol: string;
  totalAdded: Decimal;
  totalRemoved: Decimal;
  tvlNow: Decimal;
  tvlBefore: Decimal;
  tvlPercentChange: Decimal;
};
export type PoolLiquidityHistory = {
  graph: Array<GraphDataPoint>;
  tokensSummary: Array<TokenSummary>;
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
      if (!dataPointsByDate[date]) {
        dataPointsByDate[date] = {
          date,
          tokens: {},
        };
        pool.coins.forEach((coin) => {
          dataPointsByDate[date].tokens[coin.symbol] = {
            added: new Decimal(0),
            removed: new Decimal(0),
          };
        });
      }

      if (transaction.type === CurveTransactionType.ADD_LIQUIDITY) {
        transaction.tokens.forEach((token) => {
          if (token.usdAmount) {
            dataPointsByDate[date].tokens[token.symbol].added = dataPointsByDate[date].tokens[
              token.symbol
            ].added.plus(token.usdAmount);
          }
        });
      } else if (transaction.type === CurveTransactionType.REMOVE_LIQUIDITY) {
        transaction.tokens.forEach((token) => {
          if (token.usdAmount) {
            dataPointsByDate[date].tokens[token.symbol].removed = dataPointsByDate[date].tokens[
              token.symbol
            ].removed.plus(token.usdAmount);
          }
        });
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

  const tokensSummary: Array<TokenSummary> = [];
  pool.coins.forEach((coin) => {
    // NOTE: these do not account for swaps
    const totalAdded = Decimal.sum(
      ...graph.map((dataPoint) => dataPoint.tokens[coin.symbol].added),
    );
    const totalRemoved = Decimal.sum(
      ...graph.map((dataPoint) => dataPoint.tokens[coin.symbol].removed),
    );
    const relativeChange = totalAdded.minus(totalRemoved);
    const poolBalanceFormatted = ethers.utils.formatUnits(coin.poolBalance, coin.decimals);
    const tvlNow = new Decimal(coin.usdPrice).times(poolBalanceFormatted);
    const tvlBefore = tvlNow.minus(relativeChange);
    const tvlPercentChange = percentageChange(tvlBefore, tvlNow);
    tokensSummary.push({
      symbol: coin.symbol,
      totalAdded,
      totalRemoved,
      tvlBefore,
      tvlNow,
      tvlPercentChange,
    });
  });

  return {
    graph,
    tokensSummary,
  };
};
