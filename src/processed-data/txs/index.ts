import path from 'path';
import { readFile } from 'fs/promises';
import { CurveTransaction } from '../../utils/parse-transaction';
import { Network } from '../../utils/curve.constants';

interface GetTopPoolTxsProps {
  network: Network;
  contractAddress: string;
}
export const getTopPoolTxs = async ({
  network,
  contractAddress,
}: GetTopPoolTxsProps): Promise<Array<CurveTransaction>> => {
  const txFile = await readFile(
    path.resolve(__dirname, `./${network}.${contractAddress}.json`),
    'utf8',
  );
  return JSON.parse(txFile) as Array<CurveTransaction>;
};
