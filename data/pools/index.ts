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

export const pools = {
  ethereum: {
    main: ethereumMain.data,
    crypto: ethereumCrypto.data,
    factory: ethereumFactory.data,
  },
  arbitrum: {
    main: arbitrumMain.data,
    crypto: arbitrumCrypto.data,
    factory: arbitrumFactory.data,
  },
  optimism: {
    main: optimismMain.data,
    crypto: optimismCrypto.data,
    factory: optimismFactory.data,
  },
};
