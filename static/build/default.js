/**
 * @file Writes everything `@nodevu/core` returns to `static/data/default.json`.
 *
 * @example
 * ```js
 * // from the repo root, same as `npm run build:default --workspace=static`
 * require('./static/build/default.js');
 * ```
 */

const nodevu = require('@nodevu/core');
const write = require('../util/dev/write');

/**
 * Fetches everything `@nodevu/core` returns and writes it to
 * `static/data/default.json`.
 *
 * @returns {Promise<void>} Fulfills once the file is written.
 * @example
 * ```js
 * await writeDefault();
 * ```
 */
async function writeDefault() {
	const data = await nodevu();
	await write('./static/data/default.json', data);
}

writeDefault();
