import { useMemo } from 'react';
import { ethers } from 'ethers';
import { Decimal } from 'decimal.js';
import { CurvePoolSimplified } from '../../../data/pools';
import { topPools } from '../../processed-data/pools';
import { CurvePoolToken } from '../../utils/curve-api';
import {
  percentFormatter,
  usdExtraPrecisionFormatter,
  usdFormatter,
} from '../../utils/number-formatters';
import { getLogoURLForToken } from '../../utils/curve-ui-data';

interface CurvePoolTokenForUi extends CurvePoolToken {
  logoURL: string;
  usdPriceFormatted: string;
  poolBalanceFormatted: string;
  totalUsdBalanceFormatted: string;
  poolWeight: Decimal;
  poolWeightFormatted: string;
}

interface CurvePoolForUi extends CurvePoolSimplified {
  coins: Array<CurvePoolTokenForUi>;
  usdTotalFormatted: string;
}

const populatePoolUiData = (pool: CurvePoolSimplified): CurvePoolForUi => {
  const coins = pool.coins.map((token) => {
    const usdPriceFormatted = usdExtraPrecisionFormatter.format(token.usdPrice);
    const poolBalanceFormatted = ethers.utils.formatUnits(token.poolBalance, token.decimals);
    const totalUsdBalance = new Decimal(token.usdPrice).times(poolBalanceFormatted);
    const totalUsdBalanceFormatted = usdFormatter.format(totalUsdBalance.toNumber());
    const poolWeight = totalUsdBalance.dividedBy(pool.usdTotal);
    const poolWeightFormatted = percentFormatter.format(poolWeight.toNumber());

    return {
      ...token,
      logoURL: getLogoURLForToken({ network: pool.network, tokenAddress: token.address }),
      usdPriceFormatted,
      poolBalanceFormatted,
      totalUsdBalanceFormatted,
      poolWeight,
      poolWeightFormatted,
    };
  });

  const usdTotalFormatted = usdFormatter.format(pool.usdTotal);

  return {
    ...pool,
    coins,
    usdTotalFormatted,
  };
};

export const useTopPools = (): Array<CurvePoolForUi> => {
  return useMemo(() => {
    return topPools.map(populatePoolUiData);
  }, []);
};
