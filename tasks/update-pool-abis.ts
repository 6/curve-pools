import { sleep } from '../src/utils/sleep';
import { explorers } from '../src/utils/etherscan';
import { writeJSON } from '../src/utils/write-json';
import { pools } from '../data/pools';
import { CURVE_NETWORKS, CURVE_POOL_TYPES } from '../src/utils/curve.constants';

const main = async () => {
  for (const network of CURVE_NETWORKS) {
    for (const poolType of CURVE_POOL_TYPES) {
      const abis: { [contractAddress: string]: Record<string, unknown> } = {};
      const poolData = pools[network][poolType].poolData;
      for (const pool of poolData) {
        await sleep(500);
        const contractAddress = pool.address;
        const abi = await explorers[network].mainnet.fetchABI({ contractAddress });
        if (abi) {
          abis[contractAddress] = abi;
        } else {
          console.warn(`Unable to fetch ABI for ${contractAddress}`);
        }
      }
      await writeJSON(`./data/abi/${network}.${poolType}.json`, abis);
    }
  }
};

main();
