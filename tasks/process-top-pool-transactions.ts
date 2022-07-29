import { Decimal } from 'decimal.js';
import lodash from 'lodash';
import { getTxs } from '../data/txs';
import { getPool } from '../data/pools';
import { writeJSON } from '../src/utils/write-json';
import { CurveTransaction, parseTransaction } from '../src/utils/parse-transaction';
import { topPools } from '../src/processed-data/pools';
import { processProminentTransactions } from '../src/utils/prominent-transactions';
import moment from 'moment';

const minimumTotalUsdAmount = new Decimal(10000);
const minimumTimestamp = moment().subtract(7, 'days');

const main = async () => {
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

    writeJSON(
      `./src/processed-data/txs/${network}.${contractAddress.toLowerCase()}.json`,
      processedTxs,
    );
  }
};

main();
