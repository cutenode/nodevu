const nodevu = require('@nodevu/core');

async function oldest(name, type, options) {
	const data = await nodevu(options);

	// release lines without LTS (odd lines, or lines missing from schedule.json)
	// and unknown release lines don't have this data, so return undefined
	// instead of throwing
	if (type === 'lts') {
		return data[name]?.support?.lts?.oldest;
	}

	if (type === 'security') {
		return data[name]?.security?.oldest;
	}
}

async function lts(name, options) {
	return await oldest(name, 'lts', options);
}

async function security(name, options) {
	return await oldest(name, 'security', options);
}

module.exports.oldest = oldest;
module.exports.lts = lts;
module.exports.security = security;
