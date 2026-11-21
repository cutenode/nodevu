/**
 * @file Replaces the index.json and schedule.json snapshots with the live ones.
 *
 * Run it from `fixtures/`, since it writes to `./data` in the working directory.
 *
 * @example
 * ```js
 * // in fixtures/, the same as `npm run test:update:static`
 * require('./util/updateStaticData.js');
 * ```
 */

const { fetch } = require('undici');
const write = require('./write');

/**
 * Downloads and parses `url`, rejecting on an error response, whose JSON body
 * would otherwise be saved as the snapshot.
 *
 * @param {string} url The JSON file to fetch.
 * @returns {Promise<unknown>} The parsed body.
 * @example
 * ```js
 * const index = await download('https://nodejs.org/dist/index.json');
 *
 * index[0].version; // the newest release, such as 'v25.1.0'
 * ```
 */
async function download(url) {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(
			`Fetching ${url} failed: ${response.status} ${response.statusText}`,
		);
	}

	return response.json();
}

/**
 * Downloads the live index.json and schedule.json and saves them over the
 * snapshots in `data/`.
 *
 * @returns {Promise<void>} Settles once both snapshots are written.
 * @example
 * ```js
 * // in fixtures/
 * await update();
 * ```
 */
async function update() {
	const index = await download('https://nodejs.org/dist/index.json');

	const schedule = await download(
		'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json',
	);

	await write('./data/index.json', index);
	await write('./data/schedule.json', schedule);
}

update();
