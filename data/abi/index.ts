// todo: is there a better way?
import ethereumMain from './ethereum.main.json';
import ethereumCrypto from './ethereum.crypto.json';
import ethereumFactory from './ethereum.factory.json';
import arbitrumMain from './arbitrum.main.json';
import arbitrumCrypto from './arbitrum.crypto.json';
import arbitrumFactory from './arbitrum.factory.json';
import optimismMain from './optimism.main.json';
import optimismCrypto from './optimism.crypto.json';
import optimismFactory from './optimism.factory.json';

export const abis = {
  ethereum: {
    main: ethereumMain,
    crypto: ethereumCrypto,
    factory: ethereumFactory,
  },
  arbitrum: {
    main: arbitrumMain,
    crypto: arbitrumCrypto,
    factory: arbitrumFactory,
  },
  optimism: {
    main: optimismMain,
    crypto: optimismCrypto,
    factory: optimismFactory,
  },
};
