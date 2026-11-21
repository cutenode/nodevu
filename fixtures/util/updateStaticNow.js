/**
 * @file Records the time the snapshots were taken in `data/now.json`.
 *
 * Run it from `fixtures/`, since it writes to `./data` in the working directory.
 *
 * @example
 * ```js
 * // in fixtures/, the same as `npm run test:update:now`
 * require('./util/updateStaticNow.js');
 * ```
 */

const { DateTime } = require('luxon');
const write = require('./write');

/**
 * Writes the current time to `data/now.json` as an ISO string with its offset.
 *
 * @returns {Promise<void>} Settles once `data/now.json` is written.
 * @example
 * ```js
 * // in fixtures/
 * await updateStaticDateTime();
 * // data/now.json holds a time such as "2025-10-30T08:51:04.858-07:00"
 * ```
 */
async function updateStaticDateTime() {
	// write serializes the DateTime to its ISO string
	await write('./data/now.json', DateTime.now());
}

updateStaticDateTime();
