import { useMemo } from 'react';
import { ethers } from 'ethers';
import { Decimal } from 'decimal.js';
import { CurvePoolSimplified } from '../../../data/pools';
import { topPools } from '../../processed-data/pools';
import { CurvePoolToken } from '../../utils/curve-api';
import { Network } from '../../utils/curve.constants';

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

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const usdExtraPrecisionFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 6,
});

const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const getLogoURLForToken = ({
  network,
  tokenAddress,
}: {
  network: Network;
  tokenAddress: string;
}) => {
  // Examples:
  // https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets/0x6b175474e89094c44da98b954eedeac495271d0f.png
  // https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets-fantom/0x04068da6c83afcfa0e13ba15a6696662335d5b75.png

  const assetsFolder = network === 'ethereum' ? 'assets' : `assets-${network}`;
  return `https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/${assetsFolder}/${tokenAddress.toLowerCase()}.png`;
};

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
