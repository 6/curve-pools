import { CURVE_NETWORKS, CURVE_POOL_TYPES } from '../src/utils/curve.constants';
import { fetchPools } from '../src/utils/curve-api';
import { sleep } from '../src/utils/sleep';
import { writeJSON } from '../src/utils/write-json';

const main = async () => {
  for (const network of CURVE_NETWORKS) {
    for (const poolType of CURVE_POOL_TYPES) {
      await sleep(250); // don't blast curve api with requests
      const pools = await fetchPools({ network, poolType });
      if (pools.success) {
        await writeJSON(`./data/pools/${network}.${poolType}.json`, pools);
      } else {
        console.error('[update-pool-metadata] something went wrong: ', pools);
      }
    }
  }
};

main();
