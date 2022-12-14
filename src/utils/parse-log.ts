import lodash from 'lodash';
import { BigNumber, ethers } from 'ethers';
import { Decimal } from 'decimal.js';
import { CurvePoolExtended } from '../../data/pools';
import { EtherscanLog } from './etherscan';
import { CurveLiquidityImpact, CurveTransactionType } from './parse-transaction';

export interface LogCurveTokenAmount {
  symbol: string;
  tokenAmount: Decimal;
  usdPrice: Decimal;
  usdAmount: Decimal;
  liquidityImpact: CurveLiquidityImpact;
}

export interface ParsedCurveLog {
  hash: string;
  pool: CurvePoolExtended;
  timestamp: number;
  type: CurveTransactionType;
  totalUsdAmount: Decimal;
  // Input or output tokens
  tokens: Array<LogCurveTokenAmount>;
}

type PartialParsedCurveLog = Omit<ParsedCurveLog, 'timestamp' | 'pool' | 'hash'>;

interface ParseLogProps {
  pool: CurvePoolExtended;
  log: EtherscanLog;
}
interface ParseLogAPI {
  decodedLog: ethers.utils.LogDescription;
  parsedLog: ParsedCurveLog | void;
  exchangeUnderlying: boolean;
}
export const parseLog = ({ pool, log }: ParseLogProps): ParseLogAPI => {
  const decodedLog = pool.interface.parseLog(log);

  let exchangeUnderlying = false;
  let logDetails;
  // These two seem to work similarly, reporting token_amounts the same way:
  if (['RemoveLiquidity', 'RemoveLiquidityImbalance'].includes(decodedLog.name)) {
    logDetails = parseRemoveLiquidity({ pool, decodedLog });
  } else if (decodedLog.name === 'RemoveLiquidityOne') {
    logDetails = parseRemoveLiquidityOne({ pool, decodedLog });
  } else if (decodedLog.name.startsWith('AddLiquidity')) {
    logDetails = parseAddLiquidity({ pool, decodedLog });
  } else if (decodedLog.name === 'TokenExchange') {
    logDetails = parseExchange({ pool, decodedLog });
  } else if (decodedLog.name === 'TokenExchangeUnderlying') {
    // TokenExchangeUnderlying unsupported for now, unable to find underlying coin index:
    exchangeUnderlying = true;
  }

  const parsedLog = logDetails
    ? {
        ...logDetails,
        hash: log.transactionHash,
        pool,
        timestamp: ethers.BigNumber.from(log.timeStamp).toNumber(),
      }
    : undefined;

  return { decodedLog, parsedLog, exchangeUnderlying };
};

interface ParseLogDetailsProps {
  pool: CurvePoolExtended;
  decodedLog: ethers.utils.LogDescription;
}
const parseAddLiquidity = ({ pool, decodedLog }: ParseLogDetailsProps): PartialParsedCurveLog => {
  let totalUsdAmount = new Decimal(0);
  const rawAmounts: Array<BigNumber> = decodedLog.args.token_amounts;
  const tokens = lodash.compact(
    rawAmounts.map((rawAmount, i) => {
      if (rawAmount.isZero()) {
        // Ignore zero values:
        return;
      }
      const coin = pool.coins[i];
      const decimals = Number(coin.decimals);
      const usdPrice = new Decimal(coin.usdPrice); // TODO: Current price, not price at this tx
      const tokenAmount = new Decimal(ethers.utils.formatUnits(rawAmount, decimals));
      const usdAmount = tokenAmount.times(usdPrice);
      totalUsdAmount = totalUsdAmount.plus(usdAmount);
      return {
        symbol: coin.symbol,
        tokenAmount,
        usdPrice,
        usdAmount,
        liquidityImpact: CurveLiquidityImpact.ADD,
      };
    }),
  );
  return {
    type: CurveTransactionType.ADD_LIQUIDITY,
    totalUsdAmount,
    tokens,
  };
};

const parseRemoveLiquidity = ({
  pool,
  decodedLog,
}: ParseLogDetailsProps): PartialParsedCurveLog => {
  let totalUsdAmount = new Decimal(0);
  const rawAmounts: Array<BigNumber> = decodedLog.args.token_amounts;
  const tokens = lodash.compact(
    rawAmounts.map((rawAmount, i) => {
      if (rawAmount.isZero()) {
        // Ignore zero values:
        return;
      }
      const coin = pool.coins[i];
      const decimals = Number(coin.decimals);
      const usdPrice = new Decimal(coin.usdPrice); // TODO: Current price, not price at this tx
      const tokenAmount = new Decimal(ethers.utils.formatUnits(rawAmount, decimals));
      const usdAmount = tokenAmount.times(usdPrice);
      totalUsdAmount = totalUsdAmount.plus(usdAmount);
      return {
        symbol: coin.symbol,
        tokenAmount,
        usdPrice,
        usdAmount,
        liquidityImpact: CurveLiquidityImpact.REMOVE,
      };
    }),
  );

  return {
    type: CurveTransactionType.REMOVE_LIQUIDITY,
    totalUsdAmount,
    tokens,
  };
};

const parseRemoveLiquidityOne = ({
  pool,
  decodedLog,
}: ParseLogDetailsProps): PartialParsedCurveLog | void => {
  const rawAmount: BigNumber = decodedLog.args.token_amount.toString();
  const coinIndex: BigNumber | void = decodedLog.args.coin_index;
  if (!coinIndex) {
    // Older pools don't have coinIndex indexed, so don't know which coin is
    // being removed without more data?
    return;
  }

  const coin = pool.coins[coinIndex.toNumber()];
  const decimals = Number(coin.decimals);
  const usdPrice = new Decimal(coin.usdPrice); // TODO: Current price, not price at this tx
  const tokenAmount = new Decimal(ethers.utils.formatUnits(rawAmount, decimals));
  const usdAmount = tokenAmount.times(usdPrice);
  const token = {
    symbol: coin.symbol,
    tokenAmount,
    usdPrice,
    usdAmount,
    liquidityImpact: CurveLiquidityImpact.REMOVE,
  };
  const totalUsdAmount = usdAmount;

  return {
    type: CurveTransactionType.REMOVE_LIQUIDITY,
    totalUsdAmount,
    tokens: [token],
  };
};

const parseExchangeToken = ({
  pool,
  coinIndex,
  amount,
}: {
  pool: CurvePoolExtended;
  coinIndex: BigNumber;
  amount: BigNumber;
}): Omit<LogCurveTokenAmount, 'liquidityImpact'> => {
  const coin = pool.coins[coinIndex.toNumber()];
  const decimals = Number(coin.decimals);
  const usdPrice = new Decimal(coin.usdPrice); // TODO: Current price, not price at this tx
  const tokenAmount = new Decimal(ethers.utils.formatUnits(amount, decimals));
  const usdAmount = tokenAmount.times(usdPrice);
  return {
    symbol: coin.symbol,
    tokenAmount,
    usdPrice,
    usdAmount,
  };
};

const parseExchange = ({ pool, decodedLog }: ParseLogDetailsProps): PartialParsedCurveLog => {
  const soldToken = parseExchangeToken({
    pool,
    coinIndex: decodedLog.args.sold_id,
    amount: decodedLog.args.tokens_sold,
  });
  const boughtToken = parseExchangeToken({
    pool,
    coinIndex: decodedLog.args.bought_id,
    amount: decodedLog.args.tokens_bought,
  });
  const totalUsdAmount = soldToken.usdAmount.abs();

  return {
    type: CurveTransactionType.EXCHANGE,
    totalUsdAmount,
    tokens: [
      {
        ...soldToken,
        // Sold token is being sold into liquidity pool
        liquidityImpact: CurveLiquidityImpact.ADD,
      },
      {
        ...boughtToken,
        // Bought token is being bought from liquidity pool
        liquidityImpact: CurveLiquidityImpact.REMOVE,
      },
    ],
  };
};
