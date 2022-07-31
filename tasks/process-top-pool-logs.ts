import { sleep } from '../src/utils/sleep';
import { writeJSON } from '../src/utils/write-json';
import { topPools } from '../src/processed-data/pools';
import { explorers } from '../src/utils/explorers';
import { Network } from '../src/utils/curve.constants';
import moment from 'moment';

const main = async () => {
  // First, get the relevant block numbers between 7 days ago...now
  type BlockRangeType = 'start' | 'end';
  const blocksByNetwork: Record<Network, Record<BlockRangeType, number | undefined>> = {
    ethereum: { start: undefined, end: undefined },
    optimism: { start: undefined, end: undefined },
    arbitrum: { start: undefined, end: undefined },
    fantom: { start: undefined, end: undefined },
    polygon: { start: undefined, end: undefined },
    avalanche: { start: undefined, end: undefined },
  };

  const startTimestamp = moment().subtract(7, 'days').unix();
  const endTimestamp = moment().unix();

  for (const network in blocksByNetwork) {
    const networkCasted = network as Network;
    await sleep(400);
    blocksByNetwork[networkCasted].start = await explorers[
      networkCasted
    ].mainnet.fetchBlockNumberByTimestamp({
      timestamp: startTimestamp,
    });
    await sleep(400);
    blocksByNetwork[networkCasted].end = await explorers[
      networkCasted
    ].mainnet.fetchBlockNumberByTimestamp({
      timestamp: endTimestamp,
    });
  }

  console.log(blocksByNetwork);

  for (const pool of topPools) {
    if (pool.network !== 'ethereum') {
      // Seems like pagination doesn't work for non-eth?
      continue;
    }
    await sleep(400);
    const fromBlock = blocksByNetwork[pool.network].start as number;
    const toBlock = blocksByNetwork[pool.network].end as number;

    const logs = await explorers[pool.network].mainnet.fetchLogsPaginated({
      contractAddress: pool.address,
      fromBlock,
      toBlock,
    });
    await writeJSON(`./data/logs/${pool.network}.${pool.address.toLowerCase()}.json`, logs);
  }
};

main();
