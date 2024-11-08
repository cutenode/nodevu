const nodevu = require('@nodevu/core');

async function newest(name, type) {
	const data = await nodevu();

	if (type === 'lts') {
		return data[name].support.lts.newest;
	}

	if (type === 'security') {
		return data[name].security.newest;
	}
}

async function lts(name) {
	return await newest(name, 'lts');
}

async function security(name) {
	return await newest(name, 'security');
}

module.exports.newest = newest;
module.exports.lts = lts;
module.exports.security = security;
