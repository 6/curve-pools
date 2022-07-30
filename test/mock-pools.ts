import { ethers } from 'ethers';
import { CurvePoolExtended } from '../data/pools';
import { CurvePoolMetadata } from '../src/utils/curve-api';
import { CurveAssetTypeName } from '../src/utils/curve.constants';
import triCryptoABI from './fixtures/abi/tricrypto.abi.json';
import linkusdABI from './fixtures/abi/linkusd.abi.json';
import saCrvABI from './fixtures/abi/sacrv.abi.json';
import usdkABI from './fixtures/abi/usdk.abi.json';
import hbtcABI from './fixtures/abi/hbtc.abi.json';
import threePoolABI from './fixtures/abi/3pool.abi.json';
import usdpABI from './fixtures/abi/usdp.abi.json';
import fraxABI from './fixtures/abi/frax.abi.json';
import aaveABI from './fixtures/abi/aave.abi.json';
import tusdABI from './fixtures/abi/tusd.abi.json';
import crvFraxABI from './fixtures/abi/crvfrax.abi.json';
import op3poolABI from './fixtures/abi/op3pool.abi.json';

const extendRawPoolData = (
  abi: Array<any>,
  pool: CurvePoolMetadata,
  overrides: Partial<CurvePoolExtended> = {},
): CurvePoolExtended => {
  const poolInterface = new ethers.utils.Interface(JSON.stringify(abi));
  return {
    ...pool,
    network: 'ethereum',
    poolType: 'main',
    gauge: undefined,
    constants: undefined,
    shortName: 'mock-pool',
    interface: poolInterface,
    ...overrides,
  };
};

export const mock3Pool = async (): Promise<CurvePoolExtended> => {
  return extendRawPoolData(threePoolABI, {
    id: '0',
    address: '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7',
    coinsAddresses: [
      '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      '0x0000000000000000000000000000000000000000',
    ],
    decimals: ['18', '6', '6', '0'],
    underlyingDecimals: ['18', '6', '6', '0', '0', '0', '0', '0'],
    assetType: '0',
    totalSupply: 0,
    implementation: '',
    assetTypeName: CurveAssetTypeName.USD,
    coins: [
      {
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        usdPrice: 1.001,
        decimals: '18',
        isBasePoolLpToken: false,
        symbol: 'DAI',
        poolBalance: '360958744303665092634728700',
      },
      {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        usdPrice: 0.999877,
        decimals: '6',
        isBasePoolLpToken: false,
        symbol: 'USDC',
        poolBalance: '369687047434540',
      },
      {
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        usdPrice: 1,
        decimals: '6',
        isBasePoolLpToken: false,
        symbol: 'USDT',
        poolBalance: '227737794220469',
      },
    ],
    usdTotal: 958699073.1961433,
    isMetaPool: false,
    usdTotalExcludingBasePool: 958699073.1961433,
    gaugeAddress: '0xbfcf63294ad7105dea65aa58f8ae5be2d9d0952a',
  });
};

export const mockTricryptoPool = async (): Promise<CurvePoolExtended> => {
  return extendRawPoolData(triCryptoABI, {
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
  });
};

export const mockLinkUsdPool = async (): Promise<CurvePoolExtended> => {
  return extendRawPoolData(linkusdABI, {
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
  });
};

export const mockSaCrvPool = async (): Promise<CurvePoolExtended> => {
  return extendRawPoolData(saCrvABI, {
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
  });
};

export const mockUsdkPool = async (): Promise<CurvePoolExtended> => {
  return extendRawPoolData(usdkABI, {
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
  });
};

export const mockHbtcPool = async (): Promise<CurvePoolExtended> => {
  return extendRawPoolData(hbtcABI, {
    id: '6',
    address: '0x4CA9b3063Ec5866A4B82E437059D2C43d1be596F',
    coinsAddresses: [
      '0x0316EB71485b0Ab14103307bf65a021042c6d380',
      '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      '0x0000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000',
    ],
    decimals: ['18', '8', '0', '0'],
    underlyingDecimals: ['18', '8', '0', '0', '0', '0', '0', '0'],
    assetType: '2',
    totalSupply: 0,
    implementation: '',
    assetTypeName: CurveAssetTypeName.BTC,
    coins: [
      {
        address: '0x0316EB71485b0Ab14103307bf65a021042c6d380',
        usdPrice: 24393,
        decimals: '18',
        isBasePoolLpToken: false,
        symbol: 'HBTC',
        poolBalance: '299649755789107284225',
      },
      {
        address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        usdPrice: 24486,
        decimals: '8',
        isBasePoolLpToken: false,
        symbol: 'WBTC',
        poolBalance: '39794548905',
      },
    ],
    usdTotal: 17053449.737841994,
    isMetaPool: false,
    usdTotalExcludingBasePool: 17053449.737841994,
    gaugeAddress: '0x4c18e409dc8619bfb6a1cb56d114c3f592e0ae79',
  });
};

export const mockUsdpPool = async (): Promise<CurvePoolExtended> => {
  return extendRawPoolData(usdpABI, {
    id: '26',
    address: '0x42d7025938bEc20B69cBae5A77421082407f053A',
    coinsAddresses: [
      '0x1456688345527bE1f37E9e627DA0837D6f08C925',
      '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
      '0x0000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000',
    ],
    decimals: ['18', '18', '0', '0'],
    underlyingDecimals: ['18', '18', '6', '6', '0', '0', '0', '0'],
    assetType: '0',
    totalSupply: '11141941007017101013876339',
    lpTokenAddress: '0x7Eb40E450b9655f4B3cC4259BCC731c63ff55ae6',
    name: 'Curve.fi USDP/3Crv',
    symbol: 'usdp3CRV',
    priceOracle: 0,
    implementation: '',
    assetTypeName: CurveAssetTypeName.USD,
    coins: [
      {
        address: '0x1456688345527bE1f37E9e627DA0837D6f08C925',
        usdPrice: 1.009,
        decimals: '18',
        isBasePoolLpToken: false,
        symbol: 'USDP',
        poolBalance: '4023558339617979189257902',
      },
      {
        address: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
        usdPrice: 1.022,
        decimals: '18',
        isBasePoolLpToken: true,
        symbol: '3Crv',
        poolBalance: '7065719816554194972005031',
      },
    ],
    usdTotal: 11280936.017192928,
    isMetaPool: true,
    usdTotalExcludingBasePool: 4059770.3646745407,
    gaugeAddress: '0x055be5ddb7a925bfef3417fc157f53ca77ca7222',
  });
};

export const mockFraxPool = async (): Promise<CurvePoolExtended> => {
  return extendRawPoolData(fraxABI, {
    id: '34',
    address: '0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B',
    coinsAddresses: [
      '0x853d955aCEf822Db058eb8505911ED77F175b99e',
      '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
      '0x0000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000',
    ],
    decimals: ['18', '18', '0', '0'],
    underlyingDecimals: ['18', '18', '6', '6', '0', '0', '0', '0'],
    assetType: '0',
    totalSupply: '1066340093759629757235203796',
    implementation: '',
    assetTypeName: CurveAssetTypeName.USD,
    coins: [
      {
        address: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
        usdPrice: 0.999847,
        decimals: '18',
        isBasePoolLpToken: false,
        symbol: 'FRAX',
        poolBalance: '643333209493640160454853555',
      },
      {
        address: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
        usdPrice: 1.022,
        decimals: '18',
        isBasePoolLpToken: true,
        symbol: '3Crv',
        poolBalance: '422639040234901084674735245',
      },
    ],
    usdTotal: 1075171878.6326566,
    isMetaPool: true,
    usdTotalExcludingBasePool: 643234779.5125877,
    gaugeAddress: '0x72e158d38dbd50a483501c24f792bdaaa3e7d55c',
  });
};

export const mockAavePool = async (): Promise<CurvePoolExtended> => {
  return extendRawPoolData(aaveABI, {
    id: '1',
    address: '0xDeBF20617708857ebe4F679508E7b7863a8A8EeE',
    coinsAddresses: [
      '0x028171bCA77440897B824Ca71D1c56caC55b68A3',
      '0xBcca60bB61934080951369a648Fb03DF4F96263C',
      '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
      '0x0000000000000000000000000000000000000000',
    ],
    decimals: ['18', '6', '6', '0'],
    underlyingDecimals: ['18', '6', '6', '0', '0', '0', '0', '0'],
    assetType: '0',
    totalSupply: '30013073271997854670089241',
    lpTokenAddress: '0xFd2a8fA60Abd58Efe3EeE34dd494cD491dC14900',
    name: 'Curve.fi aDAI/aUSDC/aUSDT',
    symbol: 'a3CRV',
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
        poolBalance: '10771790672539274086903485',
      },
      {
        address: '0xBcca60bB61934080951369a648Fb03DF4F96263C',
        usdPrice: 1.006,
        decimals: '6',
        isBasePoolLpToken: false,
        symbol: 'aUSDC',
        poolBalance: '10837576978724',
      },
      {
        address: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
        usdPrice: 1.001,
        decimals: '6',
        isBasePoolLpToken: false,
        symbol: 'aUSDT',
        poolBalance: '11242222879180',
      },
    ],
    usdTotal: 33014032.54057511,
    isMetaPool: false,
    usdTotalExcludingBasePool: 33014032.54057511,
    gaugeAddress: '0xd662908ada2ea1916b3318327a97eb18ad588b5d',
  });
};

export const mockTusdPool = async (): Promise<CurvePoolExtended> => {
  return extendRawPoolData(tusdABI, {
    id: '32',
    address: '0xEcd5e75AFb02eFa118AF914515D6521aaBd189F1',
    coinsAddresses: [
      '0x0000000000085d4780B73119b644AE5ecd22b376',
      '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
      '0x0000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000',
    ],
    decimals: ['18', '18', '0', '0'],
    underlyingDecimals: ['18', '18', '6', '6', '0', '0', '0', '0'],
    assetType: '0',
    totalSupply: '78927967370055952624335020',
    implementation: '',
    assetTypeName: CurveAssetTypeName.USD,
    coins: [
      {
        address: '0x0000000000085d4780B73119b644AE5ecd22b376',
        usdPrice: 0.999299,
        decimals: '18',
        isBasePoolLpToken: false,
        symbol: 'TUSD',
        poolBalance: '35908237137162026689581391',
      },
      {
        address: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
        usdPrice: 1.022,
        decimals: '18',
        isBasePoolLpToken: true,
        symbol: '3Crv',
        poolBalance: '42580558271034650523163989',
      },
    ],
    usdTotal: 79400396.0159263,
    isMetaPool: true,
    usdTotalExcludingBasePool: 35883065.462928884,
    gaugeAddress: '0x359fd5d6417ae3d8d6497d9b2e7a890798262ba4',
  });
};

export const mockCrvFraxPool = async (): Promise<CurvePoolExtended> => {
  return extendRawPoolData(crvFraxABI, {
    id: '44',
    address: '0xDcEF968d416a41Cdac0ED8702fAC8128A64241A2',
    coinsAddresses: [
      '0x853d955aCEf822Db058eb8505911ED77F175b99e',
      '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      '0x0000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000',
    ],
    decimals: ['18', '6', '0', '0'],
    underlyingDecimals: ['18', '6', '0', '0', '0', '0', '0', '0'],
    assetType: '0',
    totalSupply: '504004050537439631936701746',
    lpTokenAddress: '0x3175Df0976dFA876431C2E9eE6Bc45b65d3473CC',
    name: 'Curve.fi FRAX/USDC',
    symbol: 'crvFRAX',
    priceOracle: 0,
    implementation: '',
    assetTypeName: CurveAssetTypeName.USD,
    coins: [
      {
        address: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
        usdPrice: 0.999847,
        decimals: '18',
        isBasePoolLpToken: false,
        symbol: 'FRAX',
        poolBalance: '243188106124544652539030970',
      },
      {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        usdPrice: 0.999877,
        decimals: '6',
        isBasePoolLpToken: false,
        symbol: 'USDC',
        poolBalance: '261109359270682',
      },
    ],
    usdTotal: 504228141.1637993,
    isMetaPool: false,
    usdTotalExcludingBasePool: 504228141.1637993,
    gaugeAddress: '0xcfc25170633581bf896cb6cdee170e3e3aa59503',
  });
};

export const mockOp3pool = async (): Promise<CurvePoolExtended> => {
  return extendRawPoolData(
    op3poolABI,
    {
      id: '0',
      address: '0x1337BedC9D22ecbe766dF105c9623922A27963EC',
      coinsAddresses: [
        '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
        '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
        '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
        '0x0000000000000000000000000000000000000000',
      ],
      decimals: ['18', '6', '6', '0'],
      underlyingDecimals: ['18', '6', '6', '0', '0', '0', '0', '0'],
      assetType: '0',
      totalSupply: '11956917819260796203851998',
      implementation: '',
      assetTypeName: CurveAssetTypeName.USD,
      coins: [
        {
          address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
          usdPrice: 1.001,
          decimals: '18',
          isBasePoolLpToken: false,
          symbol: 'DAI',
          poolBalance: '3794750837162611560077138',
        },
        {
          address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
          usdPrice: 0.999889,
          decimals: '6',
          isBasePoolLpToken: false,
          symbol: 'USDC',
          poolBalance: '3861262702641',
        },
        {
          address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
          usdPrice: 1,
          decimals: '6',
          isBasePoolLpToken: false,
          symbol: 'USDT',
          poolBalance: '4458181608491',
        },
      ],
      usdTotal: 12117561.29897178,
      isMetaPool: false,
      usdTotalExcludingBasePool: 12117561.29897178,
    },
    { network: 'optimism' },
  );
};
