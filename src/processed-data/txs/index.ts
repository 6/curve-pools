import { Decimal } from 'decimal.js';
import liquidityHistoryJSON from './liquidity-history.json';
import prominentEthereumTxs from './prominent-ethereum.json';
import prominentArbitrumTxs from './prominent-arbitrum.json';
import prominentOptimismTxs from './prominent-optimism.json';
import prominentPolygonTxs from './prominent-polygon.json';
import prominentFantomTxs from './prominent-fantom.json';
import prominentAvalancheTxs from './prominent-avalanche.json';
import {
  CurveLiquidityImpact,
  CurveTransaction,
  CurveTransactionJSON,
  CurveTransactionType,
} from '../../utils/parse-transaction';
import { Network } from '../../utils/curve.constants';
import { PoolLiquidityHistory } from '../../utils/generate-pool-liquidity-history';

const prominentTxsMap: Record<Network, Record<string, Array<CurveTransactionJSON>>> = {
  ethereum: prominentEthereumTxs,
  optimism: prominentOptimismTxs,
  arbitrum: prominentArbitrumTxs,
  polygon: prominentPolygonTxs,
  fantom: prominentFantomTxs,
  avalanche: prominentAvalancheTxs,
};
interface GetProminentTxsProps {
  network: Network;
  contractAddress: string;
}
export const getProminentTxs = ({
  network,
  contractAddress,
}: GetProminentTxsProps): Array<CurveTransaction> => {
  const txs = prominentTxsMap[network][contractAddress];
  return txs.map(deserializeCurveTransaction);
};

const deserializeCurveTransaction = (curveTxJSON: CurveTransactionJSON): CurveTransaction => {
  let transactionType;
  if (curveTxJSON.type === 'add_liquidity') {
    transactionType = CurveTransactionType.ADD_LIQUIDITY;
  } else if (curveTxJSON.type === 'remove_liquidity') {
    transactionType = CurveTransactionType.REMOVE_LIQUIDITY;
  } else {
    transactionType = CurveTransactionType.EXCHANGE;
  }
  return {
    ...curveTxJSON,
    totalUsdAmount: new Decimal(curveTxJSON.totalUsdAmount),
    type: transactionType,
    tokens: curveTxJSON.tokens.map((token) => {
      const liquidityImpactType =
        token.type === 'add' ? CurveLiquidityImpact.ADD : CurveLiquidityImpact.REMOVE;
      return {
        ...token,
        tokenAmount: token.tokenAmount ? new Decimal(token.tokenAmount) : undefined,
        usdAmount: token.usdAmount ? new Decimal(token.usdAmount) : undefined,
        type: liquidityImpactType,
      };
    }),
  };
};

export const liquidityHistory: Record<string, PoolLiquidityHistory> = {};
for (const [address, historyJSON] of Object.entries(liquidityHistoryJSON)) {
  liquidityHistory[address] = {
    ...historyJSON,
    graph: historyJSON.graph.map((dataPoint) => {
      return {
        ...dataPoint,
        added: new Decimal(dataPoint.added),
        removed: new Decimal(dataPoint.removed),
      };
    }),
    totalAdded: new Decimal(historyJSON.totalAdded),
    totalRemoved: new Decimal(historyJSON.totalRemoved),
    tvlPercentChange: new Decimal(historyJSON.tvlPercentChange),
  } as PoolLiquidityHistory;
}
