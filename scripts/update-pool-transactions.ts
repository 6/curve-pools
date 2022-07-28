import { sleep } from '../src/utils/sleep';
import { explorers } from '../src/utils/etherscan';
import { writeJSON } from '../src/utils/write-json';

const main = async () => {
  const contractAddress = '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7';

  await sleep(500);
  const txlist = await explorers.etherscan.mainnet.fetchTxList({ contractAddress });
  if (txlist) {
    await writeJSON(`./data/tx/${contractAddress}.json`, txlist);
  }
};

main();
