import moment from 'moment';
import { writeJSON } from '../src/utils/write-json';

const main = async () => {
  const timestamp = moment().utc();
  await writeJSON(`./src/processed-data/last-updated.json`, { timestamp });
};

main();
