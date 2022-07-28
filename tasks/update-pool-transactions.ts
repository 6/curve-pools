import { sleep } from '../src/utils/sleep';
import { explorers } from '../src/utils/etherscan';
import { writeJSON } from '../src/utils/write-json';
import { pools } from '../data/pools';

const main = async () => {
  for (const pool of pools.ethereum.main.poolData) {
    await sleep(500);
    const txlist = await explorers.etherscan.mainnet.fetchTxList({ contractAddress: pool.address });
    if (txlist) {
      await writeJSON(`./data/tx/ethereum.${pool.address}.json`, txlist);
    }
  }
};

main();
