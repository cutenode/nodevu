const { fetch } = require('undici');
const write = require('./write');

/**
 * Downloads and parses `url`, rejecting on an error response, whose JSON body
 * would otherwise be saved as the snapshot.
 *
 * @param {string} url
 */
async function download(url) {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(
			`Fetching ${url} failed: ${response.status} ${response.statusText}`,
		);
	}

	return response.json();
}

async function update() {
	const index = await download('https://nodejs.org/dist/index.json');

	const schedule = await download(
		'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json',
	);

	await write('./data/index.json', index);
	await write('./data/schedule.json', schedule);
}

update();
