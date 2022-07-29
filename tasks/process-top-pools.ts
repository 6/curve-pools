import { Decimal } from 'decimal.js';
import { convertToSimplifiedPool } from '../data/pools';
import { writeJSON } from '../src/utils/write-json';
import { processTopPools } from '../src/utils/top-pools';

// only analyze pools with sufficient tvl
const minimumTVL = new Decimal(10000000);

const main = async () => {
  const topPools = await processTopPools({ minimumTVL });
  const topPoolsSimplified = topPools.map(convertToSimplifiedPool);

  console.log(`Found ${topPools.length} pools with gte $${minimumTVL}`);

  writeJSON('./src/processed-data/pools/top-pools.json', topPoolsSimplified);
};

main();
