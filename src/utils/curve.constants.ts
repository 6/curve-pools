export type Network = 'ethereum' | 'optimism' | 'arbitrum'; // todo: add more
export type PoolType = 'main' | 'crypto' | 'factory';

export const CURVE_NETWORKS: Array<Network> = ['ethereum', 'optimism', 'arbitrum'];

export const CURVE_POOL_TYPES: Array<PoolType> = ['main', 'crypto', 'factory'];

export const CURVE_POOL_TOKEN_DECIMALS = 18;

export enum CurveAssetTypeName {
  USD = 'usd',
  BTC = 'btc',
  ETH = 'eth',
  // euro (EURS-EURT), correlated cryptos (sLINK-LINK), etc
  OTHER = 'other',
  // used for uncorrelated assets? e.g. tricrypto
  UNKNOWN = 'unknown',
}
