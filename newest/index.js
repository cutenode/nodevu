const nodevu = require('@nodevu/core');

/**
 * Finds the newest LTS or security release of a release line.
 *
 * @param {string} name The release line, such as `'v16'` or `'v0.10'`.
 * @param {'lts' | 'security'} type Which kind of release to find.
 * @param {import('@nodevu/core').Options} [options] Passed to `@nodevu/core`.
 * @returns {Promise<string | undefined>} The version without its `v`, or
 *   `undefined` when the line has no such release.
 */
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

/**
 * Finds the newest LTS release of a release line.
 *
 * @param {string} name The release line, such as `'v16'`.
 * @param {import('@nodevu/core').Options} [options] Passed to `@nodevu/core`.
 * @returns {Promise<string | undefined>}
 */
async function lts(name, options) {
	return await newest(name, 'lts', options);
}

/**
 * Finds the newest security release of a release line.
 *
 * @param {string} name The release line, such as `'v16'`.
 * @param {import('@nodevu/core').Options} [options] Passed to `@nodevu/core`.
 * @returns {Promise<string | undefined>}
 */
async function security(name, options) {
	return await newest(name, 'security', options);
}

module.exports.newest = newest;

module.exports.lts = lts;

module.exports.security = security;
