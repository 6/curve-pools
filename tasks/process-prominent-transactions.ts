import { getTxs } from '../data/txs';
import { getPool } from '../data/pools';
import { writeJSON } from '../src/utils/write-json';
import { CurveTransaction } from '../src/utils/parse-transaction';
import { topPools } from '../src/processed-data/pools';
import { processProminentTransactions } from '../src/utils/prominent-transactions';
import {
  Network,
  PROMINENT_TRANSACTIONS_MINIMUM_DATE_THRESHOLD,
  PROMINENT_TRANSACTIONS_MINIMUM_USD_THRESHOLD,
} from '../src/utils/curve.constants';

const main = async () => {
  const txsByNetwork: Record<Network, Record<string, Array<CurveTransaction>>> = {
    ethereum: {},
    optimism: {},
    arbitrum: {},
    fantom: {},
    polygon: {},
    avalanche: {},
  };
  for (const simplifiedPool of topPools) {
    const pool = await getPool({
      network: simplifiedPool.network,
      poolType: simplifiedPool.poolType,
      contractAddress: simplifiedPool.address,
    });

    const network = pool.network;
    const contractAddress = pool.address;
    const txs = await getTxs({ network, contractAddress });

    console.log(
      `[process-pool-transactions] ${network} pool=${contractAddress} (${pool.name}) with ${txs.length} txs`,
    );

    const processedTxs = processProminentTransactions({
      pool,
      txs,
      minimumTotalUsdAmount: PROMINENT_TRANSACTIONS_MINIMUM_USD_THRESHOLD,
      minimumTimestamp: PROMINENT_TRANSACTIONS_MINIMUM_DATE_THRESHOLD,
    });

    txsByNetwork[network][pool.address] = processedTxs;
  }

  for (const network in txsByNetwork) {
    const txs = txsByNetwork[network as Network];
    writeJSON(`./src/processed-data/txs/prominent-${network}.json`, txs);
  }
};

main();
