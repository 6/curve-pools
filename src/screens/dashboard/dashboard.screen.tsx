import { useProminentTransactions } from '../../hooks/use-prominent-transactions';
import { useTopPools } from '../../hooks/use-top-pools';

export const DashboardScreen = () => {
  const topPools = useTopPools();

  console.log('top pools:', topPools);

  const prominentTxs = useProminentTransactions({ pool: topPools[0] });

  console.log('prominent txs:', prominentTxs);

  return <h1>Dashboard</h1>;
};
