const { writeFile } = require('node:fs/promises');
const { resolve } = require('node:path');

async function write(path, data) {
	const outputJSON = JSON.stringify(data, null, '\t');
	const filepath = resolve(path);

	await writeFile(filepath, outputJSON);
}

module.exports = write;
