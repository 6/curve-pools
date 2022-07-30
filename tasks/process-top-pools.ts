import { convertToSimplifiedPool } from '../data/pools';
import { writeJSON } from '../src/utils/write-json';
import { processTopPools } from '../src/utils/top-pools';
import { TOP_POOLS_MINIMUM_TVL_THRESHOLD } from '../src/utils/curve.constants';

const main = async () => {
  const minimumTVL = TOP_POOLS_MINIMUM_TVL_THRESHOLD;
  const topPools = await processTopPools({ minimumTVL });
  const topPoolsSimplified = topPools.map(convertToSimplifiedPool);

  console.log(`Found ${topPools.length} pools with gte $${minimumTVL}`);

  writeJSON('./src/processed-data/pools/top-pools.json', topPoolsSimplified);
};

main();
