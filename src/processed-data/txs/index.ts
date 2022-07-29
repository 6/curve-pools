import { Decimal } from 'decimal.js';
import prominentEthereumTxs from './prominent-ethereum.json';
import prominentArbitrumTxs from './prominent-arbitrum.json';
import prominentOptimismTxs from './prominent-optimism.json';
import {
  CurveLiquidityImpact,
  CurveTransaction,
  CurveTransactionJSON,
  CurveTransactionType,
} from '../../utils/parse-transaction';
import { Network } from '../../utils/curve.constants';

const prominentTxsMap: Record<Network, Record<string, Array<CurveTransactionJSON>>> = {
  ethereum: prominentEthereumTxs,
  optimism: prominentOptimismTxs,
  arbitrum: prominentArbitrumTxs,
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
