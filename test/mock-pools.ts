import { ethers } from 'ethers';
import { CurvePoolExtended } from '../data/pools';
import { CurveAssetTypeName } from '../src/utils/curve.constants';
import triCryptoABI from './fixtures/abi/tricrypto.abi.json';
import linkusdABI from './fixtures/abi/linkusd.abi.json';
import saCrvABI from './fixtures/abi/sacrv.abi.json';
import usdkABI from './fixtures/abi/usdk.abi.json';

export const mockTricryptoPool = async (): Promise<CurvePoolExtended> => {
  const poolInterface = new ethers.utils.Interface(JSON.stringify(triCryptoABI));
  return {
    network: 'ethereum',
    poolType: 'main',
    shortName: 'tricrypto',
    id: '38',
    address: '0x80466c64868E1ab14a1Ddf27A676C3fcBE638Fe5',
    coinsAddresses: [
      '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      '0x0000000000000000000000000000000000000000',
    ],
    decimals: ['6', '8', '18', '0'],
    underlyingDecimals: ['6', '8', '18', '0', '0', '0', '0', '0'],
    assetType: '4',
    totalSupply: '451621967843104580924',
    lpTokenAddress: '0xcA3d75aC011BF5aD07a98d02f18225F9bD9A6BDF',
    name: 'Curve.fi USD-BTC-ETH',
    symbol: 'crvTricrypto',
    priceOracle: 24109.513234518145,
    implementation: '',
    assetTypeName: CurveAssetTypeName.UNKNOWN,
    coins: [
      {
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        usdPrice: 1,
        decimals: '6',
        isBasePoolLpToken: false,
        symbol: 'USDT',
        poolBalance: '163437088467',
      },
      {
        address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        usdPrice: 24486,
        decimals: '8',
        isBasePoolLpToken: false,
        symbol: 'WBTC',
        poolBalance: '651403145',
      },
      {
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        usdPrice: 1726.76,
        decimals: '18',
        isBasePoolLpToken: false,
        symbol: 'WETH',
        poolBalance: '91372112026313601766',
      },
    ],
    usdTotal: 480717.3707142573,
    isMetaPool: false,
    usdTotalExcludingBasePool: 480717.3707142573,
    gaugeAddress: '0x6955a55416a06839309018a8b0cb72c4ddc11f15',
    gauge: undefined,
    constants: undefined,
    interface: poolInterface,
  };
};

export const mockLinkUsdPool = async (): Promise<CurvePoolExtended> => {
  const poolInterface = new ethers.utils.Interface(JSON.stringify(linkusdABI));
  return {
    id: '21',
    address: '0xE7a24EF0C5e95Ffb0f6684b813A78F2a3AD7D171',
    coinsAddresses: [
      '0x0E2EC54fC0B509F445631Bf4b91AB8168230C752',
      '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
      '0x0000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000',
    ],
    decimals: ['18', '18', '0', '0'],
    underlyingDecimals: ['18', '18', '6', '6', '0', '0', '0', '0'],
    assetType: '0',
    totalSupply: 0,
    implementation: '',
    assetTypeName: CurveAssetTypeName.USD,
    coins: [
      {
        address: '0x0E2EC54fC0B509F445631Bf4b91AB8168230C752',
        usdPrice: 0.953506,
        decimals: '18',
        isBasePoolLpToken: false,
        symbol: 'LINKUSD',
        poolBalance: '21407997035838112028416',
      },
      {
        address: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
        usdPrice: 1.022,
        decimals: '18',
        isBasePoolLpToken: true,
        symbol: '3Crv',
        poolBalance: '15131884719521538032067',
      },
    ],
    usdTotal: 35877.43980500486,
    isMetaPool: true,
    usdTotalExcludingBasePool: 20412.65362165385,
    network: 'ethereum',
    poolType: 'main',
    gauge: undefined,
    constants: undefined,
    shortName: 'linkusd',
    interface: poolInterface,
  };
};

export const mockSaCrvPool = async (): Promise<CurvePoolExtended> => {
  const poolInterface = new ethers.utils.Interface(JSON.stringify(saCrvABI));
  return {
    id: '11',
    address: '0xEB16Ae0052ed37f479f7fe63849198Df1765a733',
    coinsAddresses: [
      '0x028171bCA77440897B824Ca71D1c56caC55b68A3',
      '0x6C5024Cd4F8A59110119C56f8933403A539555EB',
      '0x0000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000',
    ],
    decimals: ['18', '18', '0', '0'],
    underlyingDecimals: ['18', '18', '0', '0', '0', '0', '0', '0'],
    assetType: '0',
    totalSupply: '1999266353527782560217953',
    lpTokenAddress: '0x02d341CcB60fAaf662bC0554d13778015d1b285C',
    name: 'Curve.fi aDAI/aSUSD',
    symbol: 'saCRV',
    priceOracle: 0,
    implementation: '',
    assetTypeName: CurveAssetTypeName.USD,
    coins: [
      {
        address: '0x028171bCA77440897B824Ca71D1c56caC55b68A3',
        usdPrice: 1.008,
        decimals: '18',
        isBasePoolLpToken: false,
        symbol: 'aDAI',
        poolBalance: '1325483682495474768359039',
      },
      {
        address: '0x6C5024Cd4F8A59110119C56f8933403A539555EB',
        usdPrice: 1.01,
        decimals: '18',
        isBasePoolLpToken: false,
        symbol: 'aSUSD',
        poolBalance: '821415279702152378343874',
      },
    ],
    usdTotal: 2165716.9844546127,
    isMetaPool: false,
    usdTotalExcludingBasePool: 2165716.9844546127,
    gaugeAddress: '0x462253b8f74b72304c145db0e4eebd326b22ca39',
    network: 'ethereum',
    poolType: 'main',
    gauge: undefined,
    constants: undefined,
    shortName: 'sacrv',
    interface: poolInterface,
  };
};

export const mockUsdkPool = async (): Promise<CurvePoolExtended> => {
  const poolInterface = new ethers.utils.Interface(JSON.stringify(usdkABI));
  return {
    id: '24',
    address: '0x3E01dD8a5E1fb3481F0F589056b428Fc308AF0Fb',
    coinsAddresses: [
      '0x1c48f86ae57291F7686349F12601910BD8D470bb',
      '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
      '0x0000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000',
    ],
    decimals: ['18', '18', '0', '0'],
    underlyingDecimals: ['18', '18', '6', '6', '0', '0', '0', '0'],
    assetType: '0',
    totalSupply: 0,
    implementation: '',
    assetTypeName: CurveAssetTypeName.USD,
    coins: [
      {
        address: '0x1c48f86ae57291F7686349F12601910BD8D470bb',
        usdPrice: 0.998956,
        decimals: '18',
        isBasePoolLpToken: false,
        symbol: 'USDK',
        poolBalance: '168456086308196677504780',
      },
      {
        address: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
        usdPrice: 1.022,
        decimals: '18',
        isBasePoolLpToken: true,
        symbol: '3Crv',
        poolBalance: '112154717432364919218440',
      },
    ],
    usdTotal: 282902.33936996787,
    isMetaPool: true,
    usdTotalExcludingBasePool: 168280.21815409092,
    gaugeAddress: '0xc2b1df84112619d190193e48148000e3990bf627',
    network: 'ethereum',
    poolType: 'main',
    gauge: undefined,
    constants: undefined,
    shortName: 'sacrv',
    interface: poolInterface,
  };
};
