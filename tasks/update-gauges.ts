import { fetchGauges } from '../src/utils/curve-api';
import { sleep } from '../src/utils/sleep';
import { writeJSON } from '../src/utils/write-json';

const main = async () => {
  await sleep(400);
  const gauges = await fetchGauges();
  if (gauges.success) {
    await writeJSON(`./data/gauges/gauges.json`, gauges);
  } else {
    console.error('[update-guages] something went wrong: ', gauges);
  }
};

main();
