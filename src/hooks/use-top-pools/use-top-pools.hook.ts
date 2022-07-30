import { useMemo } from 'react';
import { ethers } from 'ethers';
import { Decimal } from 'decimal.js';
import { CurvePoolSimplified } from '../../../data/pools';
import { topPools } from '../../processed-data/pools';
import { CurvePoolToken } from '../../utils/curve-api';
import {
  percentFormatter,
  usdCompactFormatter,
  usdExtraPrecisionFormatter,
  usdFormatter,
} from '../../utils/number-formatters';
import { getLogoURLForToken } from '../../utils/curve-ui-data';

export enum TokenBalanceStatus {
  EXTREME_OVERSUPPLY = 'extreme_oversupply',
  LARGE_OVERSUPPLY = 'large_oversupply',
  OVERSUPPLY = 'oversupply',
  GOOD = 'good',
  UNDERSUPPLY = 'undersupply',
  LARGE_UNDERSUPPLY = 'large_undersupply',
  EXTREME_UNDERSUPPLY = 'extreme_undersupply',
}

export enum PoolBalanceStatus {
  GOOD = 'good',
  WARNING = 'warning',
  BAD = 'bad',
  TERRIBLE = 'terrible',
}

interface CurvePoolTokenForUi extends CurvePoolToken {
  logoURL: string;
  usdPriceFormatted: string;
  poolBalanceFormatted: string;
  totalUsdBalanceFormatted: string;
  poolWeight: Decimal;
  poolWeightFormatted: string;
  balanceStatus: TokenBalanceStatus;
}

export interface CurvePoolForUi extends CurvePoolSimplified {
  coins: Array<CurvePoolTokenForUi>;
  idealPoolWeight: Decimal;
  idealPoolWeightFormatted: string;
  usdTotalFormatted: string;
  balanceStatus: PoolBalanceStatus;
}

const populatePoolUiData = (pool: CurvePoolSimplified): CurvePoolForUi => {
  const idealPoolWeight = new Decimal(1).dividedBy(pool.coins.length);
  const idealPoolWeightFormatted = percentFormatter.format(idealPoolWeight.toNumber());

  const coins = pool.coins.map((token) => {
    const usdPriceFormatted = usdExtraPrecisionFormatter.format(token.usdPrice);
    const poolBalanceFormatted = ethers.utils.formatUnits(token.poolBalance, token.decimals);
    const totalUsdBalance = new Decimal(token.usdPrice).times(poolBalanceFormatted);
    const totalUsdBalanceFormatted = usdFormatter.format(totalUsdBalance.toNumber());
    const poolWeight = totalUsdBalance.dividedBy(pool.usdTotal);
    const poolWeightFormatted = percentFormatter.format(poolWeight.toNumber());

    let balanceStatus;
    if (idealPoolWeight.minus(poolWeight).abs().greaterThan(0.3)) {
      balanceStatus = poolWeight.greaterThan(idealPoolWeight)
        ? TokenBalanceStatus.EXTREME_OVERSUPPLY
        : TokenBalanceStatus.EXTREME_UNDERSUPPLY;
    } else if (idealPoolWeight.minus(poolWeight).abs().greaterThan(0.15)) {
      balanceStatus = poolWeight.greaterThan(idealPoolWeight)
        ? TokenBalanceStatus.LARGE_OVERSUPPLY
        : TokenBalanceStatus.LARGE_UNDERSUPPLY;
    } else if (idealPoolWeight.minus(poolWeight).abs().greaterThan(0.05)) {
      balanceStatus = poolWeight.greaterThan(idealPoolWeight)
        ? TokenBalanceStatus.OVERSUPPLY
        : TokenBalanceStatus.UNDERSUPPLY;
    } else {
      balanceStatus = TokenBalanceStatus.GOOD;
    }

    return {
      ...token,
      logoURL: getLogoURLForToken({ network: pool.network, tokenAddress: token.address }),
      usdPriceFormatted,
      poolBalanceFormatted,
      totalUsdBalanceFormatted,
      poolWeight,
      poolWeightFormatted,
      balanceStatus,
    };
  });

  const usdTotalFormatted = usdCompactFormatter.format(pool.usdTotal);

  let poolBalanceStatus = PoolBalanceStatus.GOOD;
  if (
    coins.find((coin) =>
      [TokenBalanceStatus.EXTREME_OVERSUPPLY, TokenBalanceStatus.EXTREME_UNDERSUPPLY].includes(
        coin.balanceStatus,
      ),
    )
  ) {
    poolBalanceStatus = PoolBalanceStatus.TERRIBLE;
  } else if (
    coins.find((coin) =>
      [TokenBalanceStatus.LARGE_OVERSUPPLY, TokenBalanceStatus.LARGE_UNDERSUPPLY].includes(
        coin.balanceStatus,
      ),
    )
  ) {
    poolBalanceStatus = PoolBalanceStatus.BAD;
  } else if (
    coins.find((coin) =>
      [TokenBalanceStatus.OVERSUPPLY, TokenBalanceStatus.UNDERSUPPLY].includes(coin.balanceStatus),
    )
  ) {
    poolBalanceStatus = PoolBalanceStatus.WARNING;
  } else {
    poolBalanceStatus = PoolBalanceStatus.GOOD;
  }

  return {
    ...pool,
    coins,
    idealPoolWeight,
    idealPoolWeightFormatted,
    usdTotalFormatted,
    balanceStatus: poolBalanceStatus,
  };
};

export const useTopPools = (): Array<CurvePoolForUi> => {
  return useMemo(() => {
    return topPools.map(populatePoolUiData);
  }, []);
};
