const assert = require('node:assert');
const nodevu = require('../index');
const { describe, it, beforeEach } = require('node:test');

const beforeEachTemplate = require('../util/dev/beforeEachTemplate');

// these are tests that run with static data but do not need to be frozen in time.
describe('check that we get the values we expect from values that should not ever change', async () => {
	beforeEach(beforeEachTemplate);

	it('should have some correct values for release date', async () => {
		const staticData = await nodevu();
		assert.deepStrictEqual(
			staticData.v20.releases['v20.2.0'].releaseDate,
			'2023-05-16',
		);
		assert.deepStrictEqual(
			staticData.v9.releases['v9.5.0'].releaseDate,
			'2018-01-31',
		);
		assert.deepStrictEqual(
			staticData['v0.1'].releases['v0.1.14'].releaseDate,
			'2011-08-26',
		);
	});

	it('should have some correct values for modules', async () => {
		const staticData = await nodevu();
		assert.deepStrictEqual(
			staticData.v20.releases['v20.2.0'].modules.version,
			'115',
		);
		assert.deepStrictEqual(
			staticData.v10.releases['v10.20.1'].modules.version,
			'64',
		);
		assert.deepStrictEqual(
			staticData['v0.2'].releases['v0.2.0'].modules.version,
			'1',
		);
		assert.deepStrictEqual(
			staticData['v0.1'].releases['v0.1.14'].modules.version,
			undefined,
		);
	});

	it('should have some correct values for Node.js dependencies', async () => {
		const staticData = await nodevu();
		assert.deepStrictEqual(
			staticData.v17.releases['v17.0.0'].dependencies.npm,
			'8.1.0',
		);
		assert.deepStrictEqual(
			staticData.v17.releases['v17.0.0'].dependencies.v8,
			'9.5.172.21',
		);
		assert.deepStrictEqual(
			staticData.v17.releases['v17.0.0'].dependencies.uv,
			'1.42.0',
		);
		assert.deepStrictEqual(
			staticData.v17.releases['v17.0.0'].dependencies.zlib,
			'1.2.11',
		);
		assert.deepStrictEqual(
			staticData.v17.releases['v17.0.0'].dependencies.openssl,
			'3.0.0+quic',
		);
	});

	it('should have some correct static values for support in a release line', async () => {
		const staticData = await nodevu();
		assert.deepStrictEqual(staticData.v14.support.codename, 'Fermium');
		assert.deepStrictEqual(staticData.v14.support.lts.newest, '14.21.3');
		assert.deepStrictEqual(staticData.v14.support.lts.oldest, '14.15.0');
		assert.deepStrictEqual(
			staticData.v14.support.phases.dates.start,
			'2020-04-21',
		);
		assert.deepStrictEqual(
			staticData.v14.support.phases.dates.lts,
			'2020-10-27',
		);
		assert.deepStrictEqual(
			staticData.v14.support.phases.dates.maintenance,
			'2021-10-19',
		);
		assert.deepStrictEqual(
			staticData.v14.support.phases.dates.end,
			'2023-04-30',
		);
	});

	it('should have correct support values for an odd release line', async () => {
		const staticData = await nodevu();
		assert.deepStrictEqual(
			staticData.v13.support.phases.dates.start,
			'2019-10-22',
		);
		assert.deepStrictEqual(
			staticData.v13.support.phases.dates.maintenance,
			'2020-04-01',
		);
		assert.deepStrictEqual(
			staticData.v13.support.phases.dates.end,
			'2020-06-01',
		);
	});

	it('should have correct support values for a security ', async () => {
		const staticData = await nodevu();
		const v12AllSecurityReleases = [
			'12.22.11',
			'12.22.9',
			'12.22.7',
			'12.22.6',
			'12.22.5',
			'12.22.4',
			'12.22.2',
			'12.22.1',
			'12.21.0',
			'12.19.1',
			'12.18.4',
			'12.18.0',
			'12.15.0',
			'12.14.0',
			'12.8.1',
		];
		assert.deepStrictEqual(staticData.v12.security.all, v12AllSecurityReleases);
		assert.deepStrictEqual(staticData.v12.security.newest, '12.22.11');
		assert.deepStrictEqual(staticData.v12.security.oldest, '12.8.1');
	});
});
