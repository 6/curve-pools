import { writeJSON } from '../src/utils/write-json';
import { ethers } from 'ethers';
import { getTxs } from '../data/txs';
import { getPools } from '../data/pools';

const main = async () => {
  // For now, just focus on limited set of data:
  const network = 'ethereum';
  const poolType = 'main';

  const pools = await getPools({ network, poolType });
  for (const pool of pools) {
    const contractAddress = pool.address;
    const txs = await getTxs({ network, poolType, contractAddress });

    txs.map((tx) => {
      const decodedInput = pool.interface.parseTransaction({ data: tx.input, value: tx.value });
    });

    break;
  }
};

main();
