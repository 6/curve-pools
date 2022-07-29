import path from 'path';
import { readFile } from 'fs/promises';
import { ethers } from 'ethers';
import lodash from 'lodash';
import { Network, PoolType } from '../../src/utils/curve.constants';
import { CurvePoolMetadata, FetchPoolsResponse, GaugeMetadata } from '../../src/utils/curve-api';
import { getABIs } from '../abis';
import { getGauge } from '../gauges';

export interface CurvePoolExtended extends CurvePoolMetadata {
  interface: ethers.utils.Interface;
  gauge: GaugeMetadata | void;
}

interface GetPoolsProps {
  network: Network;
  poolType: PoolType;
}
export const getPools = async ({
  network,
  poolType,
}: GetPoolsProps): Promise<Array<CurvePoolExtended>> => {
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
      const gauge = getGauge({ contractAddress: pool.address });
      return {
        ...pool,
        gauge,
        interface: new ethers.utils.Interface(JSON.stringify(abi)),
      };
    }),
  );
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
}: GetPoolProps): Promise<CurvePoolExtended> => {
  const lowercaseContractAddress = contractAddress.toLowerCase();
  const pools = await getPools({ network, poolType });
  const pool = pools.find((p) => p.address.toLowerCase() === lowercaseContractAddress);
  if (pool == null) {
    throw new Error(`getPool: incorrect contractAddress ${contractAddress}`);
  }
  return pool;
};
