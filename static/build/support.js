const nodevu = require('@nodevu/core');
const write = require('../util/dev/write');

async function writeSupport() {
	const data = await nodevu();
	/** @type {Record<string, import('@nodevu/core').Support | undefined>} */
	const support = {};

	for await (const version of Object.keys(data)) {
		support[version] = data[version].support;
	}

	write('./static/data/support.json', support);
}

writeSupport();
