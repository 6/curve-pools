import { sleep } from '../src/utils/sleep';
import { EtherscanABIResult } from '../src/utils/etherscan';
import { writeJSON } from '../src/utils/write-json';
import { CURVE_NETWORKS, CURVE_POOL_TYPES } from '../src/utils/curve.constants';
import { topPools } from '../src/processed-data/pools';
import { explorers } from '../src/utils/explorers';

const main = async () => {
  for (const network of CURVE_NETWORKS) {
    for (const poolType of CURVE_POOL_TYPES) {
      // Find all relevant top pools:
      const pools = topPools.filter(
        (pool) => pool.network === network && pool.poolType === poolType,
      );
      const abis: Record<string, EtherscanABIResult> = {};
      for (const pool of pools) {
        await sleep(400);
        const contractAddress = pool.address;
        const abi = await explorers[network].mainnet.fetchABI({ contractAddress });
        if (abi) {
          abis[contractAddress.toLowerCase()] = abi;
        } else {
          console.warn(
            `[update-pool-abis] Unable to fetch ABI for ${network}.${poolType} => ${contractAddress}`,
          );
        }
      }
      await writeJSON(`./data/abis/${network}.${poolType}.json`, abis);
    }
  }
};

main();
