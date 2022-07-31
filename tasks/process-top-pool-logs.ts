import { convertToSimplifiedPool, getPool } from '../data/pools';
import { writeJSON } from '../src/utils/write-json';
import { processTopPools } from '../src/utils/top-pools';
import { topPools } from '../src/processed-data/pools';
import { getLogs } from '../data/logs';

const main = async () => {
  const poolSimplified = topPools[0];
  const pool = await getPool({
    network: poolSimplified.network,
    poolType: poolSimplified.poolType,
    contractAddress: poolSimplified.address,
  });
  const logs = await getLogs({ network: pool.network, contractAddress: pool.address });

  const log = logs[0];
  console.log(log);
  const parsedLog = pool.interface.parseLog(log);
  console.log(parsedLog);

  const log2 = logs[1];
  console.log(log2);
  const parsedLog2 = pool.interface.parseLog(log2);
  console.log(parsedLog2);

  const logPairWithSameHash = logs.filter(
    (l) =>
      l.transactionHash === '0x6bb33ef49cfa3ee47163c1f69a42d7d0d33362dda6a72ad4170e033686dd9e1c',
  );
  const parsedLogA = pool.interface.parseLog(logPairWithSameHash[0]);
  const parsedLogB = pool.interface.parseLog(logPairWithSameHash[1]);
  console.log('PAIR:======', parsedLogA, parsedLogB);
};

main();
