import { Decimal } from 'decimal.js';
import lodash from 'lodash';
import { CurvePoolExtended, getPools } from '../../data/pools';
import { CURVE_NETWORKS, CURVE_POOL_TYPES } from './curve.constants';

interface GetTopPoolsProps {
  minimumTVL: Decimal;
}
export const getTopPools = async ({
  minimumTVL,
}: GetTopPoolsProps): Promise<Array<CurvePoolExtended>> => {
  let allPools: Array<CurvePoolExtended> = [];
  for (const network of CURVE_NETWORKS) {
    for (const poolType of CURVE_POOL_TYPES) {
      const pools = await getPools({ network, poolType });
      allPools = allPools.concat(pools);
    }
  }

  allPools = lodash.orderBy(allPools, 'usdTotal', 'desc');
  return allPools.filter((pool) => new Decimal(pool.usdTotal).gte(minimumTVL));
};
