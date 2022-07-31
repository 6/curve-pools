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
    await sleep(400);
    const networkCasted = network as Network;
    blocksByNetwork[networkCasted].start = await explorers[
      networkCasted
    ].mainnet.fetchBlockNumberByTimestamp({
      timestamp: startTimestamp,
    });
    blocksByNetwork[networkCasted].end = await explorers[
      networkCasted
    ].mainnet.fetchBlockNumberByTimestamp({
      timestamp: endTimestamp,
    });
  }

  console.log(blocksByNetwork);

  // for (const pool of topPools) {
  //   await sleep(400);
  //   const txlist = await explorers[pool.network].mainnet.fetchTxList({
  //     contractAddress: pool.address,
  //     offset: 1000,
  //   });
  //   await writeJSON(`./data/txs/${pool.network}.${pool.address.toLowerCase()}.json`, txlist);
  // }
};

main();
