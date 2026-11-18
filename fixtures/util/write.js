const { writeFile } = require('node:fs/promises');
const { resolve } = require('node:path');

/**
 * Writes `data` to `path` as tab-indented JSON.
 *
 * @param {string} path The file to write, relative to the working directory.
 * @param {unknown} data The value to write, which `JSON.stringify` takes.
 */
async function write(path, data) {
	const outputJSON = JSON.stringify(data, null, '\t');
	const filepath = resolve(path);

	await writeFile(filepath, outputJSON);
}

module.exports = write;
