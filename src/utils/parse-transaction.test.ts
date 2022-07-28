import { ethers } from 'ethers';
import { CurveTransactionType, parseTransaction } from './parse-transaction';

describe('parseTransaction', () => {
  describe('remove_liquidity_imbalance', () => {
    const poolInterface = new ethers.utils.Interface(
      JSON.stringify([
        {
          name: 'remove_liquidity_imbalance',
          outputs: [{ type: 'uint256', name: '' }],
          inputs: [
            { type: 'uint256[3]', name: '_amounts' },
            { type: 'uint256', name: '_max_burn_amount' },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
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

    it('returns the correct transactionType', () => {
      const { transactionType } = parseTransaction({ poolInterface, tx });
      expect(transactionType).toEqual(CurveTransactionType.REMOVE_LIQUIDITY);
    });
  });
});
