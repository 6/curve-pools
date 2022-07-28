import path from 'path';
import { readFile } from 'fs/promises';
import { Network, PoolType } from '../../src/utils/curve.constants';
import { CurvePoolMetadata, GetPoolsResponse } from '../../src/utils/get-pools';

interface GetPoolsProps {
  network: Network;
  poolType: PoolType;
}
export const getPools = async ({
  network,
  poolType,
}: GetPoolsProps): Promise<Array<CurvePoolMetadata>> => {
  const poolsFile = await readFile(
    path.resolve(__dirname, `./${network}.${poolType}.json`),
    'utf8',
  );
  const poolsResponse = JSON.parse(poolsFile) as GetPoolsResponse;
  return poolsResponse.data.poolData;
};

interface GetPoolProps {
  network: Network;
  poolType: PoolType;
  contractAddress: string;
}
export const getPool = async ({
  network,
  poolType,
  contractAddress,
}: GetPoolProps): Promise<CurvePoolMetadata> => {
  const pools = await getPools({ network, poolType });
  const pool = pools.find((p) => p.address === contractAddress);
  if (pool == null) {
    throw new Error(`getPool: incorrect contractAddress ${contractAddress}`);
  }
  return pool;
};
