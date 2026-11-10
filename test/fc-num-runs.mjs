// CI's weekly run loads this with --import and sets FC_NUM_RUNS, to try far
// more random cases per property than a PR run can afford
import { createRequire } from 'node:module';
import { join } from 'node:path';

const require = createRequire(join(process.cwd(), 'package.json'));

const { devDependencies = {} } = require('./package.json');

const numRuns = Number(process.env.FC_NUM_RUNS);

if (numRuns > 0 && 'fast-check' in devDependencies) {
	require('fast-check').configureGlobal({ numRuns });
}
