const { deepStrictEqual } = require('node:assert');
const nodevu = require('../index');
const { describe, it, beforeEach } = require('test');

const beforeEachTemplate = require('../util/dev/beforeEachTemplate');

describe('check to make sure that changing sources works as expected', async () => {
	beforeEach(beforeEachTemplate);

	// failing
	it('should still return valid data when the index is a different URL from the default', async () => {
		const urls = {
			index: 'https://bnb.im/dist/index.json',
		};
		const staticData = await nodevu({ urls });
		deepStrictEqual(
			staticData.v17.releases['v17.0.0'].dependencies.npm,
			'8.1.0',
		);
		deepStrictEqual(staticData.v14.support.codename, 'Fermium');
		deepStrictEqual(staticData.v8.support.phases.current, 'end');
	});

	// failing
	it('should still return valid data when the schedule is a different URL from the default', async () => {
		const urls = {
			schedule: 'https://bnb.im/dist/schedule.json',
		};
		const staticData = await nodevu({ urls });
		deepStrictEqual(
			staticData.v17.releases['v17.0.0'].dependencies.v8,
			'9.5.172.21',
		);
		deepStrictEqual(staticData.v14.support.lts.newest, '14.21.3');
		deepStrictEqual(staticData.v9.support.phases.current, 'end');
	});
});
