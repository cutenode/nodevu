const dns = require('node:dns');
const {
	fetch: undiciFetch,
	MockAgent,
	setGlobalDispatcher,
} = require('undici');

const staticIndex = require('../../test/data/static/index.json');
const staticSchedule = require('../../test/data/static/schedule.json');

function beforeEachTemplate() {
	// this fixes a bug in Node.js - it should be fixed _eventually_ and can be removed: https://github.com/nodejs/undici/issues/1248
	dns.setDefaultResultOrder('ipv4first');

	const mockAgent = new MockAgent();
	mockAgent.disableNetConnect();
	setGlobalDispatcher(mockAgent);

	// Node.js's built-in globalThis.fetch uses a bundled copy of undici separate from
	// the npm package, so setGlobalDispatcher above doesn't affect it. Replacing it here
	// ensures all fetch calls (including those that fall through to globalThis.fetch in
	// optionsParser) go through the mock dispatcher.
	globalThis.fetch = undiciFetch;

	const defaultIndexMock = mockAgent.get('https://nodejs.org');
	defaultIndexMock
		.intercept({ path: '/dist/index.json' })
		.reply(200, staticIndex);

	const defaultScheduleMock = mockAgent.get(
		'https://raw.githubusercontent.com',
	);
	defaultScheduleMock
		.intercept({ path: '/nodejs/Release/master/schedule.json' })
		.reply(200, staticSchedule);

	const customMock = mockAgent.get('https://bnb.im');
	customMock.intercept({ path: '/dist/index.json' }).reply(200, staticIndex);
	customMock
		.intercept({ path: '/dist/schedule.json' })
		.reply(200, staticSchedule);
}

module.exports = beforeEachTemplate;
