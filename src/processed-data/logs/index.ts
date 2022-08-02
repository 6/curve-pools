import { ExchangeRateGraphDataPointsJSON } from '../../utils/generate-pool-exchange-rate-graph';
import exchangeRatesJSON from './ethereum.exchange-rates.json';

type ExchangeRatesJSON = Record<
  string,
  {
    graph: ExchangeRateGraphDataPointsJSON;
    isMissingData: boolean;
  }
>;

export const exchangeRates = exchangeRatesJSON as ExchangeRatesJSON;
