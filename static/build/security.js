/**
 * @file Writes the security releases of each release line to
 *   `static/data/security.json`.
 *
 * @example
 * ```js
 * // from the repo root, same as `npm run build:security --workspace=static`
 * require('./static/build/security.js');
 * ```
 */

const nodevu = require('@nodevu/core');
const write = require('../util/dev/write');

/**
 * Fetches the security releases of each release line from `@nodevu/core` and
 * writes them to `static/data/security.json`.
 *
 * @returns {Promise<void>} Fulfills once the file is written.
 * @example
 * ```js
 * await writeSecurity();
 * ```
 */
async function writeSecurity() {
	const data = await nodevu();
	/** @type {Record<string, import('@nodevu/core').Security>} */
	const security = {};

	for (const version of Object.keys(data)) {
		security[version] = data[version].security;
	}

	await write('./static/data/security.json', security);
}

writeSecurity();
