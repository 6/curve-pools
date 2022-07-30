import { Decimal } from 'decimal.js';
import lodash from 'lodash';
import { CurvePoolExtendedWithoutABI, getPoolsWithoutABI } from '../../data/pools';
import { CURVE_NETWORKS, CURVE_POOL_TYPES } from './curve.constants';

interface ProcessTopPoolsProps {
  minimumTVL: Decimal;
}
export const processTopPools = async ({
  minimumTVL,
}: ProcessTopPoolsProps): Promise<Array<CurvePoolExtendedWithoutABI>> => {
  let allPools: Array<CurvePoolExtendedWithoutABI> = [];
  for (const network of CURVE_NETWORKS) {
    for (const poolType of CURVE_POOL_TYPES) {
      const pools = await getPoolsWithoutABI({ network, poolType });
      allPools = allPools.concat(pools);
    }
  }

  allPools = lodash.orderBy(allPools, 'usdTotal', 'desc');
  return allPools.filter((pool) => new Decimal(pool.usdTotal).gte(minimumTVL));
};
