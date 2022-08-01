import { ExchangeRateGraphDataPointsJSON } from '../../utils/generate-pool-exchange-rate-graph';
import exchangeRatesJSON from './ethereum.exchange-rates.json';

export const exchangeRates = exchangeRatesJSON as Record<string, ExchangeRateGraphDataPointsJSON>;
