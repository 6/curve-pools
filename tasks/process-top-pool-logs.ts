import { getPool } from '../data/pools';
import { writeJSON } from '../src/utils/write-json';
import { topPools } from '../src/processed-data/pools';
import { getLogs } from '../data/logs';
import { ParsedCurveLog, parseLog } from '../src/utils/parse-log';
import {
  generatePoolExchangeRateGraph,
  GraphDataPoints,
} from '../src/utils/generate-pool-exchange-rate-graph';

const main = async () => {
  const exchangeRateGraphs: Record<string, GraphDataPoints | void> = {};
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

    let parsedLogs: Array<ParsedCurveLog> = [];
    for (const log of logs) {
      const { parsedLog } = parseLog({
        pool,
        log,
      });
      if (parsedLog) {
        parsedLogs = parsedLogs.concat(parsedLog);
      }
    }

    const graph = generatePoolExchangeRateGraph({ pool, logs: parsedLogs });
    if (graph) {
      exchangeRateGraphs[pool.address.toLowerCase()] = graph;
    }
  }
  await writeJSON(`./src/processed-data/logs/ethereum.exchange-rates.json`, exchangeRateGraphs);
};

main();
