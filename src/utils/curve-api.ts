import fetch from 'isomorphic-fetch';
import { Network, PoolType } from './curve.constants';

interface CurvePoolToken {
  address: string; // "0x96E61422b6A9bA0e068B6c5ADd4fFaBC6a4aae27",
  usdPrice: number; // 1.016,
  decimals: string; // "18",
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
  totalSupply: string; // "20000000000000000" ??
  implementationAddress: string; // "0x6523Ac15EC152Cb70a334230F6c5d62C5Bd963f1"
  name?: string; // "Curve.fi Factory Plain Pool: ibEUR/sEUR"
  symbol: string; // "ibEUR+sEUR-f"
  implementation: string; // "plain2basic" ?? switch to enum?
  assetTypeName: string; // "unknown"
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

interface FetchPoolsProps {
  network: Network;
  poolType: PoolType;
}
export const fetchPools = async ({
  network,
  poolType,
}: FetchPoolsProps): Promise<FetchPoolsResponse> => {
  const poolsUri = `https://api.curve.fi/api/getPools/${network}/${poolType}`;
  console.log(`GET ${poolsUri}`);
  const response = await fetch(poolsUri);
  const json = await response.json();
  return json;
};
