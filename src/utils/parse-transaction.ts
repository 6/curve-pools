import { BigNumber, ethers } from 'ethers';
import lodash from 'lodash';
import { Decimal } from 'decimal.js';
import { EtherscanTx } from './etherscan';
import { CurveAssetTypeName, CURVE_POOL_TOKEN_DECIMALS } from './curve.constants';
import { CurvePoolWithInterface } from '../../data/pools';

export enum CurveTransactionType {
  ADD_LIQUIDITY, // can be one coin only or multiple
  REMOVE_LIQUIDITY, // can be one coin only or multiple
  EXCHANGE,
}

interface CurveTokenWithAmount {
  symbol: string;
  address: string;
  // may be unknown, need detailed tx logs
  amount?: Decimal;
  // whether this tx is adding or removing token liquidity to pool
  type: 'add' | 'remove';
}

interface CurveTransaction {
  type: CurveTransactionType;
  // Total is unknown for tricrypto or similar pools with different types of
  // assets (TODO)
  totalAmount?: Decimal;
  // Input or output tokens
  tokens: Array<CurveTokenWithAmount>;
}

interface ParseTransactionProps {
  pool: CurvePoolWithInterface;
  tx: EtherscanTx;
}
interface ParseTransactionAPI {
  decodedInput: ethers.utils.TransactionDescription;
  transaction: CurveTransaction | void;
}
export const parseTransaction = ({ pool, tx }: ParseTransactionProps): ParseTransactionAPI => {
  const decodedInput = pool.interface.parseTransaction({ data: tx.input, value: tx.value });
  let transaction;
  if (decodedInput.name.startsWith('remove_liquidity')) {
    transaction = parseRemoveLiquidity({ pool, decodedInput });
  } else if (decodedInput.name.startsWith('add_liquidity')) {
    transaction = parseAddLiquidity({ pool, decodedInput });
  } else if (decodedInput.name.startsWith('exchange')) {
    // transactionType = CurveTransactionType.EXCHANGE;
  }

  return { decodedInput, transaction };
};

interface ParseRemoveLiquidityProps {
  pool: CurvePoolWithInterface;
  decodedInput: ethers.utils.TransactionDescription;
}
const parseRemoveLiquidity = ({
  pool,
  decodedInput,
}: ParseRemoveLiquidityProps): CurveTransaction | void => {
  let totalAmount: Decimal;
  let tokens: Array<CurveTokenWithAmount>;

  if (decodedInput.name === 'remove_liquidity_imbalance') {
    const rawAmounts: Array<BigNumber> = decodedInput.args._amounts;
    totalAmount = new Decimal(0);
    tokens = lodash.compact(
      rawAmounts.map((rawAmount, i) => {
        if (rawAmount.isZero()) {
          // Ignore zero values:
          return;
        }
        const coin = pool.coins[i];
        const decimals = Number(coin.decimals);
        const amount = new Decimal(ethers.utils.formatUnits(rawAmount, decimals));
        totalAmount = totalAmount.add(amount);
        return {
          symbol: coin.symbol,
          address: coin.address,
          amount,
          type: 'remove',
        };
      }),
    );
  } else if (decodedInput.name === 'remove_liquidity_one_coin') {
    const rawAmount = decodedInput.args._token_amount ?? decodedInput.args.token_amount;
    const coin = pool.coins[decodedInput.args.i];
    totalAmount = new Decimal(ethers.utils.formatUnits(rawAmount, CURVE_POOL_TOKEN_DECIMALS));
    tokens = [
      {
        // Output amount of this token unknown without better logs of tx
        symbol: coin.symbol,
        address: coin.address,
        type: 'remove',
      },
    ];
  } else if (decodedInput.name === 'remove_liquidity') {
    const rawAmount = decodedInput.args._amount;
    totalAmount = new Decimal(ethers.utils.formatUnits(rawAmount, CURVE_POOL_TOKEN_DECIMALS));
    // all coins removed in amounts that map to current pool balance/weighting
    tokens = pool.coins.map((coin) => {
      return {
        symbol: coin.symbol,
        address: coin.address,
        type: 'remove',
      };
    });
  } else {
    console.warn('[parseRemoveLiquidity] Unknown transaction type: ', decodedInput.name);
    return;
  }

  return {
    type: CurveTransactionType.REMOVE_LIQUIDITY,
    totalAmount: pool.assetTypeName !== CurveAssetTypeName.UNKNOWN ? totalAmount : undefined,
    tokens,
  };
};

interface ParseAddLiquidityProps {
  pool: CurvePoolWithInterface;
  decodedInput: ethers.utils.TransactionDescription;
}
const parseAddLiquidity = ({
  pool,
  decodedInput,
}: ParseAddLiquidityProps): CurveTransaction | void => {
  let totalAmount: Decimal;
  let tokens: Array<CurveTokenWithAmount>;

  if (decodedInput.name == 'add_liquidity') {
    const rawAmounts: Array<BigNumber> =
      decodedInput.args._amounts ?? decodedInput.args.amounts ?? decodedInput.args.uamounts;
    totalAmount = new Decimal(0);
    tokens = lodash.compact(
      rawAmounts.map((rawAmount, i) => {
        if (rawAmount.isZero()) {
          // Ignore zero values:
          return;
        }
        const coin = pool.coins[i];
        const decimals = Number(coin.decimals);
        const amount = new Decimal(ethers.utils.formatUnits(rawAmount, decimals));
        totalAmount = totalAmount.add(amount);
        return {
          symbol: coin.symbol,
          address: coin.address,
          amount,
          type: 'add',
        };
      }),
    );
  } else {
    console.warn('[parseAddLiquidity] Unknown transaction type: ', decodedInput.name);
    return;
  }

  return {
    type: CurveTransactionType.ADD_LIQUIDITY,
    totalAmount: pool.assetTypeName !== CurveAssetTypeName.UNKNOWN ? totalAmount : undefined,
    tokens,
  };
};
