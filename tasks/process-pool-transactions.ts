import lodash from 'lodash';
import { getTxs } from '../data/txs';
import { getPools } from '../data/pools';
import { writeJSON } from '../src/utils/write-json';
import { CurveAssetTypeName, CURVE_NETWORKS, CURVE_POOL_TYPES } from '../src/utils/curve.constants';
import { CurveTransaction, parseTransaction } from '../src/utils/parse-transaction';

const main = async () => {
  for (const network of CURVE_NETWORKS) {
    for (const poolType of CURVE_POOL_TYPES) {
      const pools = await getPools({ network, poolType });
      const txsMap: Record<string, Array<CurveTransaction>> = {};
      for (const pool of pools) {
        // Skip pools with uncorrelated/other assets like tricrypto
        if (
          pool.assetTypeName === CurveAssetTypeName.UNKNOWN ||
          pool.assetTypeName === CurveAssetTypeName.OTHER
        ) {
          console.info(
            `[process-pool-transactions] skipping unknown/other pool ${pool.name} (${network} => ${pool.address})`,
          );
          continue;
        }

        const contractAddress = pool.address;
        const txs = await getTxs({ network, poolType, contractAddress });

        console.log(
          `[process-pool-transactions] ${network}.${poolType} pool=${contractAddress} (${pool.name}) with ${txs.length} txs`,
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

        txsMap[contractAddress] = parsedTxs;
      }
      writeJSON(`./src/processed-data/txs/${network}.${poolType}.json`, txsMap);
    }
  }
};

main();
