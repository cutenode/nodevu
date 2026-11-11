const { deepStrictEqual, match, ok, rejects } = require('node:assert');
const { describe, it } = require('node:test');

const {
	fetch: undiciFetch,
	MockAgent,
	setGlobalDispatcher,
} = require('undici');
const { at } = require('@nodevu/fixtures');
const indexSnapshot = require('@nodevu/fixtures/data/index.json');
const now = require('@nodevu/fixtures/data/now.json');

const fetchindex = require('../index');

// checks that verify the result of data returned
/** @param {import('../index').IndexRelease[]} data */
function check(data) {
	// the newest release can be a prerelease, like v27.0.0-alpha.0.0.0
	match(data[0].version, /^v\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/);
	match(data[0].date, /^\d{4}-\d{2}-\d{2}$/);
	deepStrictEqual(Array.isArray(data[0].files), true);
	// the index leaves these out only for releases from before they existed
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

const url = 'https://nodejs.org/dist/index.json';

// undici's fetch goes through this mock instead of the network: it serves
// each intercept() once and refuses any other request
const agent = new MockAgent();

agent.disableNetConnect();

setGlobalDispatcher(agent);

describe('under normal conditions, versions should work', async () => {
	it('should work with default options', async (t) => {
		const fetch = t.mock.method(globalThis, 'fetch', at(now).fetch);

		const data = await fetchindex({
			fetch: globalThis.fetch,
			urls: { index: url },
		});

		check(data);
		deepStrictEqual(requested(fetch), [url]);
	});

	it('should work with Undici fetch', async () => {
		intercept();

		const data = await fetchindex({ fetch: undiciFetch, urls: { index: url } });

		check(data);
		agent.assertNoPendingInterceptors();
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

// the URLs a mocked `fetch` was called with
/** @param {import('node:test').Mock<typeof globalThis.fetch>} mock */
function requested(mock) {
	return mock.mock.calls.map((call) => call.arguments[0]);
}

// serves the index.json snapshot to undici's fetch once
function intercept() {
	agent
		.get('https://nodejs.org')
		.intercept({ path: '/dist/index.json' })
		.reply(200, indexSnapshot);
}
