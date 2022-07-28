import path from 'path';
import { readFile } from 'fs/promises';
import { Network, PoolType } from '../../src/utils/curve.constants';
import { EtherscanTxListResult } from '../../src/utils/etherscan';
interface TxMap {
  [contractAddress: string]: EtherscanTxListResult;
}

interface GetTxsProps {
  network: Network;
  poolType: PoolType;
  contractAddress: string;
}
export const getTxs = async ({
  network,
  poolType,
  contractAddress,
}: GetTxsProps): Promise<EtherscanTxListResult> => {
  const txMapFile = await readFile(
    path.resolve(__dirname, `./${network}.${poolType}.json`),
    'utf8',
  );
  const txMap = JSON.parse(txMapFile) as TxMap;
  const txs = txMap[contractAddress];
  if (txs == null) {
    throw new Error(`getTxs: incorrect contractAddress ${contractAddress}`);
  }
  return txs;
};
