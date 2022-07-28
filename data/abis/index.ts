import path from 'path';
import { readFile } from 'fs/promises';
import { Network, PoolType } from '../../src/utils/curve.constants';
import { EtherscanABIResult } from '../../src/utils/etherscan';
interface ABIMap {
  [contractAddress: string]: EtherscanABIResult;
}
interface GetAbiProps {
  network: Network;
  poolType: PoolType;
  contractAddress: string;
}
export const getABI = async ({
  network,
  poolType,
  contractAddress,
}: GetAbiProps): Promise<EtherscanABIResult> => {
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
