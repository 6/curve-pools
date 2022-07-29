import { Decimal } from 'decimal.js';
import ethereumTxs from './ethereum.json';
import arbitrumTxs from './arbitrum.json';
import optimismTxs from './optimism.json';
import {
  CurveLiquidityImpact,
  CurveTransaction,
  CurveTransactionJSON,
  CurveTransactionType,
} from '../../utils/parse-transaction';
import { Network } from '../../utils/curve.constants';

const topTxsByNetwork: Record<Network, Record<string, Array<CurveTransactionJSON>>> = {
  ethereum: ethereumTxs,
  optimism: optimismTxs,
  arbitrum: arbitrumTxs,
};
interface GetTopPoolTxsProps {
  network: Network;
  contractAddress: string;
}
export const getTopPoolTxs = ({
  network,
  contractAddress,
}: GetTopPoolTxsProps): Array<CurveTransaction> => {
  const txs = topTxsByNetwork[network][contractAddress];
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
