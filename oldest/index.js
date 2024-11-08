const nodevu = require('@nodevu/core');

async function oldest(name, type) {
	const data = await nodevu();

	if (type === 'lts') {
		return data[name].support.lts.oldest;
	}

	if (type === 'security') {
		return data[name].security.oldest;
	}
}

async function lts(name) {
	return await oldest(name, 'lts');
}

async function security(name) {
	return await oldest(name, 'security');
}

module.exports.oldest = oldest;
module.exports.lts = lts;
module.exports.security = security;
