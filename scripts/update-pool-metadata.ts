import prettier from 'prettier';
import { writeFile } from 'fs/promises';
import { CURVE_NETWORKS, CURVE_POOL_TYPES } from '../src/utils/curve.constants';
import { getPools } from '../src/utils/get-pools';
import { sleep } from '../src/utils/sleep';

const main = async () => {
  for (const network of CURVE_NETWORKS) {
    for (const poolType of CURVE_POOL_TYPES) {
      await sleep(250); // don't blast curve api with requests
      const pools = await getPools({ network, poolType });
      const filePath = `./data/pools/${network}.${poolType}.json`;
      const fileContents = prettier.format(JSON.stringify(pools), {
        parser: 'json',
      });
      await writeFile(filePath, fileContents);
    }
  }
};

main();
