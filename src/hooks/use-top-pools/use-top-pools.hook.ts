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
import { percentageChange } from '../../utils/percentage-calculations';

export enum TokenBalanceStatus {
  EXTREME_OVERSUPPLY = 'extreme_oversupply',
  OVERSUPPLY = 'oversupply',
  MINOR_OVERSUPPLY = 'minor_oversupply',
  GOOD = 'good',
  MINOR_UNDERSUPPLY = 'minor_undersupply',
  UNDERSUPPLY = 'undersupply',
  EXTREME_UNDERSUPPLY = 'extreme_undersupply',
}

export enum PoolBalanceStatus {
  GOOD = 'good',
  MINOR = 'minor',
  MODERATE = 'moderate',
  SEVERE = 'severe',
}

interface CurvePoolTokenForUi extends CurvePoolToken {
  logoURL: string;
  usdPriceFormatted: string;
  poolBalanceFormatted: string;
  totalUsdBalanceFormatted: string;
  poolWeight: Decimal;
  poolWeightFormatted: string;
  poolWeightVsIdealPercentageChange: Decimal;
  poolWeightVsIdealPercentageChangeFormatted: string;
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
    const poolWeightVsIdealPercentageChange = percentageChange(idealPoolWeight, poolWeight);
    const poolWeightVsIdealPercentageChangeFormatted = percentFormatter.format(
      poolWeightVsIdealPercentageChange.toNumber(),
    );

    let balanceStatus;
    if (poolWeightVsIdealPercentageChange.abs().greaterThan(0.4)) {
      balanceStatus = poolWeight.greaterThan(idealPoolWeight)
        ? TokenBalanceStatus.EXTREME_OVERSUPPLY
        : TokenBalanceStatus.EXTREME_UNDERSUPPLY;
    } else if (poolWeightVsIdealPercentageChange.abs().greaterThan(0.2)) {
      balanceStatus = poolWeight.greaterThan(idealPoolWeight)
        ? TokenBalanceStatus.OVERSUPPLY
        : TokenBalanceStatus.UNDERSUPPLY;
    } else if (poolWeightVsIdealPercentageChange.abs().greaterThan(0.125)) {
      balanceStatus = poolWeight.greaterThan(idealPoolWeight)
        ? TokenBalanceStatus.MINOR_OVERSUPPLY
        : TokenBalanceStatus.MINOR_UNDERSUPPLY;
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
      poolWeightVsIdealPercentageChange,
      poolWeightVsIdealPercentageChangeFormatted,
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
    poolBalanceStatus = PoolBalanceStatus.SEVERE;
  } else if (
    coins.find((coin) =>
      [TokenBalanceStatus.OVERSUPPLY, TokenBalanceStatus.UNDERSUPPLY].includes(coin.balanceStatus),
    )
  ) {
    poolBalanceStatus = PoolBalanceStatus.MODERATE;
  } else if (
    coins.find((coin) =>
      [TokenBalanceStatus.MINOR_OVERSUPPLY, TokenBalanceStatus.MINOR_UNDERSUPPLY].includes(
        coin.balanceStatus,
      ),
    )
  ) {
    poolBalanceStatus = PoolBalanceStatus.MINOR;
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
