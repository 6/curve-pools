import path from 'path';
import { readFile } from 'fs/promises';
import { ethers } from 'ethers';
import lodash from 'lodash';
import { CURVE_POOL_TYPES, Network, PoolType } from '../../src/utils/curve.constants';
import { CurvePoolMetadata, FetchPoolsResponse } from '../../src/utils/curve-api';
import { getABIs } from '../abis';

export interface CurvePoolWithInterface extends CurvePoolMetadata {
  interface: ethers.utils.Interface;
}

interface GetPoolsProps {
  network: Network;
  poolType?: PoolType;
}
export const getPools = async ({
  network,
  poolType,
}: GetPoolsProps): Promise<Array<CurvePoolWithInterface>> => {
  // Default to all pool types:
  const poolTypes = poolType ? [poolType] : CURVE_POOL_TYPES;
  let pools: Array<CurvePoolWithInterface> = [];
  for (const poolType of poolTypes) {
    const poolsForPoolType = await getPoolsForPoolType({ network, poolType });
    pools = pools.concat(poolsForPoolType);
  }
  return pools;
};

interface GetPoolsForPoolTypeProps {
  network: Network;
  poolType: PoolType;
}
const getPoolsForPoolType = async ({
  network,
  poolType,
}: GetPoolsForPoolTypeProps): Promise<Array<CurvePoolWithInterface>> => {
  const poolsFile = await readFile(
    path.resolve(__dirname, `./${network}.${poolType}.json`),
    'utf8',
  );
  const poolsResponse = JSON.parse(poolsFile) as FetchPoolsResponse;
  const pools = poolsResponse.data.poolData;
  const abis = await getABIs({ network, poolType });
  return lodash.compact(
    pools.map((pool) => {
      const abi = abis[pool.address.toLowerCase()];
      if (!abi) {
        // Ignore pools that don't have a verified contract yet:
        return;
      }
      return {
        ...pool,
        interface: new ethers.utils.Interface(JSON.stringify(abi)),
      };
    }),
  );
};

interface GetPoolProps {
  network: Network;
  poolType?: PoolType;
  contractAddress: string;
}
export const getPool = async ({
  network,
  poolType,
  contractAddress,
}: GetPoolProps): Promise<CurvePoolWithInterface> => {
  const lowercaseContractAddress = contractAddress.toLowerCase();
  const pools = await getPools({ network, poolType });
  const pool = pools.find((p) => p.address.toLowerCase() === lowercaseContractAddress);
  if (pool == null) {
    throw new Error(`getPool: incorrect contractAddress ${contractAddress}`);
  }
  return pool;
};
