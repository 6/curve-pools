import { CURVE_NETWORKS, CURVE_POOL_TYPES, PoolType } from '../src/utils/curve.constants';
import { CurvePoolMetadata, fetchPools } from '../src/utils/curve-api';
import { sleep } from '../src/utils/sleep';
import { writeJSON } from '../src/utils/write-json';

interface CurvePoolMetadataWithType extends CurvePoolMetadata {
  type: PoolType;
}

const main = async () => {
  for (const network of CURVE_NETWORKS) {
    const pools: Array<CurvePoolMetadataWithType> = [];
    for (const poolType of CURVE_POOL_TYPES) {
      await sleep(250); // don't blast curve api with requests
      const poolsResponse = await fetchPools({ network, poolType });
      if (poolsResponse.success) {
        poolsResponse.data.poolData.map((pool) => {
          pools.push({
            type: poolType,
            ...pool,
          });
        });
      } else {
        console.error('[update-pool-metadata] something went wrong: ', pools);
      }
    }
    await writeJSON(`./data/pools/${network}.json`, pools);
  }
};

main();
