import { useMemo } from 'react';
import lodash from 'lodash';
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

type BalanceStatusColor = string;

interface CurvePoolTokenForUi extends CurvePoolToken {
  logoURL: string;
  usdPriceFormatted: string;
  poolBalanceFormatted: string;
  totalUsdBalance: Decimal;
  totalUsdBalanceFormatted: string;
  poolWeight: Decimal;
  poolWeightFormatted: string;
  poolWeightVsIdealPercentageChange: Decimal;
  poolWeightVsIdealPercentageChangeFormatted: string;
  balanceStatus: TokenBalanceStatus;
  balanceStatusColor: BalanceStatusColor;
}

export interface CurvePoolForUi extends CurvePoolSimplified {
  coins: Array<CurvePoolTokenForUi>;
  idealPoolWeight: Decimal;
  idealPoolWeightFormatted: string;
  usdTotalFormatted: string;
  balanceStatus: PoolBalanceStatus;
  balanceStatusColor: BalanceStatusColor;
  displayName: string;
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
    let balanceStatusColor;
    if (poolWeightVsIdealPercentageChange.abs().greaterThan(0.4)) {
      balanceStatus = poolWeight.greaterThan(idealPoolWeight)
        ? TokenBalanceStatus.EXTREME_OVERSUPPLY
        : TokenBalanceStatus.EXTREME_UNDERSUPPLY;
      balanceStatusColor = 'red';
    } else if (poolWeightVsIdealPercentageChange.abs().greaterThan(0.2)) {
      balanceStatus = poolWeight.greaterThan(idealPoolWeight)
        ? TokenBalanceStatus.OVERSUPPLY
        : TokenBalanceStatus.UNDERSUPPLY;
      balanceStatusColor = 'orange';
    } else if (poolWeightVsIdealPercentageChange.abs().greaterThan(0.1)) {
      balanceStatus = poolWeight.greaterThan(idealPoolWeight)
        ? TokenBalanceStatus.MINOR_OVERSUPPLY
        : TokenBalanceStatus.MINOR_UNDERSUPPLY;
      balanceStatusColor = 'yellow';
    } else {
      balanceStatus = TokenBalanceStatus.GOOD;
      balanceStatusColor = 'green';
    }

    return {
      ...token,
      logoURL: getLogoURLForToken({ network: pool.network, tokenAddress: token.address }),
      usdPriceFormatted,
      poolBalanceFormatted,
      totalUsdBalance,
      totalUsdBalanceFormatted,
      poolWeight,
      poolWeightFormatted,
      balanceStatus,
      balanceStatusColor,
      poolWeightVsIdealPercentageChange,
      poolWeightVsIdealPercentageChangeFormatted,
    };
  });

  let displayName = pool.shortName ?? pool.name ?? pool.id;
  if (displayName.startsWith('Curve.fi')) {
    displayName = displayName.replace(/^Curve\.fi\s+?/, '');
  }

  const usdTotalFormatted = usdCompactFormatter.format(pool.usdTotal);

  let poolBalanceStatus = PoolBalanceStatus.GOOD;
  let balanceStatusColor = 'green';
  if (
    coins.find((coin) =>
      [TokenBalanceStatus.EXTREME_OVERSUPPLY, TokenBalanceStatus.EXTREME_UNDERSUPPLY].includes(
        coin.balanceStatus,
      ),
    )
  ) {
    poolBalanceStatus = PoolBalanceStatus.SEVERE;
    balanceStatusColor = 'red';
  } else if (
    coins.find((coin) =>
      [TokenBalanceStatus.OVERSUPPLY, TokenBalanceStatus.UNDERSUPPLY].includes(coin.balanceStatus),
    )
  ) {
    poolBalanceStatus = PoolBalanceStatus.MODERATE;
    balanceStatusColor = 'orange';
  } else if (
    coins.find((coin) =>
      [TokenBalanceStatus.MINOR_OVERSUPPLY, TokenBalanceStatus.MINOR_UNDERSUPPLY].includes(
        coin.balanceStatus,
      ),
    )
  ) {
    poolBalanceStatus = PoolBalanceStatus.MINOR;
    balanceStatusColor = 'yellow';
  }

  const coinsSorted = lodash.orderBy(coins, 'totalUsdBalance', 'desc');

  return {
    ...pool,
    displayName,
    coins: coinsSorted,
    idealPoolWeight,
    idealPoolWeightFormatted,
    usdTotalFormatted,
    balanceStatus: poolBalanceStatus,
    balanceStatusColor,
  };
};

export const useTopPools = (): Array<CurvePoolForUi> => {
  return useMemo(() => {
    return topPools.map(populatePoolUiData);
  }, []);
};
