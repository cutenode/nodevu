const nodevu = require('@nodevu/core');
const write = require('../util/dev/write');

async function writeDefault(filename) {
	const data = await nodevu();
	write('./static/data/default.json', data);
}

writeDefault();
