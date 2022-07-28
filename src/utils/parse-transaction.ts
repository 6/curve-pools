import { BigNumber, ethers } from 'ethers';
import lodash from 'lodash';
import { CurvePoolMetadata } from './curve-api';
import { EtherscanTx } from './etherscan';

export enum CurveTransactionType {
  ADD_LIQUIDITY, // can be one coin only or multiple
  REMOVE_LIQUIDITY, // can be one coin only or multiple
  EXCHANGE,
}

interface CurveTokenWithAmount {
  symbol: string;
  decimals: number;
  address: string;
  amount?: {
    value: BigNumber; // may be unknown, need detailed tx logs
    formatted: string;
  };
}

interface CurveTransaction {
  type: CurveTransactionType;
  totalAmount: {
    value: BigNumber;
    formatted: string;
  };
  tokens: Array<CurveTokenWithAmount>;
}

interface ParseTransactionProps {
  pool: CurvePoolMetadata;
  poolInterface: ethers.utils.Interface;
  tx: EtherscanTx;
}
interface ParseTransactionAPI {
  decodedInput: ethers.utils.TransactionDescription;
  transaction: CurveTransaction | void;
}
export const parseTransaction = ({
  pool,
  poolInterface,
  tx,
}: ParseTransactionProps): ParseTransactionAPI => {
  const decodedInput = poolInterface.parseTransaction({ data: tx.input, value: tx.value });
  let transaction;
  if (decodedInput.name.startsWith('remove_liquidity')) {
    transaction = parseRemoveLiquidity({ pool, decodedInput });
  } else if (decodedInput.name.startsWith('add_liquidity')) {
    // transactionType = CurveTransactionType.ADD_LIQUIDITY;
  } else if (decodedInput.name.startsWith('exchange')) {
    // transactionType = CurveTransactionType.EXCHANGE;
  }

  return { decodedInput, transaction };
};

interface ParseRemoveLiquidityProps {
  pool: CurvePoolMetadata;
  decodedInput: ethers.utils.TransactionDescription;
}
const parseRemoveLiquidity = ({
  pool,
  decodedInput,
}: ParseRemoveLiquidityProps): CurveTransaction | void => {
  let totalRemoved: BigNumber;
  let tokens: Array<CurveTokenWithAmount>;

  if (decodedInput.name === 'remove_liquidity_imbalance') {
    const rawAmounts: Array<BigNumber> = decodedInput.args._amounts;
    totalRemoved = BigNumber.from('0');
    tokens = lodash.compact(
      rawAmounts.map((rawAmount, i) => {
        if (rawAmount.isZero()) {
          // Ignore zero values:
          return;
        }
        const coin = pool.coins[i];
        const decimals = Number(coin.decimals);
        const formattedAmount = ethers.utils.formatUnits(rawAmount, decimals);
        // TODO
        // totalRemoved = totalRemoved.add(BigNumber.from(formattedAmount));
        return {
          symbol: coin.symbol,
          address: coin.address,
          decimals,
          amount: {
            value: rawAmount,
            formatted: formattedAmount,
          },
        };
      }),
    );
  } else if (decodedInput.name === 'remove_liquidity_one_coin') {
    totalRemoved = decodedInput.args._token_amount ?? decodedInput.args.token_amount;
    const coin = pool.coins[decodedInput.args.i];
    tokens = [
      {
        // Output amount of this token unknown without better logs of tx
        symbol: coin.symbol,
        address: coin.address,
        decimals: Number(coin.decimals),
      },
    ];
  } else if (decodedInput.name === 'remove_liquidity') {
    totalRemoved = decodedInput.args._amount;
    // all coins removed in amounts that map to current pool balance
    tokens = pool.coins.map((coin) => {
      return {
        symbol: coin.symbol,
        address: coin.address,
        decimals: Number(coin.decimals),
      };
    });
  } else {
    console.warn('[parseRemoveLiquidity] Unknown transaction type: ', decodedInput.name);
    return;
  }

  return {
    type: CurveTransactionType.REMOVE_LIQUIDITY,
    totalAmount: {
      value: totalRemoved,
      formatted: ethers.utils.formatUnits(totalRemoved, 18),
    },
    tokens,
  };
};
