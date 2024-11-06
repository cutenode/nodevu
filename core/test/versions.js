const { deepStrictEqual } = require('node:assert');
const { describe, it } = require('test');
const { fetch: undiciFetch } = require('undici');
const { DateTime } = require('luxon');
const nodevu = require('../index');
const versions = require('../util/prod/versions');
const optionsParser = require('../util/prod/optionsParser');

// checks that verify the result of data returned
function check(data) {
	deepStrictEqual(typeof data[0].version, 'string');
	deepStrictEqual(typeof data[0].date, 'string');
	deepStrictEqual(Array.isArray(data[0].files), true);
	deepStrictEqual(typeof data[0].npm, 'string');
	deepStrictEqual(typeof data[0].v8, 'string');
	deepStrictEqual(typeof data[0].uv, 'string');
	deepStrictEqual(typeof data[0].zlib, 'string');
	deepStrictEqual(typeof data[0].openssl, 'string');
	deepStrictEqual(typeof data[0].modules, 'string');
	deepStrictEqual(typeof data[0].lts, 'boolean');
	deepStrictEqual(typeof data[0].security, 'boolean');
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

	it('should work with a different fetch pased to optionsParser', async () => {
		const parsedOptions = optionsParser({
			fetch: undiciFetch,
		});
		const data = await versions(parsedOptions);
		check(data);
	});
});
