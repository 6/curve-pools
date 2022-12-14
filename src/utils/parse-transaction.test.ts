import { Decimal } from 'decimal.js';
import {
  mock3Pool,
  mockAavePool,
  mockCrvFraxPool,
  mockFraxPool,
  mockHbtcPool,
  mockLinkUsdPool,
  mockOp3pool,
  mockSaCrvPool,
  mockTricryptoPool,
  mockTusdPool,
  mockUsdkPool,
  mockUsdpPool,
} from '../../test/mock-pools';
import { CurveTransactionType, parseTransaction } from './parse-transaction';

describe('parseTransaction', () => {
  describe('remove_liquidity (_amount, ...', () => {
    // Removes liquidity in all coins relative to current balance
    const tx = {
      blockNumber: '15223674',
      timeStamp: '1658913590',
      hash: '0x2b15a24c260bc1e4cd11253d5a43c1da56881d4249d3349ddcb8546baf1a1b04',
      nonce: '349',
      blockHash: '0xc944ac4a59b5df2309cb8519406f214edd699e4590d2657db218ac3914a3f47b',
      transactionIndex: '208',
      from: '0xee78e40f73e9a9e71ae5068a053a5a4f3401d031',
      to: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
      value: '0',
      gas: '283688',
      gasPrice: '5000000000',
      isError: '0',
      txreceipt_status: '1',
      input:
        '0xecb586a5000000000000000000000000000000000000000000000000a2507e475c6987840000000000000000000000000000000000000000000000003a34887001c6bce7000000000000000000000000000000000000000000000000000000000037a2af00000000000000000000000000000000000000000000000000000000003b13c0',
      contractAddress: '',
      cumulativeGasUsed: '16113674',
      gasUsed: '175733',
      confirmations: '8323',
      methodId: '0xecb586a5',
      functionName: 'remove_liquidity(uint256 _amount, uint256[3] min_uamounts)',
    };

    it('returns the correct transaction type and amounts', async () => {
      const pool = await mock3Pool();
      const { transaction } = parseTransaction({ pool, tx });
      expect(transaction?.type).toEqual(CurveTransactionType.REMOVE_LIQUIDITY);
      expect(transaction?.hash).toEqual(
        '0x2b15a24c260bc1e4cd11253d5a43c1da56881d4249d3349ddcb8546baf1a1b04',
      );
      expect(transaction?.pool).toEqual('0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7');
      expect(transaction?.timestamp).toEqual(1658913590);
      expect(transaction?.tokens).toEqual([
        {
          address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          symbol: 'DAI',
          type: 'remove',
        },
        {
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          symbol: 'USDC',
          type: 'remove',
        },
        {
          address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          symbol: 'USDT',
          type: 'remove',
        },
      ]);
      expect(transaction?.totalUsdAmount).toEqual(new Decimal('11.695987077239375748'));
    });
  });

  describe('remove_liquidity(_burn_amount, ...', () => {
    const tx = {
      blockNumber: '15207441',
      timeStamp: '1658694277',
      hash: '0x0e26d6ed63327bb904cdebcc85bc252a62c94c56d29f7d608c60e59a194d2eee',
      nonce: '24',
      blockHash: '0xb9d285b8ee7fca89364c7a6d0c085262da817f16edd764ffe528ca761aeb6f61',
      transactionIndex: '78',
      from: '0x63b9b9baae0c1e122f9988c14ca37f9a44dcc120',
      to: '0xd632f22692fac7611d2aa1c0d552930d43caed3b',
      value: '0',
      gas: '154341',
      gasPrice: '12000000000',
      isError: '0',
      txreceipt_status: '1',
      input:
        '0x5b36389c00000000000000000000000000000000000000000000001cc29e1b7ae3bad93e000000000000000000000000000000000000000000000011358e092bdfa125b700000000000000000000000000000000000000000000000b411264741f44c398',
      contractAddress: '',
      cumulativeGasUsed: '6936235',
      gasUsed: '125443',
      confirmations: '26890',
      methodId: '0x5b36389c',
      functionName: 'remove_liquidity(uint256 _amount, uint256[2] min_amounts)',
    };

    it('returns the correct transaction type and amounts', async () => {
      const pool = await mockFraxPool();
      const { transaction } = parseTransaction({ pool, tx });
      expect(transaction?.type).toEqual(CurveTransactionType.REMOVE_LIQUIDITY);
      expect(transaction?.tokens).toEqual([
        {
          address: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
          symbol: 'FRAX',
          type: 'remove',
        },
        {
          address: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
          symbol: '3Crv',
          type: 'remove',
        },
      ]);
      expect(transaction?.totalUsdAmount).toEqual(new Decimal('530.532510568166381886'));
    });
  });

  describe('remove_liquidity_one_coin(_token_amount, ...', () => {
    const tx = {
      blockNumber: '14837143',
      timeStamp: '1653415336',
      hash: '0x34b34b641184e1252ba826bd7bc5c6f6d0d8f9b931c1ccf09394c7fdae64870c',
      nonce: '41',
      blockHash: '0x114fd1b5234fd707f73dc7e124ad9690186e2d1d2e94aa6cbd32349c4a6a98a8',
      transactionIndex: '31',
      from: '0xa14b5a062f7a11c258f49c75a5d396ba77d50364',
      to: '0xdebf20617708857ebe4f679508e7b7863a8a8eee',
      value: '0',
      gas: '517348',
      gasPrice: '44023024058',
      isError: '0',
      txreceipt_status: '1',
      input:
        '0x517a55a300000000000000000000000000000000000000000001b2d4836c4ad0c68535870000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000002086bd272c10000000000000000000000000000000000000000000000000000000000000000',
      contractAddress: '',
      cumulativeGasUsed: '2957648',
      gasUsed: '341362',
      confirmations: '394855',
      methodId: '0x517a55a3',
      functionName:
        'remove_liquidity_one_coin(uint256 _token_amount, int128 i, uint256 min_uamount, bool donate_dust)',
    };

    it('returns the correct transaction type and amounts', async () => {
      const pool = await mockAavePool();
      const { transaction } = parseTransaction({ pool, tx });
      expect(transaction?.type).toEqual(CurveTransactionType.REMOVE_LIQUIDITY);
      expect(transaction?.totalUsdAmount).toEqual(expect.any(Decimal));
      expect(transaction?.tokens).toEqual([
        {
          address: '0xBcca60bB61934080951369a648Fb03DF4F96263C',
          symbol: 'aUSDC',
          tokenAmount: new Decimal('2053427.233335429445268871'),
          usdAmount: expect.any(Decimal),
          type: 'remove',
        },
      ]);
    });
  });

  describe('remove_liquidity_one_coin(_burn_amount, ...', () => {
    const tx = {
      blockNumber: '14515268',
      timeStamp: '1649017499',
      hash: '0x9676b138a0eebd0426bf9a48b3e69b0991b73dc71bd6189647b219275d6dc56b',
      nonce: '344',
      blockHash: '0x003ce1c9d2b1dc73de0ee809a4c954cfe3a12b7665ce0d468cf8768c04870aee',
      transactionIndex: '173',
      from: '0x678783721b49a5d079f4aadf12c91049ebf7b3c1',
      to: '0xecd5e75afb02efa118af914515d6521aabd189f1',
      value: '0',
      gas: '252666',
      gasPrice: '62164688089',
      isError: '0',
      txreceipt_status: '1',
      input:
        '0x1a4d01d200000000000000000000000000000000000000000000069aa2b2506448096ab5000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000067ca1390b09425b36be',
      contractAddress: '',
      cumulativeGasUsed: '18391928',
      gasUsed: '151168',
      confirmations: '719062',
      methodId: '0x1a4d01d2',
      functionName:
        'remove_liquidity_one_coin(uint256 _token_amount, int128 i, uint256 _min_amount)',
    };

    it('returns the correct transaction type and amounts', async () => {
      const pool = await mockTusdPool();
      const { transaction } = parseTransaction({ pool, tx });
      expect(transaction?.type).toEqual(CurveTransactionType.REMOVE_LIQUIDITY);
      expect(transaction?.totalUsdAmount).toEqual(expect.any(Decimal));
      expect(transaction?.tokens).toEqual([
        {
          address: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
          tokenAmount: new Decimal('31186.721005740776581813'),
          usdAmount: expect.any(Decimal),
          symbol: '3Crv',
          type: 'remove',
        },
      ]);
    });
  });

  describe('remove_liquidity_imbalance(_amounts, ...', () => {
    const tx = {
      blockNumber: '14134496',
      timeStamp: '1643910993',
      hash: '0xbf957a235527edb5072ac9e9cdb9cc2c8107159558b16744fb610a5b26e664cd',
      nonce: '393',
      blockHash: '0x57f65a5aaabfbb080d3e04ee98fef8d57e43ac1906fc5bc1a05d4263d409cb9a',
      transactionIndex: '189',
      from: '0xa1992346630fa9539bc31438a8981c646c6698f1',
      to: '0xdebf20617708857ebe4f679508e7b7863a8a8eee',
      value: '0',
      gas: '641742',
      gasPrice: '97227378907',
      isError: '0',
      txreceipt_status: '1',
      input:
        '0x5b8369f50000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000012a05f20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fa9e2f1b4535ef7e600000000000000000000000000000000000000000000000000000000000000001',
      contractAddress: '',
      cumulativeGasUsed: '26842860',
      gasUsed: '434564',
      confirmations: '1097028',
      methodId: '0x5b8369f5',
      functionName:
        'remove_liquidity_imbalance(uint256[3] _amounts, uint256 _max_burn_amount, bool _use_underlying)',
    };

    it('returns the correct transaction type and amounts', async () => {
      const pool = await mockAavePool();
      const { transaction } = parseTransaction({ pool, tx });
      expect(transaction?.type).toEqual(CurveTransactionType.REMOVE_LIQUIDITY);
      expect(transaction?.tokens?.length).toEqual(1);
      expect(transaction?.tokens).toEqual([
        {
          address: '0xBcca60bB61934080951369a648Fb03DF4F96263C',
          tokenAmount: new Decimal('5000'),
          usdAmount: expect.any(Decimal),
          symbol: 'aUSDC',
          type: 'remove',
        },
      ]);
      expect(transaction?.totalUsdAmount).toEqual(expect.any(Decimal));
    });
  });

  describe('remove_liquidity_imbalance(amounts, ...', () => {
    const tx = {
      blockNumber: '11372473',
      timeStamp: '1606904621',
      hash: '0xb1546160c091bfd873826708032393ab09ee6dcd5fb32f3cc4ee1a6bf89649c2',
      nonce: '474',
      blockHash: '0xb5253f1b376a43075d1870338d641831d0b589e0d4f054c7e5306e54306edc8e',
      transactionIndex: '115',
      from: '0xfe8c25d07fc1990ee581bb5881da88bedeeae473',
      to: '0x3e01dd8a5e1fb3481f0f589056b428fc308af0fb',
      value: '0',
      gas: '1200000',
      gasPrice: '22000000000',
      isError: '0',
      txreceipt_status: '1',
      input:
        '0xe310327300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005621e118ba311c37b800000000000000000000000000000000000000000000002f196ebc4fb48c0ed40',
      contractAddress: '',
      cumulativeGasUsed: '8969222',
      gasUsed: '150087',
      confirmations: '3861857',
      methodId: '0xe3103273',
      functionName: 'remove_liquidity_imbalance(uint256[2] amounts, uint256 max_burn_amount)',
    };

    it('returns the correct transaction type and amounts', async () => {
      const pool = await mockUsdkPool();
      const { transaction } = parseTransaction({ pool, tx });
      expect(transaction?.type).toEqual(CurveTransactionType.REMOVE_LIQUIDITY);
      expect(transaction?.tokens?.length).toEqual(1);
      expect(transaction?.tokens[0]).toEqual({
        address: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
        tokenAmount: new Decimal('25421.779999999998'),
        usdAmount: expect.any(Decimal),
        symbol: '3Crv',
        type: 'remove',
      });
      expect(transaction?.totalUsdAmount).toEqual(expect.any(Decimal));
    });
  });

  describe('add_liquidity(uamounts, ...', () => {
    const tx = {
      blockNumber: '15128484',
      timeStamp: '1657637679',
      hash: '0x37f2a75c19af9147827b4198131d742d78bf659172a63b8c33f180d642733aaf',
      nonce: '5801',
      blockHash: '0xf4d4172b2362a8bea10a875cd34ad30e91c64d1c07c9239c902d5542761fcf04',
      transactionIndex: '45',
      from: '0xfdbbfb0fe2986672af97eca0e797d76a0bbf35c9',
      to: '0x80466c64868e1ab14a1ddf27a676c3fcbe638fe5',
      value: '0',
      gas: '762513',
      gasPrice: '28939994707',
      isError: '0',
      txreceipt_status: '1',
      input:
        '0x4515cef30000000000000000000000000000000000000000000000000000001a06e140ba000000000000000000000000000000000000000000000000000000001a39de0000000000000000000000000000000000000000000000000470de2bbc612bb00000000000000000000000000000000000000000000000001222143e16f86a3ad2',
      contractAddress: '',
      cumulativeGasUsed: '3138397',
      gasUsed: '512298',
      confirmations: '103520',
      methodId: '0x4515cef3',
      functionName: 'add_liquidity(uint256[3] uamounts, uint256 min_mint_amount)',
    };

    it('returns the correct transaction type and amounts', async () => {
      const pool = await mockTricryptoPool();
      const { transaction } = parseTransaction({ pool, tx });
      expect(transaction?.type).toEqual(CurveTransactionType.ADD_LIQUIDITY);
      expect(transaction?.hash).toEqual(
        '0x37f2a75c19af9147827b4198131d742d78bf659172a63b8c33f180d642733aaf',
      );
      expect(transaction?.pool).toEqual('0x80466c64868E1ab14a1Ddf27A676C3fcBE638Fe5');
      expect(transaction?.timestamp).toEqual(1657637679);
      expect(transaction?.tokens).toEqual([
        {
          address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          tokenAmount: new Decimal('111784.575162'),
          usdAmount: expect.any(Decimal),
          symbol: 'USDT',
          type: 'add',
        },
        {
          address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
          tokenAmount: new Decimal('4.4'),
          usdAmount: expect.any(Decimal),

          symbol: 'WBTC',
          type: 'add',
        },
        {
          address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          tokenAmount: new Decimal('81.91996236'),
          usdAmount: expect.any(Decimal),
          symbol: 'WETH',
          type: 'add',
        },
      ]);
      expect(transaction?.totalUsdAmount).toEqual(expect.any(Decimal));
    });
  });

  describe('add_liquidity(amounts, ...', () => {
    const tx = {
      blockNumber: '15183044',
      timeStamp: '1658367588',
      hash: '0x6bb77197c5a527ed8f614a3d701f32e64d242fcd9455bf15457a4d1f43254169',
      nonce: '2032',
      blockHash: '0xb9cec5a59cddbd8841e67bfe80e5bdfb5713cf26cfada80bd6de23ab70c97374',
      transactionIndex: '352',
      from: '0x38d0dbecda3b81faa65cdce0cae4c4db30dec786',
      to: '0xdcef968d416a41cdac0ed8702fac8128a64241a2',
      value: '0',
      gas: '266126',
      gasPrice: '11320532789',
      isError: '0',
      txreceipt_status: '1',
      input:
        '0x0b4c7e4d00000000000000000000000000000000000000000000d3c21bcecceda10000000000000000000000000000000000000000000000000000000000015d7b10e0d000000000000000000000000000000000000000000002112a80654ed71cf95bea',
      contractAddress: '',
      cumulativeGasUsed: '23798384',
      gasUsed: '167989',
      confirmations: '48960',
      methodId: '0x0b4c7e4d',
      functionName: 'add_liquidity(uint256[2] amounts, uint256 min_mint_amount)',
    };

    it('returns the correct transaction type and amounts', async () => {
      const pool = await mockCrvFraxPool();
      const { transaction } = parseTransaction({ pool, tx });
      expect(transaction?.type).toEqual(CurveTransactionType.ADD_LIQUIDITY);
      expect(transaction?.tokens).toEqual([
        {
          address: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
          tokenAmount: new Decimal('1000000'),
          usdAmount: expect.any(Decimal),
          symbol: 'FRAX',
          type: 'add',
        },
        {
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          tokenAmount: new Decimal('1501008.29'),
          usdAmount: expect.any(Decimal),
          symbol: 'USDC',
          type: 'add',
        },
      ]);
      expect(transaction?.totalUsdAmount).toEqual(expect.any(Decimal));
    });
  });

  describe('add_liquidity(_amounts, ...', () => {
    const tx = {
      blockNumber: '15182271',
      timeStamp: '1658357301',
      hash: '0x45d9f84df8a29337a72d0941c4a82500566edff61e9bc9fe90130d448d002061',
      nonce: '91',
      blockHash: '0xdcc3bad73a79bc41f8db3f35c361d0ec6a4a9cfea4828ca1018403c99c2309ca',
      transactionIndex: '108',
      from: '0xbaea24e991f0723f845a08d3e299dd6f739285ef',
      to: '0xeb16ae0052ed37f479f7fe63849198df1765a733',
      value: '0',
      gas: '551585',
      gasPrice: '17286170348',
      isError: '0',
      txreceipt_status: '1',
      input:
        '0xee22be230000000000000000000000000000000000000000000000042a5e84e25d0400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003d45b17d720f42ffe0000000000000000000000000000000000000000000000000000000000000001',
      contractAddress: '',
      cumulativeGasUsed: '8470382',
      gasUsed: '351994',
      confirmations: '49728',
      methodId: '0xee22be23',
      functionName:
        'add_liquidity(uint256[2] _amounts, uint256 _min_mint_amount, bool _use_underlying)',
    };

    it('returns the correct transaction type and amounts', async () => {
      const pool = await mockSaCrvPool();
      const { transaction } = parseTransaction({ pool, tx });
      expect(transaction?.type).toEqual(CurveTransactionType.ADD_LIQUIDITY);
      expect(transaction?.tokens).toEqual([
        {
          address: '0x028171bCA77440897B824Ca71D1c56caC55b68A3',
          tokenAmount: new Decimal('76.84'),
          usdAmount: expect.any(Decimal),
          symbol: 'aDAI',
          type: 'add',
        },
      ]);
      expect(transaction?.totalUsdAmount).toEqual(expect.any(Decimal));
    });
  });

  describe('[optimism] add_liquidity', () => {
    const tx = {
      blockNumber: '16030361',
      timeStamp: '1658928411',
      hash: '0x41dd5c5fa60a67f5dd2d57cf88ddddd555d857bd2902f0f07e75b96e4e58431c',
      nonce: '66',
      blockHash: '0x547c64d1171daf381ad99dd5233d9015dcbe9e34b11fc84af1cb57809e66c394',
      transactionIndex: '0',
      from: '0xc693567e1dbb9929c8d9d6ed2714a7e742af3e90',
      to: '0x1337bedc9d22ecbe766df105c9623922a27963ec',
      value: '0',
      gas: '208753',
      gasPrice: '1000000',
      isError: '0',
      txreceipt_status: '1',
      input:
        '0x4515cef30000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000186a0000000000000000000000000000000000000000000000000015b10e5cecded53',
      contractAddress: '',
      cumulativeGasUsed: '127008',
      gasUsed: '127008',
      confirmations: '340228',
    };

    it('returns the correct transaction type and amounts', async () => {
      const pool = await mockOp3pool();
      const { transaction } = parseTransaction({ pool, tx });
      expect(transaction?.type).toEqual(CurveTransactionType.ADD_LIQUIDITY);
      expect(transaction?.tokens).toEqual([
        {
          address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
          tokenAmount: new Decimal('0.1'),
          usdAmount: expect.any(Decimal),
          symbol: 'USDT',
          type: 'add',
        },
      ]);
      expect(transaction?.totalUsdAmount).toEqual(expect.any(Decimal));
    });
  });

  describe('exchange_underlying', () => {
    const tx = {
      blockNumber: '15160061',
      timeStamp: '1658059498',
      hash: '0xffbb71c5a857e32f36ac3cdf51e9df66527367daaba991783d0d6356284d6ca2',
      nonce: '9',
      blockHash: '0x3962c956aed50508dad1e139a5f23547fb1c91acf44d1e648bbc52de3c58eb0d',
      transactionIndex: '165',
      from: '0x77212a17cb8559866bb709460dc79f42d93d7167',
      to: '0xdebf20617708857ebe4f679508e7b7863a8a8eee',
      value: '0',
      gas: '788227',
      gasPrice: '9743915074',
      isError: '0',
      txreceipt_status: '1',
      input:
        '0xa6417ed600000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000d18b959180000000000000000000000000000000000000000000000000000000d15a7138c0',
      contractAddress: '',
      cumulativeGasUsed: '14158719',
      gasUsed: '515309',
      confirmations: '74269',
      methodId: '0xa6417ed6',
      functionName: 'exchange_underlying(int128 i, int128 j, uint256 dx, uint256 min_dy)',
    };

    it('returns the correct transaction type and amounts', async () => {
      const pool = await mockAavePool();
      const { decodedInput, transaction } = parseTransaction({ pool, tx });
      expect(transaction).toBeFalsy();
      expect(decodedInput).toBeTruthy();
    });
    // TODO: need to add better support
    // it('returns the correct transaction type and amounts', async () => {
    //   const pool = await getPool({
    //     network: 'ethereum',
    //     poolType: 'main',
    //     contractAddress: tx.to,
    //   });
    //   const { transaction } = parseTransaction({ pool, tx });
    //   expect(transaction?.type).toEqual(CurveTransactionType.EXCHANGE);
    //   expect(transaction?.tokens).toEqual([
    //     {
    //       address: '0xBcca60bB61934080951369a648Fb03DF4F96263C',
    //       amount: new Decimal('899990'),
    //       symbol: 'aUSDC',
    //       type: 'add',
    //     },
    //     {
    //       address: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
    //       symbol: 'aUSDT',
    //       type: 'remove',
    //     },
    //   ]);
    //   expect(transaction?.totalUsdAmount).toEqual(new Decimal('899990'));
    // });
  });

  describe('exchange(i, j, dx)', () => {
    const tx = {
      blockNumber: '15234268',
      timeStamp: '1659055417',
      hash: '0x7ee2f4758ad066b5f350dc53b1289b09622f0a12807fa01417fedfdb8756a555',
      nonce: '271',
      blockHash: '0xe19c3b9c6186e4370d0d1996cd1748d7a006b7513469fbea243fcf331a7d5677',
      transactionIndex: '24',
      from: '0xca10ceb443a4a3c0c3504377045969093232d7f1',
      to: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
      value: '0',
      gas: '218980',
      gasPrice: '12000000000',
      isError: '0',
      txreceipt_status: '1',
      input:
        '0x3df02124000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000001c0382fb800000000000000000000000000000000000000000000000000000001bfa3948bd',
      contractAddress: '',
      cumulativeGasUsed: '2328377',
      gasUsed: '160382',
      confirmations: '62',
      methodId: '0x3df02124',
      functionName: 'exchange(int128 i, int128 j, uint256 dx, uint256 min_dy)',
    };

    it('returns the correct transaction type and amounts', async () => {
      const pool = await mock3Pool();
      const { transaction } = parseTransaction({ pool, tx });
      expect(transaction?.type).toEqual(CurveTransactionType.EXCHANGE);
      expect(transaction?.hash).toEqual(
        '0x7ee2f4758ad066b5f350dc53b1289b09622f0a12807fa01417fedfdb8756a555',
      );
      expect(transaction?.pool).toEqual('0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7');
      expect(transaction?.timestamp).toEqual(1659055417);
      expect(transaction?.tokens).toEqual([
        {
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          tokenAmount: new Decimal('120318'),
          usdAmount: expect.any(Decimal),
          symbol: 'USDC',
          type: 'add',
        },
        {
          address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          symbol: 'USDT',
          type: 'remove',
        },
      ]);
      expect(transaction?.totalUsdAmount).toEqual(expect.any(Decimal));
    });
  });

  describe('exchange(i, j, _dx)', () => {
    const tx = {
      blockNumber: '14996133',
      timeStamp: '1655721971',
      hash: '0x91d35ae136b9936453b4bf19c47a98e3e21510836fd8243c846771face73945b',
      nonce: '3238',
      blockHash: '0xbdffc087cacc12db49df7442ebe027e62c5224e79215274c87aede6b8cc2cf8d',
      transactionIndex: '212',
      from: '0x7a16ff8270133f063aab6c9977183d9e72835428',
      to: '0x42d7025938bec20b69cbae5a77421082407f053a',
      value: '0',
      gas: '245016',
      gasPrice: '25819631445',
      isError: '0',
      txreceipt_status: '1',
      input:
        '0x3df0212400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000004bf3a6b51f6d1344b000000000000000000000000000000000000000000000004b46fd610a916c3ad',
      contractAddress: '',
      cumulativeGasUsed: '20709101',
      gasUsed: '161579',
      confirmations: '238197',
      methodId: '0x3df02124',
      functionName: 'exchange(int128 i, int128 j, uint256 dx, uint256 min_dy)',
    };

    it('returns the correct transaction type and amounts', async () => {
      const pool = await mockUsdpPool();
      const { transaction } = parseTransaction({ pool, tx });
      expect(transaction?.type).toEqual(CurveTransactionType.EXCHANGE);
      expect(transaction?.hash).toEqual(
        '0x91d35ae136b9936453b4bf19c47a98e3e21510836fd8243c846771face73945b',
      );
      expect(transaction?.pool).toEqual('0x42d7025938bEc20B69cBae5A77421082407f053A');
      expect(transaction?.timestamp).toEqual(1655721971);
      expect(transaction?.tokens).toEqual([
        {
          address: '0x1456688345527bE1f37E9e627DA0837D6f08C925',
          tokenAmount: new Decimal('87.566420304509088843'),
          usdAmount: expect.any(Decimal),
          symbol: 'USDP',
          type: 'add',
        },
        {
          address: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
          symbol: '3Crv',
          type: 'remove',
        },
      ]);
      expect(transaction?.totalUsdAmount).toEqual(expect.any(Decimal));
    });
  });

  describe('deploy contract tx', () => {
    const tx = {
      blockNumber: '11011556',
      timeStamp: '1602113863',
      hash: '0xcd73c2fcb3e279c0e555b09ce24ec49d7a49ff7a1a0a9eefb8bf90e837faa8df',
      nonce: '20',
      blockHash: '0x3f76c2fc579508c0d792f4c257da62674269a10bd21d1cdec9c0ba02117f984f',
      transactionIndex: '69',
      from: '0x7eeac6cddbd1d0b8af061742d41877d7f707289a',
      to: '',
      value: '0',
      gas: '6103552',
      gasPrice: '50000000000',
      isError: '0',
      txreceipt_status: '1',
      input:
        '0x6f7fffffffffffffffffffffffffffffff6040527fffffffffffffffffffffffffffffffff8000000000000000000000000000000060605261010061601261014039602061601260c03960c05160a01c1561005957600080fd5b602060206160120160c03960c05160a01c1561007457600080fd5b602060406160120160c', // much longer..
      contractAddress: '0xe7a24ef0c5e95ffb0f6684b813a78f2a3ad7d171',
      cumulativeGasUsed: '11021777',
      gasUsed: '5548684',
      confirmations: '4222774',
      methodId: '0x6f7fffff',
      functionName: '',
    };

    it('returns the correct transaction type and amounts', async () => {
      const pool = await mockLinkUsdPool();
      const { decodedInput, transaction } = parseTransaction({ pool, tx });
      expect(transaction).toBeFalsy();
      expect(decodedInput).toBeFalsy();
    });
  });

  describe('invalid function call / fail', () => {
    const tx = {
      blockNumber: '15049516',
      timeStamp: '1656578558',
      hash: '0xaf997ae805e9429cef39403f737789006840a2181919ae01a8cb162fe0e1004f',
      nonce: '6',
      blockHash: '0xdbb95299ddbc6a4744d1e57dbf74fbac3deef24a1044bff0a8dfc897636f0c23',
      transactionIndex: '51',
      from: '0x8279c4312a3803065106afab1b8a04add4a8d468',
      to: '0x4ca9b3063ec5866a4b82e437059d2c43d1be596f',
      value: '0',
      gas: '21000',
      gasPrice: '37000000000',
      isError: '1',
      txreceipt_status: '0',
      input: '0x',
      contractAddress: '',
      cumulativeGasUsed: '4779069',
      gasUsed: '21000',
      confirmations: '184814',
      methodId: '0x',
      functionName: '',
    };

    it('returns the correct transaction type and amounts', async () => {
      const pool = await mockHbtcPool();
      const { decodedInput, transaction } = parseTransaction({ pool, tx });
      expect(transaction).toBeFalsy();
      expect(decodedInput).toBeFalsy();
    });
  });

  describe('current ABI no longer matches historical function call', () => {
    const tx = {
      blockNumber: '15126527',
      timeStamp: '1657610795',
      hash: '0x1e89c5c42ff65cf1db02814794746827d3f8f0de00775058e81dccff4201f023',
      nonce: '63',
      blockHash: '0x0019f8cbd2ccf223d9c93e07f19a1547bfd2ae41dee1cd7cfdf76f7397cdc83f',
      transactionIndex: '12',
      from: '0x0d1396e69326d53798299d8e0af5b89a08629b6e',
      to: '0x80466c64868e1ab14a1ddf27a676c3fcbe638fe5',
      value: '0',
      gas: '33104',
      gasPrice: '19990000000',
      isError: '0',
      txreceipt_status: '1',
      input:
        '0x095ea7b30000000000000000000000000d1396e69326d53798299d8e0af5b89a08629b6e0000000000000000000000000000000000000000000000056bc75e2d63100000',
      contractAddress: '',
      cumulativeGasUsed: '1987296',
      gasUsed: '23346',
      confirmations: '107804',
      methodId: '0x095ea7b3',
      functionName: 'approve(address _spender, uint256 _value)',
    };

    it('returns the correct transaction type and amounts', async () => {
      const pool = await mockTricryptoPool();
      const { decodedInput, transaction } = parseTransaction({ pool, tx });
      expect(transaction).toBeFalsy();
      expect(decodedInput).toBeFalsy();
    });
  });
});
