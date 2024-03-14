const dns = require('node:dns');
const { MockAgent, setGlobalDispatcher } = require('undici');

const staticIndex = require('../../test/data/static/index.json');
const staticSchedule = require('../../test/data/static/schedule.json');

function beforeEachTemplate() {
	// this fixes a bug in Node.js - it should be fixed _eventually_ and can be removed: https://github.com/nodejs/undici/issues/1248
	dns.setDefaultResultOrder('ipv4first');

	// this mock agent stuff isn't actually working for... some unkown reason
	const mockAgent = new MockAgent();
	mockAgent.disableNetConnect();
	setGlobalDispatcher(mockAgent);

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

	const customIndexMock = mockAgent.get('https://bnb.im');
	customIndexMock
		.intercept({ path: '/dist/index.json' })
		.reply(200, staticIndex);

	const customScheduleMock = mockAgent.get('https://bnb.im');
	customScheduleMock
		.intercept({ path: '/dist/schedule.json' })
		.reply(200, staticSchedule);
}

module.exports = beforeEachTemplate;
