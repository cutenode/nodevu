/**
 * @file Writes the releases of each release line to
 *   `static/data/releases.json`.
 *
 * @example
 * ```js
 * // from the repo root, same as `npm run build:releases --workspace=static`
 * require('./static/build/releases.js');
 * ```
 */

const nodevu = require('@nodevu/core');
const write = require('../util/dev/write');

/**
 * Fetches the releases of each release line from `@nodevu/core` and writes
 * them to `static/data/releases.json`.
 *
 * @returns {Promise<void>} Fulfills once the file is written.
 * @example
 * ```js
 * await writeReleases();
 * ```
 */
async function writeReleases() {
	const data = await nodevu();
	/** @type {Record<string, import('@nodevu/core').ReleaseLine['releases']>} */
	const releases = {};

	for (const version of Object.keys(data)) {
		releases[version] = data[version].releases;
	}

	await write('./static/data/releases.json', releases);
}

writeReleases();
