import lodash from 'lodash';
import { BigNumber, ethers } from 'ethers';
import { Decimal } from 'decimal.js';
import { CurvePoolExtended } from '../../data/pools';
import { CurvePoolToken } from './curve-api';
import { EtherscanLog } from './etherscan';
import { CurveLiquidityImpact, CurveTransactionType } from './parse-transaction';

interface LogCurveTokenAmount {
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
  decodedLog: ethers.utils.LogDescription | void;
  parsedLog: ParsedCurveLog | void;
}
export const parseLog = ({ pool, log }: ParseLogProps): ParseLogAPI => {
  const decodedLog = pool.interface.parseLog(log);

  console.log(decodedLog);

  let logDetails;
  if (decodedLog.name.startsWith('RemoveLiquidity')) {
    logDetails = parseRemoveLiquidity({ pool, decodedLog });
  } else if (decodedLog.name.startsWith('AddLiquidity')) {
    logDetails = parseAddLiquidity({ pool, decodedLog });
  } else if (decodedLog.name.startsWith('TokenExchange')) {
    logDetails = parseExchange({ pool, decodedLog });
  }

  const parsedLog = logDetails
    ? {
        ...logDetails,
        hash: log.transactionHash,
        pool,
        timestamp: ethers.BigNumber.from(log.timeStamp).toNumber(),
      }
    : undefined;

  return { decodedLog, parsedLog };
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
