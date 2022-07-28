import path from 'path';
import { readFile } from 'fs/promises';
import { Network, PoolType } from '../../src/utils/curve.constants';
import { CurvePoolMetadata, FetchPoolsResponse } from '../../src/utils/curve-api';

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
  const poolsResponse = JSON.parse(poolsFile) as FetchPoolsResponse;
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
  const lowercaseContractAddress = contractAddress.toLowerCase();
  const pools = await getPools({ network, poolType });
  const pool = pools.find((p) => p.address.toLowerCase() === lowercaseContractAddress);
  if (pool == null) {
    throw new Error(`getPool: incorrect contractAddress ${contractAddress}`);
  }
  return pool;
};
