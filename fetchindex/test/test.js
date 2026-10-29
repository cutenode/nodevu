const { deepStrictEqual, match, rejects } = require('node:assert');
const { describe, it } = require('node:test');
const { fetch: undiciFetch } = require('undici');
const fetchindex = require('../index');
const optionsParser = require('../../core/util/prod/optionsParser');

// checks that verify the result of data returned
function check(data) {
	match(data[0].version, /^v\d+\.\d+\.\d+$/);
	match(data[0].date, /^\d{4}-\d{2}-\d{2}$/);
	deepStrictEqual(Array.isArray(data[0].files), true);
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

// set up options object that would normally be passed to the module
const options = {
	fetch: globalThis.fetch,
	urls: {
		index: 'https://nodejs.org/dist/index.json',
	},
};

describe('under normal condiditons, versions should work', async () => {
	it('should work with default options', async () => {
		const data = await fetchindex(options);
		check(data);
	});

	it('should work with Undici fetch', async () => {
		options.fetch = undiciFetch;
		const data = await fetchindex(options);
		check(data);
	});
});

describe('versions should work with optionsParser', async () => {
	it('should work with the default output of optionsParser', async () => {
		const parsedOptions = optionsParser({});
		const data = await fetchindex(parsedOptions);
		check(data);
	});

	it('should work with a different fetch pased to optionsParser', async () => {
		const parsedOptions = optionsParser({
			fetch: undiciFetch,
		});

		const data = await fetchindex(parsedOptions);
		check(data);
	});
});

describe('fetchindex', async () => {
	it('should reject naming the URL and status when the response is not ok', async () => {
		// Arrange
		const url = 'https://nodejs.org/dist/index.json';

		// Act
		const result = fetchindex({ fetch: notFound, urls: { index: url } });

		// Assert
		await rejects(result, {
			message: `Fetching ${url} failed: 404 Not Found`,
		});
	});
});

// Helpers

async function notFound() {
	return new Response('Not Found', { status: 404, statusText: 'Not Found' });
}
