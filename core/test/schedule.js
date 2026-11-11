const { deepStrictEqual, match, rejects } = require('node:assert');
const { describe, it } = require('node:test');
const {
	fetch: undiciFetch,
	MockAgent,
	setGlobalDispatcher,
} = require('undici');
const schedule = require('../util/prod/schedule');
const optionsParser = require('../util/prod/optionsParser');
const { at } = require('@nodevu/fixtures');
const scheduleSnapshot = require('@nodevu/fixtures/data/schedule.json');
const now = require('@nodevu/fixtures/data/now.json');

// checks that verify the result of data returned
/** @param {import('../util/prod/schedule').Schedule} data */
function check(data) {
	for (const metadata of Object.values(data)) {
		for (const [metadataKey, metadataValue] of Object.entries(metadata)) {
			// every value is a date except codename, which is empty for
			// release lines that never had LTS
			const valuePattern =
				metadataKey === 'codename' ? /^([A-Z][a-z]+)?$/ : /^\d{4}-\d{2}-\d{2}$/;

			match(metadataValue, valuePattern);
		}
	}
}

const url =
	'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json';

// undici's fetch goes through this mock instead of the network: it serves
// each intercept() once and refuses any other request
const agent = new MockAgent();

agent.disableNetConnect();

setGlobalDispatcher(agent);

describe('under normal conditions, schedule should work', async () => {
	it('should work with default options', async (t) => {
		const fetch = t.mock.method(globalThis, 'fetch', at(now).fetch);

		const data = await schedule({
			fetch: globalThis.fetch,
			urls: { schedule: url },
		});

		check(data);
		deepStrictEqual(requested(fetch), [url]);
	});

	it('should work with Undici fetch', async () => {
		intercept();

		const data = await schedule({
			fetch: undiciFetch,
			urls: { schedule: url },
		});

		check(data);
		agent.assertNoPendingInterceptors();
	});
});

describe('schedule should work with optionsParser', async () => {
	it('should work with the default output of optionsParser', async (t) => {
		const fetch = t.mock.method(globalThis, 'fetch', at(now).fetch);

		const parsedOptions = optionsParser({});
		const data = await schedule(parsedOptions);

		check(data);
		deepStrictEqual(requested(fetch), [url]);
	});

	it('should work with a different fetch passed to optionsParser', async () => {
		intercept();

		const parsedOptions = optionsParser({
			fetch: undiciFetch,
		});

		const data = await schedule(parsedOptions);

		check(data);
		agent.assertNoPendingInterceptors();
	});
});

describe('schedule', async () => {
	it('should reject naming the URL and status when the response is not ok', async () => {
		// Arrange
		const url =
			'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json';

		// Act
		const result = schedule({ fetch: notFound, urls: { schedule: url } });

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

// the URLs a mocked `fetch` was called with
/** @param {import('node:test').Mock<typeof globalThis.fetch>} mock */
function requested(mock) {
	return mock.mock.calls.map((call) => call.arguments[0]);
}

// serves the schedule.json snapshot to undici's fetch once
function intercept() {
	agent
		.get('https://raw.githubusercontent.com')
		.intercept({ path: '/nodejs/Release/master/schedule.json' })
		.reply(200, scheduleSnapshot);
}
