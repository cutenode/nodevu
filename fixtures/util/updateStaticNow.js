const { DateTime } = require('luxon');
const write = require('./write');

async function updateStaticDateTime() {
	// write serializes the DateTime to its ISO string
	await write('./data/now.json', DateTime.now());
}

updateStaticDateTime();
