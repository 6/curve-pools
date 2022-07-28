import { sleep } from '../src/utils/sleep';
import { EtherscanTxListResult, explorers } from '../src/utils/etherscan';
import { writeJSON } from '../src/utils/write-json';
import { pools } from '../data/pools';
import { CURVE_NETWORKS, CURVE_POOL_TYPES } from '../src/utils/curve.constants';

const main = async () => {
  for (const network of CURVE_NETWORKS) {
    for (const poolType of CURVE_POOL_TYPES) {
      const transactions: Record<string, EtherscanTxListResult> = {};
      const poolData = pools[network][poolType].poolData;
      for (const pool of poolData) {
        await sleep(500);
        const contractAddress = pool.address;
        const txlist = await explorers[network].mainnet.fetchTxList({
          contractAddress: pool.address,
          offset: 250,
        });
        transactions[contractAddress] = txlist;
      }
      await writeJSON(`./data/txs/${network}.${poolType}.json`, transactions);
    }
  }
};

main();
