import { Decimal } from 'decimal.js';
import { convertPoolToMinimum } from '../data/pools';
import { writeJSON } from '../src/utils/write-json';
import { getTopPools } from '../src/utils/top-pools';

// only analyze pools with sufficient tvl
const minimumTVL = new Decimal(10000000);

const main = async () => {
  const topPools = (await getTopPools({ minimumTVL })).map(convertPoolToMinimum);

  console.log(`Found ${topPools.length} pools with gte $${minimumTVL}`);

  writeJSON('./src/processed-data/top-pools.json', topPools);
};

main();
