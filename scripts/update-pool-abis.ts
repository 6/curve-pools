import { sleep } from '../src/utils/sleep';
import { explorers } from '../src/utils/etherscan';
import { writeJSON } from '../src/utils/write-json';
import ethereumMainPools from '../data/pools/ethereum.main.json';

const main = async () => {
  const pools = ethereumMainPools.data.poolData;
  for (const pool of pools) {
    await sleep(500);
    const abi = await explorers.etherscan.mainnet.fetchABI({ contractAddress: pool.address });
    if (abi) {
      await writeJSON(`./data/abi/ethereum.${pool.address}.json`, abi);
    }
  }
};

main();
