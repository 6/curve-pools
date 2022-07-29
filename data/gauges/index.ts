import path from 'path';
import { readFileSync } from 'fs';
import { FetchGaugesResponse, GaugeMetadata } from '../../src/utils/curve-api';

interface GaugeMap {
  [contractAddress: string]: GaugeMetadata;
}

let _getGauges: GaugeMap;
export const getGauges = (): GaugeMap => {
  if (_getGauges) {
    return _getGauges;
  }
  const gaugeFile = readFileSync(path.resolve(__dirname, `./gauges.json`), 'utf8');
  const gaugesResponse = JSON.parse(gaugeFile) as FetchGaugesResponse;
  _getGauges = gaugesResponse.data.gauges;
  return _getGauges;
};

interface GetGaugeProps {
  contractAddress: string;
}
export const getGauge = ({ contractAddress }: GetGaugeProps): GaugeMetadata | void => {
  const lowercaseContractAddress = contractAddress.toLowerCase();
  const gauges = getGauges();
  for (const gaugeId in gauges) {
    const gauge = gauges[gaugeId];
    if (gauge.is_killed) {
      continue;
    }
    if (lowercaseContractAddress === gauge.swap.toLowerCase()) {
      return gauge;
    }
  }
};
