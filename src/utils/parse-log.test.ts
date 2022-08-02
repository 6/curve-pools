import { Decimal } from 'decimal.js';
import { mock3Pool, mockFraxPool, mockStethPool } from '../../test/mock-pools';
import { parseLog } from './parse-log';
import { CurveTransactionType } from './parse-transaction';

describe('parseLog', () => {
  describe('AddLiquidity', () => {
    const log = {
      address: '0xdc24316b9ae028f1497c275eb9192a3ea0f67022',
      topics: [
        '0x26f55a85081d24974e85c6c00045d0f0453991e95873f52bff0d21af4079a768',
        '0x0000000000000000000000005ce9b49b7a1be9f2c3dc2b2a5bacea56fa21fbee',
      ],
      data: '0x0000000000000000000000000000000000000000000000004563918244f40000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000026cdd2482451000000000000000000000000000000000000000000000000000027923515f7b2600000000000000000000000000000000000000000000a33696f9c5537aba316d000000000000000000000000000000000000000000009bffce54b9208775ef95',
      blockNumber: '0xe80635',
      timeStamp: '0x62dd5c1a',
      gasPrice: '0x1f9e5538d',
      gasUsed: '0x5b514',
      logIndex: '0x195',
      transactionHash: '0xbf1c175b706d02a9d4bcf8e7d4c8ad6706d644df23c27a75b76cd40d75f6c3d8',
      transactionIndex: '0x102',
    };

    it('returns the correct transaction type and amounts', async () => {
      const pool = await mockStethPool();
      const { parsedLog } = parseLog({ pool, log });
      console.log(parsedLog);
      expect(parsedLog?.type).toEqual(CurveTransactionType.ADD_LIQUIDITY);
      expect(parsedLog?.hash).toEqual(
        '0xbf1c175b706d02a9d4bcf8e7d4c8ad6706d644df23c27a75b76cd40d75f6c3d8',
      );
      expect(parsedLog?.timestamp).toEqual(1658674202);
      expect(parsedLog?.totalUsdAmount).toEqual(new Decimal('8632.15'));
      expect(parsedLog?.tokens).toEqual([
        {
          symbol: 'ETH',
          tokenAmount: new Decimal('5'),
          usdPrice: new Decimal('1726.43'),
          usdAmount: new Decimal('8632.15'),
          liquidityImpact: 'add',
        },
      ]);
    });
  });

  describe('RemoveLiquidity (with 0 amount removed)', () => {
    const log = {
      address: '0xdc24316b9ae028f1497c275eb9192a3ea0f67022',
      topics: [
        '0x7c363854ccf79623411f8995b362bce5eddff18c927edc6f5dbbb5e05819a82c',
        '0x000000000000000000000000ea508f82728927454bd3ce853171b0e2705880d4',
      ],
      data: '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009c04e53d813489ff6f44',
      blockNumber: '0xe8077f',
      timeStamp: '0x62dd6ccb',
      gasPrice: '0x2e3117bb2',
      gasUsed: '0xd7186',
      logIndex: '0x169',
      transactionHash: '0x75e9a1f62fd1cd35277f0875687c91b431610481ebbc5f6fecc9312232c7bf0a',
      transactionIndex: '0xe0',
    };

    it('returns the correct transaction type and amounts', async () => {
      const pool = await mockStethPool();
      const { parsedLog } = parseLog({ pool, log });
      console.log(parsedLog);
      expect(parsedLog?.type).toEqual(CurveTransactionType.REMOVE_LIQUIDITY);
      expect(parsedLog?.hash).toEqual(
        '0x75e9a1f62fd1cd35277f0875687c91b431610481ebbc5f6fecc9312232c7bf0a',
      );
      expect(parsedLog?.timestamp).toEqual(1658678475);
      expect(parsedLog?.totalUsdAmount).toEqual(new Decimal('0'));
      expect(parsedLog?.tokens).toEqual([]);
    });
  });

  describe('RemoveLiquidity (with >0 amount removed)', () => {
    const log = {
      address: '0xdc24316b9ae028f1497c275eb9192a3ea0f67022',
      topics: [
        '0x7c363854ccf79623411f8995b362bce5eddff18c927edc6f5dbbb5e05819a82c',
        '0x0000000000000000000000004064641ac262e69e7c9adec3d0f6e51c39887e81',
      ],
      data: '0x000000000000000000000000000000000000000000000000551df49fe68e3795000000000000000000000000000000000000000000000000e0b24fcf1bb7c8b20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a517eca6c8f3edae175f',
      blockNumber: '0xe88d49',
      timeStamp: '0x62e47645',
      gasPrice: '0x1ab56bda6',
      gasUsed: '0x1cd07',
      logIndex: '0x144',
      transactionHash: '0x9e920fe97b13ddf433b400855b47571abe5d2179c0ecbb6fe3fa884403e175b9',
      transactionIndex: '0xa5',
    };

    it('returns the correct transaction type and amounts', async () => {
      const pool = await mockStethPool();
      const { parsedLog } = parseLog({ pool, log });
      console.log(parsedLog);
      expect(parsedLog?.type).toEqual(CurveTransactionType.REMOVE_LIQUIDITY);
      expect(parsedLog?.hash).toEqual(
        '0x9e920fe97b13ddf433b400855b47571abe5d2179c0ecbb6fe3fa884403e175b9',
      );
      expect(parsedLog?.timestamp).toEqual(1659139653);
      expect(parsedLog?.totalUsdAmount).toEqual(new Decimal('37820.070966402654195'));
      expect(parsedLog?.tokens).toEqual([
        {
          symbol: 'ETH',
          tokenAmount: new Decimal('6.133327235153541013'),
          usdAmount: new Decimal('10588.760138586127811'),
          usdPrice: new Decimal('1726.43'),
          liquidityImpact: 'remove',
        },
        {
          symbol: 'stETH',
          tokenAmount: new Decimal('16.191091361292208306'),
          usdAmount: new Decimal('27231.310827816526384'),
          usdPrice: new Decimal('1681.87'),
          liquidityImpact: 'remove',
        },
      ]);
    });
  });

  describe('RemoveLiquidityOne', () => {
    const log = {
      address: '0xdc24316b9ae028f1497c275eb9192a3ea0f67022',
      topics: [
        '0x9e96dd3b997a2a257eec4df9bb6eaf626e206df5f543bd963682d143300be310',
        '0x000000000000000000000000e859231d5ef4051d300698b9d46c421de1d7d5e0',
      ],
      data: '0x00000000000000000000000000000000000000000000000002e4bcb71da7847b00000000000000000000000000000000000000000000000002fdab1ce407273f',
      blockNumber: '0xe810a4',
      timeStamp: '0x62dde850',
      gasPrice: '0x2677449c2',
      gasUsed: '0x172a60',
      logIndex: '0xbc',
      transactionHash: '0x5be68ea89469de3d9f9f0941a88de65b9a4004873be6f3e8cb8315638cb610f9',
      transactionIndex: '0x46',
    };

    it('ignores it for now as it cannot be calculated', async () => {
      const pool = await mockStethPool();
      const { parsedLog } = parseLog({ pool, log });
      expect(parsedLog).toBeFalsy();
    });
  });

  describe('RemoveLiquidityImbalance', () => {
    const log = {
      address: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
      topics: [
        '0x173599dbf9c6ca6f7c3b590df07ae98a45d74ff54065505141e7de6c46a624c2',
        '0x0000000000000000000000000b686fee0102d9dbb2fb528f24408fe1aabdc87e',
      ],
      data: '0x000000000000000000000000000000000000000000000001b2085d858f9fd42c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002ae60190a68e3000000000000000000000000000000000000000000000000000000000000016f00000000000000000000000000000000000000000000000000000000000001830000000000000000000000000000000000000000030ff7ff217909de836a6019000000000000000000000000000000000000000002ff3e64baa19646c659b75b',
      blockNumber: '0xe84d6b',
      timeStamp: '0x62e11bc2',
      gasPrice: '0x1688d3925',
      gasUsed: '0x1d3e25',
      logIndex: '0x50',
      transactionHash: '0x98db4d084279ccab8e5401cb99edbac6fba84375422148a3115f9f5485961d7f',
      transactionIndex: '0x7',
    };

    it('returns the correct transaction type and amounts', async () => {
      const pool = await mock3Pool();
      const { parsedLog } = parseLog({ pool, log });
      console.log(parsedLog);
      expect(parsedLog?.type).toEqual(CurveTransactionType.REMOVE_LIQUIDITY);
      expect(parsedLog?.hash).toEqual(
        '0x98db4d084279ccab8e5401cb99edbac6fba84375422148a3115f9f5485961d7f',
      );
      expect(parsedLog?.timestamp).toEqual(1658919874);
      expect(parsedLog?.totalUsdAmount).toEqual(new Decimal('31.306625790936555495'));
      expect(parsedLog?.tokens).toEqual([
        {
          symbol: 'DAI',
          tokenAmount: new Decimal('31.275350440496059436'),
          usdAmount: new Decimal('31.306625790936555495'),
          usdPrice: new Decimal('1.001'),
          liquidityImpact: 'remove',
        },
      ]);
    });
  });

  describe('TokenExchange', () => {
    const log = {
      address: '0xdc24316b9ae028f1497c275eb9192a3ea0f67022',
      topics: [
        '0x8b3e96f2b889fa771c53c981b40daf005f63f637f1869f707052d15a3dd97140',
        '0x0000000000000000000000002f4d29f3172fe9f7b9c52063ec30272bb265715f',
      ],
      data: '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000029a2241af62c000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000002a707dba0cee0fbb',
      blockNumber: '0xe80647',
      timeStamp: '0x62dd5d23',
      gasPrice: '0x2c8bc41cf',
      gasUsed: '0x1da0f',
      logIndex: '0xe1',
      transactionHash: '0xd2ab17d656f74938b6ebc4e566cdaf39bf55c4d5b51c1868d2eda9a8ff7dee04',
      transactionIndex: '0x9b',
    };

    it('returns the correct transaction type and amounts', async () => {
      const pool = await mockStethPool();
      const { parsedLog } = parseLog({ pool, log });
      console.log(parsedLog);
      expect(parsedLog?.type).toEqual(CurveTransactionType.EXCHANGE);
      expect(parsedLog?.hash).toEqual(
        '0xd2ab17d656f74938b6ebc4e566cdaf39bf55c4d5b51c1868d2eda9a8ff7dee04',
      );
      expect(parsedLog?.timestamp).toEqual(1658674467);
      expect(parsedLog?.totalUsdAmount).toEqual(new Decimal('5179.29'));
      expect(parsedLog?.tokens).toEqual([
        {
          liquidityImpact: 'add',
          symbol: 'ETH',
          tokenAmount: new Decimal('3'),
          usdAmount: new Decimal('5179.29'),
          usdPrice: new Decimal('1726.43'),
        },
        {
          liquidityImpact: 'remove',
          symbol: 'stETH',
          tokenAmount: new Decimal('3.058082385018884027'),
          usdAmount: new Decimal('5143.2970208917104785'),
          usdPrice: new Decimal('1681.87'),
        },
      ]);
    });
  });

  describe('TokenExchangeUnderlying', () => {
    const log = {
      address: '0xd632f22692fac7611d2aa1c0d552930d43caed3b',
      topics: [
        '0xd013ca23e77a65003c2c659c5442c00c805371b7fc1ebd4c206c41d1536bd90b',
        '0x00000000000000000000000000000000c2cf7648c169b25ef1c217864bfa38cc',
      ],
      data: '0x000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000af846c8a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009f9bfa4ca365b07a86',
      blockNumber: '0xe80e75',
      timeStamp: '0x62ddca28',
      gasPrice: '0x19806e3dc',
      gasUsed: '0x72f5e',
      logIndex: '0x209',
      transactionHash: '0xde159aabeda34123c8755eb7509d045cd45073126529ae3c89cd4e2aa7755204',
      transactionIndex: '0xc2',
    };

    it('ignores it for now as it cannot be calculated', async () => {
      const pool = await mockFraxPool();
      const { parsedLog, exchangeUnderlying } = parseLog({ pool, log });
      expect(parsedLog).toBeFalsy();
      expect(exchangeUnderlying).toBe(true);
    });
  });
});
