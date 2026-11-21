/**
 * @file Fails on each opinion in a `harden check --json` report that isn't applied.
 *
 * `harden check` can only check a whole level, so this reads its strict report
 * from stdin and skips the opinions decisions.json turns off.
 *
 * @example
 * ```js
 * // harden check -p npm -l strict --json | node tools/harden/check.mjs
 * import { spawnSync } from 'node:child_process';
 *
 * const { status } = spawnSync(process.execPath, ['tools/harden/check.mjs'], {
 *   input: JSON.stringify({ checks: [{ id: 'n_nogit', satisfied: 0 }] }),
 * });
 *
 * status; // 1
 * ```
 */
import { readFile } from 'node:fs/promises';
import { text } from 'node:stream/consumers';

/**
 * The opinions decided on in decisions.json, by id. `false` turns one off, so it can stay unapplied.
 *
 * @example
 * ```js
 * decisions.n_runner; // false
 * ```
 *
 * @type {Record<string, unknown>}
 */
const decisions = JSON.parse(
	await readFile(new URL('decisions.json', import.meta.url), 'utf8'),
);

/** @type {{ checks: { id: string, satisfied: number }[] }} */
const { checks } = JSON.parse(await text(process.stdin));

/**
 * The checks in the report that aren't satisfied and that decisions.json doesn't turn off.
 *
 * @example
 * ```js
 * missing.map(({ id }) => id); // ['n_nogit'] when only n_nogit is unapplied
 * ```
 */
const missing = checks.filter(
	({ id, satisfied }) => satisfied !== 1 && decisions[id] !== false,
);

for (const { id } of missing) {
	console.error(`harden: ${id} is not applied`);
}

process.exitCode = missing.length === 0 ? 0 : 1;
