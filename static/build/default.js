const nodevu = require('@nodevu/core');
const write = require('../util/dev/write');

async function writeDefault() {
	const data = await nodevu();
	write('./static/data/default.json', data);
}

writeDefault();
