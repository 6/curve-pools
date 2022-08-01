import { convertToSimplifiedPool, getPool } from '../data/pools';
import { writeJSON } from '../src/utils/write-json';
import { processTopPools } from '../src/utils/top-pools';
import { topPools } from '../src/processed-data/pools';
import { getLogs } from '../data/logs';
import { parseLog } from '../src/utils/parse-log';

const main = async () => {
  const skipped: Record<string, number> = {};
  const found: Record<string, number> = {};
  for (const topPool of topPools) {
    if (topPool.network !== 'ethereum') {
      // Only eth mainnet supports fetching paginated logs for now, ignore
      // other networks
      continue;
    }
    const pool = await getPool({
      network: topPool.network,
      poolType: topPool.poolType,
      contractAddress: topPool.address,
    });
    const logs = await getLogs({ network: pool.network, contractAddress: pool.address });
    // TODO: consider grouping logs by txhash here to sum totalUsdAmount etc...
    // example: 0x6bb33ef49cfa3ee47163c1f69a42d7d0d33362dda6a72ad4170e033686dd9e1c

    for (const log of logs) {
      const { decodedLog, parsedLog } = parseLog({
        pool,
        log,
      });
      if (parsedLog) {
        found[decodedLog.name] ??= 0;
        found[decodedLog.name]++;
      } else {
        skipped[decodedLog.name] ??= 0;
        skipped[decodedLog.name]++;
      }
    }
  }
  console.log({ skipped, found });
};

main();
