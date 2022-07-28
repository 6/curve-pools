import { sleep } from '../src/utils/sleep';
import { explorers } from '../src/utils/etherscan';
import { writeJSON } from '../src/utils/write-json';
import { pools } from '../data/pools';
import { CURVE_NETWORKS, CURVE_POOL_TYPES, PoolType } from '../src/utils/curve.constants';

type ABIsForNetwork = {
  [poolType in PoolType]: {
    [contractAddress: string]: Record<string, unknown>;
  };
};

const main = async () => {
  for (const network of CURVE_NETWORKS) {
    const abis: ABIsForNetwork = { main: {}, crypto: {}, factory: {} };
    for (const poolType of CURVE_POOL_TYPES) {
      const poolData = pools[network][poolType].poolData;
      for (const pool of poolData) {
        await sleep(500);
        const contractAddress = pool.address;
        const abi = await explorers[network].mainnet.fetchABI({ contractAddress });
        if (abi) {
          abis[poolType][contractAddress] = abi;
        } else {
          console.warn(
            `[update-pool-abis] Unable to fetch ABI for ${network}.${poolType} => ${contractAddress}`,
          );
        }
      }
    }
    await writeJSON(`./data/abis/${network}.json`, abis);
  }
};

main();
