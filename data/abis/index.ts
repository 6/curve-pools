import path from 'path';
import { readFile } from 'fs/promises';
import { Network, PoolType } from '../../src/utils/curve.constants';
import { EtherscanABIResult } from '../../src/utils/etherscan';
import { ethers } from 'ethers';
interface ABIMap {
  [contractAddress: string]: EtherscanABIResult;
}
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
  const abiMapFile = await readFile(
    path.resolve(__dirname, `./${network}.${poolType}.json`),
    'utf8',
  );
  const abiMap = JSON.parse(abiMapFile) as ABIMap;
  const abi = abiMap[contractAddress];
  if (abi == null) {
    throw new Error(`getABI: incorrect contractAddress ${contractAddress}`);
  }
  return abi;
};

export const getABIInterface = async ({
  network,
  poolType,
  contractAddress,
}: GetABIProps): Promise<ethers.utils.Interface> => {
  const abi = await getABI({ network, poolType, contractAddress });
  return new ethers.utils.Interface(JSON.stringify(abi));
};
