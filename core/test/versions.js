const { deepStrictEqual, match, ok, rejects } = require('node:assert');
const { describe, it } = require('node:test');
const undici = require('undici');
const versions = require('../util/prod/versions');
const optionsParser = require('../util/prod/optionsParser');

// undici's types only take its own Request class, so they don't match the
// global fetch's type even though it works as one
const undiciFetch = /** @type {typeof fetch} */ (
	/** @type {unknown} */ (undici.fetch)
);

/** @typedef {import('../util/prod/optionsParser').ParsedOptions} ParsedOptions */

// checks that verify the result of data returned
/** @param {import('../util/prod/versions').IndexRelease[]} data */
function check(data) {
	// the newest release can be a prerelease, like v27.0.0-alpha.0.0.0
	match(data[0].version, /^v\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/);
	match(data[0].date, /^\d{4}-\d{2}-\d{2}$/);
	deepStrictEqual(Array.isArray(data[0].files), true);
	ok(
		data[0].npm &&
			data[0].v8 &&
			data[0].uv &&
			data[0].zlib &&
			data[0].openssl &&
			data[0].modules,
	);
	match(data[0].npm, /^\d+\.\d+\.\d+/);
	match(data[0].v8, /^\d+\.\d+\.\d+/);
	match(data[0].uv, /^\d+\.\d+\.\d+/);
	match(data[0].zlib, /^\d+\.\d+/);
	match(data[0].openssl, /^\d+\.\d+\.\d+/);
	match(data[0].modules, /^\d+$/);
	// index.json has false for non-LTS releases and the line's codename for LTS
	// ones
	deepStrictEqual(
		data[0].lts === false || /^[A-Z][a-z]+$/.test(data[0].lts),
		true,
	);
	deepStrictEqual([true, false].includes(data[0].security), true);
}

// set up options object that would normally be passed to the module. the
// module only reads fetch and its own URL
const options = /** @type {ParsedOptions} */ ({
	fetch: globalThis.fetch,
	urls: {
		index: 'https://nodejs.org/dist/index.json',
	},
});

describe('under normal condiditons, versions should work', async () => {
	it('should work with default options', async () => {
		const data = await versions(options);
		check(data);
	});

	it('should work with Undici fetch', async () => {
		options.fetch = undiciFetch;
		const data = await versions(options);
		check(data);
	});
});

describe('versions should work with optionsParser', async () => {
	it('should work with the default output of optionsParser', async () => {
		const parsedOptions = optionsParser({});
		const data = await versions(parsedOptions);
		check(data);
	});

	it('should work with a different fetch passed to optionsParser', async () => {
		const parsedOptions = optionsParser({
			fetch: undiciFetch,
		});

		const data = await versions(parsedOptions);
		check(data);
	});
});

describe('versions', async () => {
	it('should reject naming the URL and status when the response is not ok', async () => {
		// Arrange
		const url = 'https://nodejs.org/dist/index.json';

		// Act
		const result = versions(
			/** @type {ParsedOptions} */ ({ fetch: notFound, urls: { index: url } }),
		);

		// Assert
		await rejects(result, {
			message: `Fetching ${url} failed: 404 Not Found`,
		});
	});
});

// Helpers

/** @type {typeof fetch} */
const notFound = async () =>
	new Response('Not Found', { status: 404, statusText: 'Not Found' });
