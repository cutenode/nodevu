const { writeFile } = require('node:fs/promises');
const { resolve, sep } = require('node:path');

/**
 * Writes `data` to `path` as JSON indented with two spaces.
 *
 * @param {string} path
 * @param {unknown} data
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
