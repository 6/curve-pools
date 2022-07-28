import { ethers } from 'ethers';
import { EtherscanTx } from './etherscan';

export enum CurveTransactionType {
  ADD_LIQUIDITY, // can be one coin only or multiple
  REMOVE_LIQUIDITY, // can be one coin only or multiple
  EXCHANGE,
}

interface ParseTransactionOpts {
  poolInterface: ethers.utils.Interface;
  tx: EtherscanTx;
}
interface ParseTransactionAPI {
  transactionType?: CurveTransactionType;
}
export const parseTransaction = ({
  poolInterface,
  tx,
}: ParseTransactionOpts): ParseTransactionAPI => {
  const decodedInput = poolInterface.parseTransaction({ data: tx.input, value: tx.value });
  let transactionType;
  if (decodedInput.name.startsWith('remove_liquidity')) {
    transactionType = CurveTransactionType.REMOVE_LIQUIDITY;
  } else if (decodedInput.name.startsWith('add_liquidity')) {
    transactionType = CurveTransactionType.ADD_LIQUIDITY;
  } else if (decodedInput.name.startsWith('exchange')) {
    transactionType = CurveTransactionType.EXCHANGE;
  }

  return { transactionType };
};
