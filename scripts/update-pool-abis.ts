import { sleep } from '../src/utils/sleep';
import { explorers } from '../src/utils/etherscan';
import { writeJSON } from '../src/utils/write-json';
import { pools } from '../data/pools';

const main = async () => {
  for (const pool of pools.ethereum.main.poolData) {
    await sleep(500);
    const abi = await explorers.etherscan.mainnet.fetchABI({ contractAddress: pool.address });
    if (abi) {
      await writeJSON(`./data/abi/ethereum.${pool.address}.json`, abi);
    }
  }
};

main();
