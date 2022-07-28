import { ethers } from 'ethers';
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
          decimals: 18,
          symbol: 'DAI',
        },
        {
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 6,
          symbol: 'USDC',
        },
        {
          address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 6,
          symbol: 'USDT',
        },
      ]);
      expect(transaction?.totalAmount.formatted).toEqual('11.695987077239375748');
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
      expect(transaction?.totalAmount?.formatted).toEqual('2053427.233335429445268871');
      expect(transaction?.tokens).toEqual([
        {
          address: '0xBcca60bB61934080951369a648Fb03DF4F96263C',
          decimals: 6,
          symbol: 'aUSDC',
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
      expect(transaction?.tokens[0]).toMatchObject({
        address: '0xBcca60bB61934080951369a648Fb03DF4F96263C',
        amount: {
          formatted: '5000.0',
        },
        decimals: 6,
        symbol: 'aUSDC',
      });
      expect(transaction?.totalAmount.formatted).toEqual('0.0'); // TODO
    });
  });
});
