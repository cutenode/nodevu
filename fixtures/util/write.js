/**
 * @file Saves the snapshot data the update scripts download as JSON files.
 *
 * @example
 * ```js
 * const write = require('./write');
 * ```
 */

const { writeFile } = require('node:fs/promises');
const { resolve } = require('node:path');

/**
 * Writes `data` to `path` as tab-indented JSON.
 *
 * @param {string} path The file to write, relative to the working directory.
 * @param {unknown} data The value to write, which `JSON.stringify` takes.
 * @returns {Promise<void>} Settles once the file is written.
 * @public
 * @example
 * ```js
 * const write = require('./write');
 *
 * await write('./data/now.json', new Date('2025-10-30'));
 * // data/now.json holds "2025-10-30T00:00:00.000Z"
 * ```
 */
async function write(path, data) {
	const outputJSON = JSON.stringify(data, null, '\t');
	const filepath = resolve(path);

	await writeFile(filepath, outputJSON);
}

module.exports = write;
