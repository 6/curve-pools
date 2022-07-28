import { ethers } from 'ethers';
import { Decimal } from 'decimal.js';
import { getPool } from '../../data/pools';
import { CurveTransactionType, parseTransaction } from './parse-transaction';

describe('parseTransaction', () => {
  describe('remove_liquidity', () => {
    const poolInterface = new ethers.utils.Interface(
      JSON.stringify([
        {
          name: 'remove_liquidity',
          outputs: [],
          inputs: [
            { type: 'uint256', name: '_amount' },
            { type: 'uint256[3]', name: 'min_amounts' },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
          gas: 192846,
        },
      ]),
    );
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
      const pool = await getPool({
        network: 'ethereum',
        poolType: 'main',
        contractAddress: tx.to,
      });
      const { transaction } = parseTransaction({ pool, poolInterface, tx });
      expect(transaction?.type).toEqual(CurveTransactionType.REMOVE_LIQUIDITY);
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
      expect(transaction?.totalAmount).toEqual(new Decimal('11.695987077239375748'));
    });
  });

  describe('remove_liquidity_one_coin', () => {
    const poolInterface = new ethers.utils.Interface(
      JSON.stringify([
        {
          name: 'remove_liquidity_one_coin',
          outputs: [{ type: 'uint256', name: '' }],
          inputs: [
            { type: 'uint256', name: '_token_amount' },
            { type: 'int128', name: 'i' },
            { type: 'uint256', name: '_min_amount' },
            { type: 'bool', name: '_use_underlying' },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ]),
    );
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
      const pool = await getPool({
        network: 'ethereum',
        poolType: 'main',
        contractAddress: tx.to,
      });
      const { transaction } = parseTransaction({ pool, poolInterface, tx });
      expect(transaction?.type).toEqual(CurveTransactionType.REMOVE_LIQUIDITY);
      expect(transaction?.totalAmount).toEqual(new Decimal('2053427.233335429445268871'));
      expect(transaction?.tokens).toEqual([
        {
          address: '0xBcca60bB61934080951369a648Fb03DF4F96263C',
          symbol: 'aUSDC',
          type: 'remove',
        },
      ]);
    });
  });

  describe('remove_liquidity_imbalance', () => {
    const poolInterface = new ethers.utils.Interface(
      JSON.stringify([
        {
          name: 'remove_liquidity_imbalance',
          outputs: [{ type: 'uint256', name: '' }],
          inputs: [
            { type: 'uint256[3]', name: '_amounts' },
            { type: 'uint256', name: '_max_burn_amount' },
            { type: 'bool', name: '_use_underlying' },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ]),
    );
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
      const pool = await getPool({
        network: 'ethereum',
        poolType: 'main',
        contractAddress: tx.to,
      });
      const { transaction } = parseTransaction({ pool, poolInterface, tx });
      expect(transaction?.type).toEqual(CurveTransactionType.REMOVE_LIQUIDITY);
      expect(transaction?.tokens?.length).toEqual(1);
      expect(transaction?.tokens[0]).toEqual({
        address: '0xBcca60bB61934080951369a648Fb03DF4F96263C',
        amount: new Decimal('5000'),
        symbol: 'aUSDC',
        type: 'remove',
      });
      expect(transaction?.totalAmount).toEqual(new Decimal('5000'));
    });
  });

  describe('add_liquidity(uamounts, ...', () => {
    const poolInterface = new ethers.utils.Interface(
      JSON.stringify([
        {
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'add_liquidity',
          inputs: [
            { name: 'amounts', type: 'uint256[3]' },
            { name: 'min_mint_amount', type: 'uint256' },
          ],
          outputs: [],
          gas: 682649,
        },
      ]),
    );
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
      const pool = await getPool({
        network: 'ethereum',
        poolType: 'main',
        contractAddress: tx.to,
      });
      const { transaction } = parseTransaction({ pool, poolInterface, tx });
      expect(transaction?.type).toEqual(CurveTransactionType.ADD_LIQUIDITY);
      expect(transaction?.tokens).toEqual([
        {
          address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          amount: new Decimal('111784.575162'),
          symbol: 'USDT',
          type: 'add',
        },
        {
          address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
          amount: new Decimal('4.4'),
          symbol: 'WBTC',
          type: 'add',
        },
        {
          address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          amount: new Decimal('81.91996236'),
          symbol: 'WETH',
          type: 'add',
        },
      ]);
      // TODO: unknown for now since different types of assets
      expect(transaction?.totalAmount).toBeFalsy();
    });
  });

  describe('add_liquidity(amounts, ...', () => {
    const poolInterface = new ethers.utils.Interface(
      JSON.stringify([
        {
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'add_liquidity',
          inputs: [
            { name: '_amounts', type: 'uint256[2]' },
            { name: '_min_mint_amount', type: 'uint256' },
          ],
          outputs: [{ name: '', type: 'uint256' }],
          gas: 2546841,
        },
      ]),
    );
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
      const pool = await getPool({
        network: 'ethereum',
        poolType: 'main',
        contractAddress: tx.to,
      });
      const { transaction } = parseTransaction({ pool, poolInterface, tx });
      expect(transaction?.type).toEqual(CurveTransactionType.ADD_LIQUIDITY);
      expect(transaction?.tokens).toEqual([
        {
          address: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
          amount: new Decimal('1000000'),
          symbol: 'FRAX',
          type: 'add',
        },
        {
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          amount: new Decimal('1501008.29'),
          symbol: 'USDC',
          type: 'add',
        },
      ]);
      expect(transaction?.totalAmount).toEqual(new Decimal('2501008.29'));
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
  });
});
