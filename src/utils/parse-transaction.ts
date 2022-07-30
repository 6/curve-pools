import { BigNumber, ethers } from 'ethers';
import lodash from 'lodash';
import { Decimal } from 'decimal.js';
import { EtherscanTx } from './etherscan';
import { CURVE_POOL_TOKEN_DECIMALS } from './curve.constants';
import { CurvePoolExtended } from '../../data/pools';

export enum CurveTransactionType {
  ADD_LIQUIDITY = 'add_liquidity', // can be one coin only or multiple
  REMOVE_LIQUIDITY = 'remove_liquidity', // can be one coin only or multiple
  EXCHANGE = 'exchange',
}

export enum CurveLiquidityImpact {
  ADD = 'add',
  REMOVE = 'remove',
}

export interface CurveTokenWithAmount {
  symbol: string;
  address: string;
  // may be unknown in some cases, need detailed tx logs
  tokenAmount?: Decimal;
  usdAmount?: Decimal;
  // whether this tx is adding or removing token liquidity to pool
  type: CurveLiquidityImpact;
}

export interface CurveTransaction {
  hash: string;
  pool: string;
  timestamp: number;
  type: CurveTransactionType;
  totalUsdAmount: Decimal;
  // Input or output tokens
  tokens: Array<CurveTokenWithAmount>;
}

// JSON representations of above (TODO: better way?)
interface CurveTokenWithAmountJSON {
  symbol: string;
  address: string;
  tokenAmount?: string;
  usdAmount?: string;
  type: string;
}
export interface CurveTransactionJSON {
  hash: string;
  pool: string;
  timestamp: number;
  type: string;
  totalUsdAmount: string;
  // Input or output tokens
  tokens: Array<CurveTokenWithAmountJSON>;
}

interface ParseTransactionProps {
  pool: CurvePoolExtended;
  tx: EtherscanTx;
}
interface ParseTransactionAPI {
  decodedInput: ethers.utils.TransactionDescription | void;
  transaction: CurveTransaction | void;
}
export const parseTransaction = ({ pool, tx }: ParseTransactionProps): ParseTransactionAPI => {
  if (tx.txreceipt_status !== '1' || tx.isError === '1') {
    // Sometimes failed / reverted tx cannot be decoded/parsed correctly
    return { decodedInput: undefined, transaction: undefined };
  }
  if (!tx.to) {
    // `to` is empty on deploy contract call
    return { decodedInput: undefined, transaction: undefined };
  }
  let decodedInput;
  try {
    decodedInput = pool.interface.parseTransaction({ data: tx.input, value: tx.value });
  } catch (e) {
    if ((e as any).code === 'INVALID_ARGUMENT') {
      return { decodedInput: undefined, transaction: undefined };
    }
    throw e;
  }
  let transaction;
  if (decodedInput.name.startsWith('remove_liquidity')) {
    transaction = parseRemoveLiquidity({ tx, pool, decodedInput });
  } else if (decodedInput.name.startsWith('add_liquidity')) {
    transaction = parseAddLiquidity({ tx, pool, decodedInput });
  } else if (decodedInput.name.startsWith('exchange')) {
    transaction = parseExchange({ tx, pool, decodedInput });
  }

  return { decodedInput, transaction };
};

interface ParseRemoveLiquidityProps {
  tx: EtherscanTx;
  pool: CurvePoolExtended;
  decodedInput: ethers.utils.TransactionDescription;
}
const parseRemoveLiquidity = ({
  tx,
  pool,
  decodedInput,
}: ParseRemoveLiquidityProps): CurveTransaction | void => {
  let totalUsdAmount: Decimal;
  let tokens: Array<CurveTokenWithAmount>;

  if (decodedInput.name === 'remove_liquidity_imbalance') {
    const rawAmounts: Array<BigNumber> = decodedInput.args._amounts ?? decodedInput.args.amounts;
    totalUsdAmount = new Decimal(0);
    tokens = lodash.compact(
      rawAmounts.map((rawAmount, i) => {
        if (rawAmount.isZero()) {
          // Ignore zero values:
          return;
        }
        const coin = pool.coins[i];
        const decimals = Number(coin.decimals);
        const tokenAmount = new Decimal(ethers.utils.formatUnits(rawAmount, decimals));
        const usdAmount = tokenAmount.times(coin.usdPrice);
        totalUsdAmount = totalUsdAmount.add(usdAmount);
        return {
          symbol: coin.symbol,
          address: coin.address,
          tokenAmount,
          usdAmount,
          type: CurveLiquidityImpact.REMOVE,
        };
      }),
    );
  } else if (decodedInput.name === 'remove_liquidity_one_coin') {
    const rawAmount =
      decodedInput.args._token_amount ??
      decodedInput.args.token_amount ??
      decodedInput.args._burn_amount;
    const coin = pool.coins[decodedInput.args.i];
    const tokenAmount = new Decimal(ethers.utils.formatUnits(rawAmount, CURVE_POOL_TOKEN_DECIMALS));
    const usdAmount = tokenAmount.times(coin.usdPrice);
    totalUsdAmount = usdAmount;
    tokens = [
      {
        symbol: coin.symbol,
        address: coin.address,
        tokenAmount,
        usdAmount,
        type: CurveLiquidityImpact.REMOVE,
      },
    ];
  } else if (decodedInput.name === 'remove_liquidity') {
    const rawAmount = decodedInput.args._amount ?? decodedInput.args._burn_amount;
    totalUsdAmount = new Decimal(ethers.utils.formatUnits(rawAmount, CURVE_POOL_TOKEN_DECIMALS));
    // all coins removed in amounts relative to current pool balance/weighting
    // Output amount of tokens unknown without better logs of tx
    tokens = pool.coins.map((coin) => {
      return {
        symbol: coin.symbol,
        address: coin.address,
        type: CurveLiquidityImpact.REMOVE,
      };
    });
  } else {
    console.warn('[parseRemoveLiquidity] Unknown transaction type: ', decodedInput.name);
    return;
  }

  return {
    hash: tx.hash,
    pool: pool.address,
    timestamp: Number(tx.timeStamp),
    type: CurveTransactionType.REMOVE_LIQUIDITY,
    totalUsdAmount,
    tokens,
  };
};

interface ParseAddLiquidityProps {
  tx: EtherscanTx;
  pool: CurvePoolExtended;
  decodedInput: ethers.utils.TransactionDescription;
}
const parseAddLiquidity = ({
  tx,
  pool,
  decodedInput,
}: ParseAddLiquidityProps): CurveTransaction | void => {
  let totalUsdAmount: Decimal;
  let tokens: Array<CurveTokenWithAmount>;

  if (decodedInput.name == 'add_liquidity') {
    const rawAmounts: Array<BigNumber> =
      decodedInput.args._amounts ?? decodedInput.args.amounts ?? decodedInput.args.uamounts;
    totalUsdAmount = new Decimal(0);
    tokens = lodash.compact(
      rawAmounts.map((rawAmount, i) => {
        if (rawAmount.isZero()) {
          // Ignore zero values:
          return;
        }
        const coin = pool.coins[i];
        const decimals = Number(coin.decimals);
        const tokenAmount = new Decimal(ethers.utils.formatUnits(rawAmount, decimals));
        const usdAmount = tokenAmount.times(coin.usdPrice);
        totalUsdAmount = totalUsdAmount.add(usdAmount);
        return {
          symbol: coin.symbol,
          address: coin.address,
          tokenAmount,
          usdAmount,
          type: CurveLiquidityImpact.ADD,
        };
      }),
    );
  } else {
    console.warn('[parseAddLiquidity] Unknown transaction type: ', decodedInput.name);
    return;
  }

  return {
    hash: tx.hash,
    pool: pool.address,
    timestamp: Number(tx.timeStamp),
    type: CurveTransactionType.ADD_LIQUIDITY,
    totalUsdAmount,
    tokens,
  };
};

interface ParseExchangeProps {
  tx: EtherscanTx;
  pool: CurvePoolExtended;
  decodedInput: ethers.utils.TransactionDescription;
}
const parseExchange = ({ tx, pool, decodedInput }: ParseExchangeProps): CurveTransaction | void => {
  let totalUsdAmount: Decimal;
  let tokens: Array<CurveTokenWithAmount>;

  // `exchange` is a standard/straightforward exchange.
  if (decodedInput.name === 'exchange') {
    const fromCoin = pool.coins[decodedInput.args.i.toNumber()];
    const toCoin = pool.coins[decodedInput.args.j.toNumber()];
    const rawAmount: BigNumber = decodedInput.args.dx ?? decodedInput.args._dx;
    const fromCoinAmount = new Decimal(
      ethers.utils.formatUnits(rawAmount, Number(fromCoin.decimals)),
    );
    const fromCoinUsdAmount = fromCoinAmount.times(fromCoin.usdPrice);
    totalUsdAmount = fromCoinUsdAmount;

    tokens = [
      {
        symbol: fromCoin.symbol,
        address: fromCoin.address,
        tokenAmount: fromCoinAmount,
        usdAmount: fromCoinUsdAmount,
        type: CurveLiquidityImpact.ADD,
      },
      {
        symbol: toCoin.symbol,
        address: toCoin.address,
        // TODO: need tx logs to determine amount
        type: CurveLiquidityImpact.REMOVE,
      },
    ];
  } else if (decodedInput.name === 'exchange_underlying') {
    // `exchange_underlying` exchanges the underlying token. E.g. instead of
    // aUSDC => aUSDT, exchange USDC => USDT through the Curve aToken pool
    // `i` and `j` correspond to underlying tokens, but pool data doesn't have
    // this so need another way to fetch.
    return;
  } else {
    console.warn('[parseExchange] Unknown transaction type: ', decodedInput.name);
    return;
  }

  return {
    hash: tx.hash,
    pool: pool.address,
    timestamp: Number(tx.timeStamp),
    type: CurveTransactionType.EXCHANGE,
    totalUsdAmount,
    tokens,
  };
};
