import moment, { Moment } from 'moment';
import { useMemo } from 'react';
import { CurvePoolSimplified } from '../../../data/pools';
import { getProminentTxs } from '../../processed-data/txs';
import { getLogoURLForToken } from '../../utils/curve-ui-data';
import { usdFormatter } from '../../utils/number-formatters';
import { CurveTokenWithAmount, CurveTransaction } from '../../utils/parse-transaction';

interface CurveTokenForUi extends CurveTokenWithAmount {
  logoURL: string;
  usdAmountFormatted?: string;
}

interface CurveTransactionForUi extends CurveTransaction {
  totalUsdFormatted: string;
  timestampMoment: Moment;
  tokens: Array<CurveTokenForUi>;
}

interface PopulateTxUiDataProps {
  pool: CurvePoolSimplified;
  tx: CurveTransaction;
}
const populateTxUiData = ({ pool, tx }: PopulateTxUiDataProps): CurveTransactionForUi => {
  const tokens = tx.tokens.map((token) => {
    const logoURL = getLogoURLForToken({ network: pool.network, tokenAddress: token.address });
    const usdAmountFormatted = token.usdAmount
      ? usdFormatter.format(token.usdAmount.toNumber())
      : undefined;
    return {
      ...token,
      logoURL,
      usdAmountFormatted,
    };
  });

  const totalUsdFormatted = usdFormatter.format(tx.totalUsdAmount.toNumber());
  const timestampMoment = moment(tx.timestamp * 1000);

  return {
    ...tx,
    tokens,
    totalUsdFormatted,
    timestampMoment,
  };
};

interface UseProminentTransactionsProps {
  pool: CurvePoolSimplified;
}
export const useProminentTransactions = ({
  pool,
}: UseProminentTransactionsProps): Array<CurveTransactionForUi> => {
  return useMemo(() => {
    return getProminentTxs({
      contractAddress: pool.address,
      network: pool.network,
    }).map((tx) => populateTxUiData({ pool, tx }));
  }, [pool]);
};
