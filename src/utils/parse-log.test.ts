import { Decimal } from 'decimal.js';
import { mockStethPool } from '../../test/mock-pools';
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
});
