import lodash from 'lodash';
import { Decimal } from 'decimal.js';
import { CurvePoolExtended } from '../../data/pools';
import { EtherscanTxListResult } from './etherscan';
import { CurveTransaction, parseTransaction } from './parse-transaction';
import moment, { Moment } from 'moment';

interface ProcessProminentTransactionsProps {
  pool: CurvePoolExtended;
  txs: EtherscanTxListResult;
  minimumTotalUsdAmount: Decimal;
  minimumTimestamp: Moment;
}
export const processProminentTransactions = ({
  pool,
  txs,
  minimumTotalUsdAmount,
  minimumTimestamp,
}: ProcessProminentTransactionsProps): Array<CurveTransaction> => {
  const parsedTxs = lodash.compact(
    txs.map((tx) => {
      try {
        const { transaction } = parseTransaction({ pool, tx });
        return transaction;
      } catch (e) {
        console.log(tx);
        const decodedInput = pool.interface.parseTransaction({
          data: tx.input,
          value: tx.value,
        });
        console.log(decodedInput);
        throw e;
      }
    }),
  ) as Array<CurveTransaction>;

  return parsedTxs.filter((tx) => {
    return (
      tx.totalUsdAmount.gte(minimumTotalUsdAmount) &&
      moment(tx.timestamp * 1000).isSameOrAfter(minimumTimestamp)
    );
  });
};
