const assert = require('node:assert');
const nodevu = require('../index');
const { describe, it, beforeEach } = require('node:test');
const undici = require('undici');

const beforeEachTemplate = require('../util/dev/beforeEachTemplate');

/** @param {import('../index').Data} data */
function check(data) {
	assert.ok(data.v14.support?.lts);
	assert.ok(data.v9.support);
	assert.ok(data.v8.support);
	// releases checks
	assert.deepStrictEqual(
		data.v17.releases['v17.0.0'].dependencies.npm,
		'8.1.0',
	);
	assert.deepStrictEqual(
		data.v17.releases['v17.0.0'].dependencies.v8,
		'9.5.172.21',
	);
	// support checks
	assert.deepStrictEqual(data.v14.support.codename, 'Fermium');
	assert.deepStrictEqual(data.v14.support.lts.newest, '14.21.3');
	assert.deepStrictEqual(data.v9.support.phases.current, 'end');
	assert.deepStrictEqual(data.v8.support.phases.current, 'end');
	// security checks
	assert.deepStrictEqual(data.v12.security.all.length, 15);
	assert.deepStrictEqual(data.v12.security.newest, '12.22.11');
	assert.deepStrictEqual(data.v12.security.oldest, '12.8.1');
}

const now = require('./data/static/now.json');

// undici's types only take its own Request class, so they don't match the
// global fetch's type even though it works as one
const undiciFetch = /** @type {typeof fetch} */ (
	/** @type {unknown} */ (undici.fetch)
);

describe('check to make sure that combining options works as expected', async () => {
	beforeEach(beforeEachTemplate);

	it('should work with a different fetch', async () => {
		const staticData = await nodevu({ fetch: undiciFetch });

		check(staticData);
	});

	it('should still return valid data when the index is a different URL from the default while also using static now', async () => {
		const urls = {
			index: 'https://bnb.im/dist/index.json',
		};

		const staticData = await nodevu({ now, urls });

		check(staticData);
	});

	it('should still return valid data when the schedule is a different URL from the default while also using static now', async () => {
		const urls = {
			schedule: 'https://bnb.im/dist/schedule.json',
		};

		const staticData = await nodevu({ now, urls });

		check(staticData);
	});

	it('should still return valid data when the index and the schedule are a different URL from the default while also using static now', async () => {
		const urls = {
			index: 'https://bnb.im/dist/index.json',
			schedule: 'https://bnb.im/dist/schedule.json',
		};

		const staticData = await nodevu({ now, urls });

		check(staticData);
	});
});
