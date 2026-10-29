const nodevu = require('@nodevu/core');

/**
 * Finds the oldest LTS or security release of a release line.
 *
 * @param {string} name The release line, such as `'v16'` or `'v0.10'`.
 * @param {'lts' | 'security'} type Which kind of release to find.
 * @param {import('@nodevu/core').Options} [options] Passed to `@nodevu/core`.
 * @returns {Promise<string | undefined>} The version without its `v`, or
 *   `undefined` when the line has no such release.
 */
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

/**
 * Finds the oldest LTS release of a release line.
 *
 * @param {string} name The release line, such as `'v16'`.
 * @param {import('@nodevu/core').Options} [options] Passed to `@nodevu/core`.
 * @returns {Promise<string | undefined>}
 */
async function lts(name, options) {
	return await oldest(name, 'lts', options);
}

/**
 * Finds the oldest security release of a release line.
 *
 * @param {string} name The release line, such as `'v16'`.
 * @param {import('@nodevu/core').Options} [options] Passed to `@nodevu/core`.
 * @returns {Promise<string | undefined>}
 */
async function security(name, options) {
	return await oldest(name, 'security', options);
}

module.exports.oldest = oldest;

module.exports.lts = lts;

module.exports.security = security;
