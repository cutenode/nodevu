/**
 * @file Writes the JSON files of `@nodevu/static` for its build scripts.
 *
 * @example
 * ```js
 * const write = require('../util/dev/write');
 * ```
 */

const { writeFile } = require('node:fs/promises');
const { resolve, sep } = require('node:path');

/**
 * Writes `data` to `path` as JSON indented with two spaces.
 *
 * @param {string} path The file to write, relative to the working directory.
 * @param {unknown} data The value to write, which `JSON.stringify` takes.
 * @returns {Promise<void>} Fulfills once the file is written.
 * @public
 * @example
 * ```js
 * const nodevu = require('@nodevu/core');
 * const write = require('../util/dev/write');
 *
 * const data = await nodevu();
 *
 * await write('./static/data/default.json', data);
 * ```
 */
async function write(path, data) {
	const outputJSON = JSON.stringify(data, null, 2);

	// hack to let us run this script from the root of the repo as a npm script
	// with workspaces commands. `sep`, so it also matches Windows paths
	const filepath = resolve(path).replace(
		`${sep}static${sep}static${sep}`,
		`${sep}static${sep}`,
	);

	await writeFile(filepath, outputJSON);
}

module.exports = write;
