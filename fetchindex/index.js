/**
 * @file Fetches the Node.js release index, the list of every Node.js release.
 *
 * @example
 * ```js
 * const fetchindex = require('@nodevu/fetchindex');
 *
 * const releases = await fetchindex({
 *   fetch: globalThis.fetch,
 *   urls: { index: 'https://nodejs.org/dist/index.json' },
 * });
 * ```
 */

/**
 * The part of `fetch` fetchindex uses: a GET of a URL whose JSON it reads. Any
 * `fetch` with this shape fits, such as `globalThis.fetch` or undici's.
 *
 * @public
 * @example
 * ```js
 * const { fetch } = require('undici');
 *
 * const releases = await fetchindex({
 *   fetch,
 *   urls: { index: 'https://nodejs.org/dist/index.json' },
 * });
 * ```
 *
 * @typedef {(url: string) => Promise<{
 *   ok: boolean,
 *   status: number,
 *   statusText: string,
 *   json: () => Promise<unknown>,
 * }>} Fetch
 */

/**
 * A release as the Node.js release index lists it.
 *
 * @public
 * @example
 * ```js
 * const [newest] = await fetchindex({
 *   fetch: globalThis.fetch,
 *   urls: { index: 'https://nodejs.org/dist/index.json' },
 * });
 * newest.files.includes('linux-x64'); // true
 * ```
 *
 * @typedef {object} IndexRelease
 * @property {string} version Such as `'v17.6.0'`.
 * @property {string} date The release date, such as `'2022-02-22'`.
 * @property {string[]} files The identifiers of the files the release ships,
 *   such as `'linux-x64'`.
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
 * Fetches the Node.js release index. Rejects when the response isn't OK.
 *
 * @public
 * @example
 * ```js
 * const releases = await fetchindex({
 *   fetch: globalThis.fetch,
 *   urls: { index: 'https://nodejs.org/dist/index.json' },
 * });
 * releases.at(-1).version; // 'v0.1.14'
 * ```
 *
 * @param {object} options The `fetch` implementation and the URL to use.
 * @param {Fetch} options.fetch The `fetch` implementation to use.
 * @param {{ index: string }} options.urls The full URL of the index.
 * @returns {Promise<IndexRelease[]>} Every release, newest first.
 */
async function versions(options) {
	// parse our options and set up fetch if a custom fetch is passed
	const fetch = options.fetch;
	const url = options.urls.index;

	// fetch the url, get the json from the fetched URL that we're going to use
	const raw = await fetch(url);

	if (!raw.ok) {
		throw new Error(`Fetching ${url} failed: ${raw.status} ${raw.statusText}`);
	}

	// index.json is the list of releases, newest first
	const versions = /** @type {IndexRelease[]} */ (await raw.json());

	return versions;
}

module.exports = versions;
