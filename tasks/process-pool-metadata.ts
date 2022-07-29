import lodash from 'lodash';
import { Decimal } from 'decimal.js';
import { CurvePoolExtended, getPools } from '../data/pools';
import { writeJSON } from '../src/utils/write-json';
import { CURVE_NETWORKS, CURVE_POOL_TYPES } from '../src/utils/curve.constants';

// only analyze pools with sufficient tvl
const minimumTVL = new Decimal(10000000);

const main = async () => {
  let allPools: Array<CurvePoolExtended> = [];
  for (const network of CURVE_NETWORKS) {
    for (const poolType of CURVE_POOL_TYPES) {
      const pools = await getPools({ network, poolType });
      allPools = allPools.concat(pools);
    }
  }

  allPools = lodash.orderBy(allPools, 'usdTotal', 'desc');
  const correlatedPools = allPools.filter((pool) => pool.poolType !== 'crypto');
  const poolsWithSufficientTVL = correlatedPools.filter((pool) =>
    new Decimal(pool.usdTotal).gte(minimumTVL),
  );
  console.log(`Found ${poolsWithSufficientTVL.length} pools with gte $${minimumTVL}`);

  for (const pool of poolsWithSufficientTVL) {
    console.log(pool.network, pool.poolType);
    console.log(pool.shortName, pool.name, pool.usdTotal, pool.address);
  }
};

main();
