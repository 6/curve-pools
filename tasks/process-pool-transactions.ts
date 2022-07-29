import lodash from 'lodash';
import { getTxs } from '../data/txs';
import { getPools } from '../data/pools';
import { writeJSON } from '../src/utils/write-json';
import { CurveAssetTypeName } from '../src/utils/curve.constants';
import { parseTransaction } from '../src/utils/parse-transaction';

const main = async () => {
  // For now, just focus on limited set of data:
  const network = 'ethereum';
  const poolType = 'main';

  const pools = await getPools({ network, poolType });
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

    const parsedTxs = lodash.compact(
      txs.map((tx) => {
        const { transaction } = parseTransaction({ pool, tx });
        return transaction;
      }),
    );

    writeJSON(`./src/processed-data/txs/${network}.${poolType}.json`, parsedTxs);

    break;
  }
};

main();
