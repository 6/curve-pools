import { Decimal } from 'decimal.js';
import moment from 'moment';
import mockTxs from '../../test/fixtures/txs/3pool.txs.json';
import { mock3Pool } from '../../test/mock-pools';
import { processProminentTransactions } from './prominent-transactions';

describe('processProminentTransactions', () => {
  it('returns transactions over a given usd threshold', async () => {
    const pool = await mock3Pool();
    const txs = processProminentTransactions({
      pool,
      txs: mockTxs,
      minimumTotalUsdAmount: new Decimal('1000000'),
    });
    expect(txs.length).toEqual(47);
    expect(txs[0]).toMatchObject({
      hash: '0xec8beb20c1702a79c51f60b56e98f17c2e3392215a78aca4fb9e1e0ba478231d',
      timestamp: 1659125556,
      totalUsdAmount: new Decimal('1001000'),
    });
    expect(txs[1]).toMatchObject({
      hash: '0xd6d05c0f1f08ab62390551e787dd239d29cd8585877410cca35cf35e4666e5fd',
      timestamp: 1659113144,
      totalUsdAmount: new Decimal('4362074'),
    });
  });

  it('returns transactions after a given timestamp threshold', async () => {
    const pool = await mock3Pool();
    const txs = processProminentTransactions({
      pool,
      txs: mockTxs,
      minimumTimestamp: moment(1659128081 * 1000),
    });
    expect(txs.length).toEqual(90);
    expect(txs[0]).toMatchObject({
      hash: '0x4d97fdc7bdf8b480f37930e17661cb6f213ef3827f2e1c405588b45c402d868b',
      timestamp: 1659203471,
    });
  });
});
