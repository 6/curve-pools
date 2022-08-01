import path from 'path';
import { readFile } from 'fs/promises';
import { Network } from '../../src/utils/curve.constants';
import { EtherscanLogsResult } from '../../src/utils/etherscan';

interface GetLogsProps {
  network: Network;
  contractAddress: string;
}
export const getLogs = async ({
  network,
  contractAddress,
}: GetLogsProps): Promise<EtherscanLogsResult> => {
  const logsFile = await readFile(
    path.resolve(__dirname, `./${network}.${contractAddress.toLowerCase()}.json`),
    'utf8',
  );
  return JSON.parse(logsFile) as EtherscanLogsResult;
};
