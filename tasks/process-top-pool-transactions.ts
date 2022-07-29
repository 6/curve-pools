import lodash from 'lodash';
import { getTxs } from '../data/txs';
import { getPool } from '../data/pools';
import { writeJSON } from '../src/utils/write-json';
import { CurveTransaction, parseTransaction } from '../src/utils/parse-transaction';
import { topPools } from '../src/processed-data/pools';

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

    const parsedTxs = lodash.compact(
      txs.map((tx) => {
        try {
          const { transaction } = parseTransaction({ pool, tx });
          return transaction;
        } catch (e) {
          console.log(tx);
          const decodedInput = pool.interface.parseTransaction({
            data: tx.input,
            value: tx.value,
          });
          console.log(decodedInput);
          throw e;
        }
      }),
    ) as Array<CurveTransaction>;

    writeJSON(
      `./src/processed-data/txs/${network}.${contractAddress.toLowerCase()}.json`,
      parsedTxs,
    );
  }
};

main();
