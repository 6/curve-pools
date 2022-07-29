import { sleep } from '../src/utils/sleep';
import { explorers } from '../src/utils/etherscan';
import { writeJSON } from '../src/utils/write-json';
import { topPools } from '../src/processed-data/pools';

const main = async () => {
  for (const pool of topPools) {
    await sleep(400);
    const txlist = await explorers[pool.network].mainnet.fetchTxList({
      contractAddress: pool.address,
      offset: 1000,
    });
    await writeJSON(`./data/txs/${pool.network}.${pool.address.toLowerCase()}.json`, txlist);
  }
};

main();
