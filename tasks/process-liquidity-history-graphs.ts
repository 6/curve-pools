import { convertToExtendedPool } from '../data/pools';
import { writeJSON } from '../src/utils/write-json';
import { topPools } from '../src/processed-data/pools';
import {
  generatePoolLiquidityGraph,
  PoolLiquidityHistory,
} from '../src/utils/generate-pool-liquidity-history';
import { getTxs } from '../data/txs';
import { TRANSACTIONS_MINIMUM_DATE_THRESHOLD } from '../src/utils/curve.constants';

const main = async () => {
  const graphs: Record<string, PoolLiquidityHistory | void> = {};
  for (const topPool of topPools) {
    console.log(
      `[process-liquidity-history] for pool=${
        topPool.shortName ?? topPool.name ?? topPool.address
      }`,
    );
    const pool = await convertToExtendedPool(topPool);
    const txs = await getTxs({ network: pool.network, contractAddress: pool.address });

    const graph = generatePoolLiquidityGraph({
      minimumTimestamp: TRANSACTIONS_MINIMUM_DATE_THRESHOLD,
      pool,
      txs,
    });
    if (graph) {
      graphs[pool.address.toLowerCase()] = graph;
    }
  }
  await writeJSON(`./src/processed-data/txs/liquidity-history.json`, graphs);
};

main();
