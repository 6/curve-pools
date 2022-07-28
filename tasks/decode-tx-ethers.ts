import { ethers } from 'ethers';
import poolABI from '../data/abi/ethereum.0x0Ce6a5fF5217e38315f87032CF90686C96627CAA.json';
import poolTransactions from '../data/tx/ethereum.0x0Ce6a5fF5217e38315f87032CF90686C96627CAA.json';

const main = async () => {
  const tx = poolTransactions[0];

  const poolInterface = new ethers.utils.Interface(JSON.stringify(poolABI));
  const decodedInput = poolInterface.parseTransaction({ data: tx.input, value: tx.value });

  // Decoded Transaction
  console.log('Decoded:', decodedInput);
};

main();
