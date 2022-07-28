import { ethers } from 'ethers';
import { abis } from '../data/abi';
import poolTransactions from '../data/tx/ethereum.0x0Ce6a5fF5217e38315f87032CF90686C96627CAA.json';

const main = async () => {
  const contractAddress = '0x0Ce6a5fF5217e38315f87032CF90686C96627CAA';
  const tx = poolTransactions[0];

  const poolInterface = new ethers.utils.Interface(
    JSON.stringify(abis.ethereum.main[contractAddress]),
  );
  const decodedInput = poolInterface.parseTransaction({ data: tx.input, value: tx.value });

  // Decoded Transaction
  console.log('Decoded:', decodedInput);
};

main();
