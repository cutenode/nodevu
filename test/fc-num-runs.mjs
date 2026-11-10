// CI's weekly run loads this with --import and sets FC_NUM_RUNS, to try far
// more random cases per property than a PR run can afford
import { createRequire } from 'node:module';
import { join } from 'node:path';

// the manifest of the workspace under test, since `npm run -w` runs there
const manifest = join(process.cwd(), 'package.json');

const require = createRequire(manifest);

/** @type {{ devDependencies?: Record<string, string> }} */
const { devDependencies = {} } = require(manifest);

const numRuns = Number(process.env.FC_NUM_RUNS);

if (numRuns > 0 && 'fast-check' in devDependencies) {
	require('fast-check').configureGlobal({ numRuns });
}
