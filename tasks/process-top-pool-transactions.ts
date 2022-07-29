import { Decimal } from 'decimal.js';
import { getTxs } from '../data/txs';
import { getPool } from '../data/pools';
import { writeJSON } from '../src/utils/write-json';
import { CurveTransaction } from '../src/utils/parse-transaction';
import { topPools } from '../src/processed-data/pools';
import { processProminentTransactions } from '../src/utils/prominent-transactions';
import moment from 'moment';
import { Network } from '../src/utils/curve.constants';

const minimumTotalUsdAmount = new Decimal(10000);
const minimumTimestamp = moment().subtract(7, 'days');

const main = async () => {
  const txsByNetwork: Record<Network, Record<string, Array<CurveTransaction>>> = {
    ethereum: {},
    optimism: {},
    arbitrum: {},
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
      minimumTotalUsdAmount,
      minimumTimestamp,
    });

    txsByNetwork[network][pool.address] = processedTxs;
  }

  for (const network in txsByNetwork) {
    const txs = txsByNetwork[network as Network];
    writeJSON(`./src/processed-data/txs/${network}.json`, txs);
  }
};

main();
