/**
 * @file Writes the support phases of each release line to
 *   `static/data/support.json`.
 *
 * @example
 * ```js
 * // from the repo root, same as `npm run build:support --workspace=static`
 * require('./static/build/support.js');
 * ```
 */

const nodevu = require('@nodevu/core');
const write = require('../util/dev/write');

/**
 * Fetches the support phases of each release line from `@nodevu/core` and
 * writes them to `static/data/support.json`.
 *
 * @returns {Promise<void>} Fulfills once the file is written.
 * @example
 * ```js
 * await writeSupport();
 * ```
 */
async function writeSupport() {
	const data = await nodevu();
	/** @type {Record<string, import('@nodevu/core').Support | undefined>} */
	const support = {};

	for (const version of Object.keys(data)) {
		support[version] = data[version].support;
	}

	await write('./static/data/support.json', support);
}

writeSupport();
