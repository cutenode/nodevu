const { DateTime } = require('luxon');
const write = require('./write');

async function updateStaticDateTime() {
	// write serializes the DateTime to its ISO string
	await write('./test/data/static/now.json', DateTime.now());
}

updateStaticDateTime();
