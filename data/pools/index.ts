import path from 'path';
import { readFile } from 'fs/promises';
import { ethers } from 'ethers';
import lodash from 'lodash';
import { CurveAssetTypeName, Network, PoolType } from '../../src/utils/curve.constants';
import {
  CurvePoolMetadata,
  CurvePoolToken,
  FetchPoolsResponse,
  GaugeMetadata,
} from '../../src/utils/curve-api';
import { getABIs } from '../abis';
import { getGauge } from '../gauges';
import { IPoolData } from '@curvefi/api/lib/interfaces';
import * as POOL_CONSTANTS from '@curvefi/api/lib/constants/pools';

export interface CurvePoolExtended extends CurvePoolMetadata {
  shortName: string | void;
  interface: ethers.utils.Interface;
  gauge: GaugeMetadata | void;
  constants: IPoolData | void;
  network: Network;
  poolType: PoolType;
}

export type CurvePoolExtendedWithoutABI = Omit<CurvePoolExtended, 'interface'>;

export interface CurvePoolSimplified {
  id: string;
  shortName?: string | void;
  name?: string | void;
  network: Network;
  poolType: PoolType;
  assetTypeName: CurveAssetTypeName;
  isMetaPool: boolean;
  address: string;
  coins: Array<CurvePoolToken>;
  usdTotal: number;
}

interface GetRawPoolDataProps {
  network: Network;
  poolType: PoolType;
}
export const getRawPoolData = async ({
  network,
  poolType,
}: GetRawPoolDataProps): Promise<Array<CurvePoolMetadata>> => {
  const poolsFile = await readFile(
    path.resolve(__dirname, `./${network}.${poolType}.json`),
    'utf8',
  );
  const poolsResponse = JSON.parse(poolsFile) as FetchPoolsResponse;
  return poolsResponse.data.poolData;
};

interface GetPoolDataWithoutDuplicatesProps {
  network: Network;
  poolType: PoolType;
}
const getPoolDataWithoutDuplicates = async ({
  network,
  poolType,
}: GetPoolDataWithoutDuplicatesProps): Promise<Array<CurvePoolMetadata>> => {
  if (poolType !== 'factory') {
    return await getRawPoolData({ network, poolType });
  }
  // Factory pools sometimes get upgraded to one of the other pool types?
  const factoryPools = await getRawPoolData({ network, poolType });
  const mainPoolAddresses = (await getRawPoolData({ network, poolType: 'main' })).map((pool) =>
    pool.address.toLowerCase(),
  );
  const cryptoPoolAddresses = (await getRawPoolData({ network, poolType: 'crypto' })).map((pool) =>
    pool.address.toLowerCase(),
  );

  return factoryPools.filter((pool) => {
    return (
      !mainPoolAddresses.includes(pool.address.toLowerCase()) &&
      !cryptoPoolAddresses.includes(pool.address.toLowerCase())
    );
  });
};

interface GetPoolsWithoutABIProps {
  network: Network;
  poolType: PoolType;
}
export const getPoolsWithoutABI = async ({
  network,
  poolType,
}: GetPoolsWithoutABIProps): Promise<Array<CurvePoolExtendedWithoutABI>> => {
  const pools = await getPoolDataWithoutDuplicates({ network, poolType });
  return pools.map((pool) => {
    const gauge = getGauge({ contractAddress: pool.address });
    const constants = getPoolConstants({ network, contractAddress: pool.address });
    // Rarely pools will have none of the first three,
    // e.g. linkusd on eth mainnet: 0xe7a24ef0c5e95ffb0f6684b813a78f2a3ad7d171
    const shortName = constants?.name ?? gauge?.name;

    return {
      ...pool,
      shortName,
      gauge,
      constants,
      network,
      poolType,
    };
  });
};

interface GetPoolsProps {
  network: Network;
  poolType: PoolType;
}
export const getPools = async ({
  network,
  poolType,
}: GetPoolsProps): Promise<Array<CurvePoolExtended>> => {
  const pools = await getPoolsWithoutABI({ network, poolType });
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

interface GetPoolConstantsProps {
  network: Network;
  contractAddress: string;
}
const getPoolConstants = ({
  network,
  contractAddress,
}: GetPoolConstantsProps): IPoolData | void => {
  let poolConstants;
  if (network === 'optimism') {
    poolConstants = POOL_CONSTANTS.POOLS_DATA_OPTIMISM;
  } else if (network === 'arbitrum') {
    poolConstants = POOL_CONSTANTS.POOLS_DATA_ARBITRUM;
  } else if (network === 'fantom') {
    poolConstants = POOL_CONSTANTS.POOLS_DATA_FANTOM;
  } else if (network === 'polygon') {
    poolConstants = POOL_CONSTANTS.POOLS_DATA_POLYGON;
  } else if (network === 'avalanche') {
    poolConstants = POOL_CONSTANTS.POOLS_DATA_AVALANCHE;
  } else if (network === 'ethereum') {
    poolConstants = POOL_CONSTANTS.POOLS_DATA_ETHEREUM;
  } else {
    throw new Error(`getPoolConstants: unknown network ${network}`);
  }

  for (const poolId in poolConstants) {
    const pool = poolConstants[poolId];
    if (pool.swap_address.toLowerCase() === contractAddress.toLowerCase()) {
      return pool;
    }
  }
};

export const convertToSimplifiedPool = (
  pool: CurvePoolExtended | CurvePoolExtendedWithoutABI,
): CurvePoolSimplified => {
  return lodash.pick(pool, [
    'id',
    'shortName',
    'name',
    'network',
    'poolType',
    'assetTypeName',
    'isMetaPool',
    'address',
    'coins',
    'usdTotal',
  ]);
};

export const convertToExtendedPool = async (
  simplifiedPool: CurvePoolSimplified,
): Promise<CurvePoolExtended> => {
  return await getPool({
    network: simplifiedPool.network,
    poolType: simplifiedPool.poolType,
    contractAddress: simplifiedPool.address,
  });
};
