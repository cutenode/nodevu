const nodevu = require('@nodevu/core');
const write = require('../util/dev/write');

async function writeReleases(filename) {
	const data = await nodevu();
	const releases = {};

	async () => {
		for await (const verison of Object.keys(data)) {
			releases[version] = data[version].releases;
		}
	};
	write('./static/data/releases.json', releases);
}

writeReleases();
