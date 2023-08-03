import fetch from 'isomorphic-fetch';
import { CurveAssetTypeName, Network, PoolType } from './curve.constants';

export interface CurvePoolToken {
  address: string; // "0x96E61422b6A9bA0e068B6c5ADd4fFaBC6a4aae27",
  usdPrice: number; // 1.016,
  decimals: string | number; // "18",
  isBasePoolLpToken: boolean;
  symbol: string; // "ibEUR",
  poolBalance: string; // "2440147371390294759297"
}
export interface CurvePoolMetadata {
  id: string; // "factory-v2-0"
  address: string; // "0x1F71f05CF491595652378Fe94B7820344A551B8E"
  coinsAddresses: Array<string>; // ["0x96E61422b6A9bA0e068B6c5ADd4fFaBC6a4aae27", ...]
  decimals: Array<string>; // ["18", ...] (same length as coinsAddresses)
  underlyingDecimals: Array<string>; // ["18", ...] (>= above length maybe?)
  assetType: string; // "99" ??
  totalSupply: string | number; // "20000000000000000" . Sometimes number 0
  implementationAddress?: string; // "0x6523Ac15EC152Cb70a334230F6c5d62C5Bd963f1"
  lpTokenAddress?: string;
  priceOracle?: number;
  gaugeAddress?: string;
  // Some pools like 0xE7a24EF0C5e95Ffb0f6684b813A78F2a3AD7D171 have no name
  name?: string; // "Curve.fi Factory Plain Pool: ibEUR/sEUR"
  // Some pools like 0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7 don't have symbol
  symbol?: string; // "ibEUR+sEUR-f"
  implementation: string; // "plain2basic" ?? switch to enum?
  assetTypeName: CurveAssetTypeName; // "unknown"
  coins: Array<CurvePoolToken>;
  usdTotal: number; // 2479.1897315233555
  isMetaPool: boolean;
  usdTotalExcludingBasePool: number; // 2479.1897315233555
}
export interface FetchPoolsResponse {
  success: boolean;
  data: {
    poolData: Array<CurvePoolMetadata>;
  };
  tvlAll: number; // 1320075079.689438,
  tvl: number; // 497289068.66590536,
  generatedTimeMs: number; // 1658963350286
}

export interface GaugeMetadata {
  swap: string; // '0xA2B47E3D5c44877cca798226B7B8118F9BFb7A56';
  swap_token: string; // '0x845838DF265Dcd2c412A1Dc9e959c7d08537f8a2';
  name: string; // 'compound';
  gauge: string; // '0x7ca5b0a2910B33e9759DC7dDB0413949071D7575';
  type: string; // 'stable', 'crypto', 'bitcoin', 'tether-eurt', 'terra-krw', ...
  factory?: boolean;
  side_chain?: boolean; // true if non-eth mainnet?
  is_killed?: boolean; // ignore this gauge if true?
  gauge_controller: {
    get_gauge_weight: string; // '829238348634470388835212';
    gauge_relative_weight: string; // '1709707559875778';
    inflation_rate: string; // '7327853447857530670';
  };
  gauge_data?: {
    // may not be present for side chains?
    working_supply: string; //'43620766443951785825086848';
    inflation_rate: string; // '7327853447857530670';
  };
  swap_data?: {
    // may not be present for side chains?
    virtual_price: string; // '1108136951467551113';
  };
}
export interface FetchGaugesResponse {
  success: boolean;
  data: {
    gauges: Record<string, GaugeMetadata>;
    generatedTimeMs: number; // 1658963350286
  };
}

interface FetchPoolsProps {
  network: Network;
  poolType: PoolType;
}
export const fetchPools = async ({
  network,
  poolType,
}: FetchPoolsProps): Promise<FetchPoolsResponse> => {
  // TODO: also https://api.curve.fi/api/getFactoryCryptoPools/ethereum
  const poolsUri = `https://api.curve.fi/api/getPools/${network}/${poolType}`;
  console.log(`GET ${poolsUri}`);
  const response = await fetch(poolsUri);
  const json = await response.json();
  return json;
};

export const fetchGauges = async (): Promise<FetchGaugesResponse> => {
  // Includes all chains:
  const gaugesUri = 'https://api.curve.fi/api/getAllGauges';
  console.log(`GET ${gaugesUri}`);
  const response = await fetch(gaugesUri);
  const json = await response.json();
  return json;
};
