import path from 'path';
import { readFile } from 'fs/promises';
import { Network } from '../../src/utils/curve.constants';
import { EtherscanTxListResult } from '../../src/utils/etherscan';

interface GetTxsProps {
  network: Network;
  contractAddress: string;
}
export const getTxs = async ({
  network,
  contractAddress,
}: GetTxsProps): Promise<EtherscanTxListResult> => {
  const txFile = await readFile(
    path.resolve(__dirname, `./${network}.${contractAddress}.json`),
    'utf8',
  );
  return JSON.parse(txFile) as EtherscanTxListResult;
};
