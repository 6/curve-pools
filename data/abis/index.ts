import path from 'path';
import { readFile } from 'fs/promises';
import { Network, PoolType } from '../../src/utils/curve.constants';
import { EtherscanABIResult } from '../../src/utils/etherscan';
interface ABIMap {
  [contractAddress: string]: EtherscanABIResult;
}

interface GetABIsProps {
  network: Network;
  poolType: PoolType;
}
export const getABIs = async ({ network, poolType }: GetABIsProps): Promise<ABIMap> => {
  const abiMapFile = await readFile(
    path.resolve(__dirname, `./${network}.${poolType}.json`),
    'utf8',
  );
  return JSON.parse(abiMapFile) as ABIMap;
};

interface GetABIProps {
  network: Network;
  poolType: PoolType;
  contractAddress: string;
}
export const getABI = async ({
  network,
  poolType,
  contractAddress,
}: GetABIProps): Promise<EtherscanABIResult> => {
  const abis = await getABIs({ network, poolType });
  const abi = abis[contractAddress];
  if (abi == null) {
    throw new Error(`getABI: incorrect contractAddress ${contractAddress}`);
  }
  return abi;
};
