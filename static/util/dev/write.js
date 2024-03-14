const { writeFile } = require('node:fs/promises');
const { resolve } = require('node:path');

async function write(path, data) {
	const outputJSON = JSON.stringify(data, null, 2);
	let filepath = resolve(path);
	// hack to let us run this script from the root of the repo as a npm script with workspaces commands
	if (filepath.includes('static/static/')) {
		filepath = filepath.replace('static/static/', 'static/');
	}

	await writeFile(filepath, outputJSON);
}

module.exports = write;
