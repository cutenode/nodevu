const nodevu = require('@nodevu/core');
const write = require('../util/dev/write');

async function writeSupport(filename) {
	const data = await nodevu();
	const support = {};

	for await (const version of Object.keys(data)) {
		support[version] = data[version].support;
	}

	write('./static/data/support.json', support);
}

writeSupport();
