const nodevu = require('@nodevu/core');
const write = require('../util/dev/write');

async function writeSecurity() {
	const data = await nodevu();
	/** @type {Record<string, import('@nodevu/core').Security>} */
	const security = {};

	for await (const version of Object.keys(data)) {
		security[version] = data[version].security;
	}

	write('./static/data/security.json', security);
}

writeSecurity();
