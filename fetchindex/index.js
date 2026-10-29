/**
 * A release as the Node.js release index lists it.
 *
 * @typedef {object} IndexRelease
 * @property {string} version Such as `'v17.6.0'`.
 * @property {string} date
 * @property {string[]} files
 * @property {string} [npm]
 * @property {string} [v8]
 * @property {string} [uv]
 * @property {string} [zlib]
 * @property {string} [openssl]
 * @property {string} [modules]
 * @property {string | false} lts The LTS codename, or `false`.
 * @property {boolean} security
 */

/**
 * Fetches the Node.js release index.
 *
 * @param {object} options
 * @param {typeof fetch} options.fetch The `fetch` implementation to use.
 * @param {{ index: string }} options.urls The full URL of the index.
 * @returns {Promise<IndexRelease[]>} Every release, newest first.
 */
async function versions(options) {
	// parse our options and set up fetch if a custom fetch is passed
	const fetch = options.fetch;
	const url = options.urls.index;

	// fetch the url, get the json from the fetched URL that we're going to use
	const raw = await fetch(url);
	const versions = await raw.json();

	return versions;
}

module.exports = versions;
