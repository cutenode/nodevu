const nodevu = require('@nodevu/core');

async function newest(name, type, options) {
	const data = await nodevu(options);

	// release lines without LTS (odd lines, or lines missing from schedule.json)
	// and unknown release lines don't have this data, so return undefined
	// instead of throwing
	if (type === 'lts') {
		return data[name]?.support?.lts?.newest;
	}

	if (type === 'security') {
		return data[name]?.security?.newest;
	}
}

async function lts(name, options) {
	return await newest(name, 'lts', options);
}

async function security(name, options) {
	return await newest(name, 'security', options);
}

module.exports.newest = newest;

module.exports.lts = lts;

module.exports.security = security;
