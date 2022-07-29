import lodash from 'lodash';
import { getTxs } from '../data/txs';
import { CurvePoolExtended, getPools } from '../data/pools';
import { writeJSON } from '../src/utils/write-json';
import { CURVE_NETWORKS, CURVE_POOL_TYPES } from '../src/utils/curve.constants';
import { CurveTransaction, parseTransaction } from '../src/utils/parse-transaction';

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

  for (const pool of correlatedPools.slice(0, 20)) {
    console.log(pool.network, pool.poolType);
    console.log(pool.shortName, pool.name, pool.usdTotal, pool.address);
  }
};

main();
