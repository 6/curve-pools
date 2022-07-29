import { ethers } from 'ethers';
import { getPool } from '../data/pools';
import { getTxs } from '../data/txs';

const main = async () => {
  const network = 'ethereum';
  const poolType = 'main';
  const contractAddress = '0x0Ce6a5fF5217e38315f87032CF90686C96627CAA';

  const txs = await getTxs({ network, poolType, contractAddress });
  const pool = await getPool({ network, poolType, contractAddress });
  const tx = txs[0];

  const decodedInput = pool.interface.parseTransaction({ data: tx.input, value: tx.value });

  // Decoded Transaction
  console.log('Decoded:', tx.hash, decodedInput);

  console.log('token amount:', ethers.utils.formatUnits(decodedInput.args._token_amount, 18));

  // console.log('fn frag:', decodedInput.functionFragment.inputs);
};

main();
