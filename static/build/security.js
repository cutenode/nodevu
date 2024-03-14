const nodevu = require('@nodevu/core');
const write = require('../util/dev/write');

async function writeSecurity(filename) {
	const data = await nodevu();
	const security = {};

	async () => {
		for await (const version of Object.keys(data)) {
			security[version] = data[version].security;
		}
	};
	write('./static/data/security.json', security);
}

writeSecurity();
