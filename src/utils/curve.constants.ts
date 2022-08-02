import { Decimal } from 'decimal.js';
import moment from 'moment';

export type Network = 'ethereum' | 'optimism' | 'arbitrum' | 'fantom' | 'avalanche' | 'polygon';
export type PoolType = 'main' | 'crypto' | 'factory';

export const CURVE_NETWORKS: Array<Network> = [
  'ethereum',
  'optimism',
  'arbitrum',
  'fantom',
  'avalanche',
  'polygon',
];

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

// only analyze pools with sufficient tvl
export const TOP_POOLS_MINIMUM_TVL_THRESHOLD = new Decimal(10000000);

export const PROMINENT_TRANSACTIONS_MINIMUM_USD_THRESHOLD = new Decimal(100000);
export const TRANSACTIONS_MINIMUM_DATE_THRESHOLD = moment().subtract(7, 'days');
