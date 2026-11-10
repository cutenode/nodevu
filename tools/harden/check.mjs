// `harden check` can only check a whole level, so this reads its strict
// `--json` report from stdin and fails on every opinion that isn't applied,
// except the ones decisions.json turns off.
import { readFile } from 'node:fs/promises';
import { text } from 'node:stream/consumers';

const decisions = JSON.parse(
	await readFile(new URL('decisions.json', import.meta.url), 'utf8'),
);

const { checks } = JSON.parse(await text(process.stdin));

const missing = checks.filter(
	({ id, satisfied }) => satisfied !== 1 && decisions[id] !== false,
);

for (const { id } of missing) {
	console.error(`harden: ${id} is not applied`);
}

process.exitCode = missing.length === 0 ? 0 : 1;
