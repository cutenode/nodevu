const assert = require('node:assert');
const { newest, lts, security } = require('../index');
const { describe, it } = require('node:test');
const fixtures = require('../../core/util/dev/fixtures');

// the day core's snapshot was taken (see now.json), so every release in it is
// out, and releases a later snapshot refresh adds get filtered out, so the
// expected values don't move
const at = (now = '2025-10-30') => fixtures.at(now);

describe('check v10', async () => {
	describe('running newest', async () => {
		it('should return the correct security version for v10', async () => {
			const data = await newest('v10', 'security', at());
			assert.equal(data, '10.24.1');
		});

		it('should return the correct lts version for v10', async () => {
			const data = await newest('v10', 'lts', at());
			assert.equal(data, '10.24.1');
		});
	});

	describe('running security', async () => {
		it('should return the correct security version for v10', async () => {
			const data = await security('v10', at());
			assert.equal(data, '10.24.1');
		});
	});

	describe('running lts', async () => {
		it('should return the correct lts version for v10', async () => {
			const data = await lts('v10', at());
			assert.equal(data, '10.24.1');
		});
	});
});

// the snapshot has releases from after these dates, so these fail if
// `options` doesn't reach core
describe('check v24 at different dates', async () => {
	it('should return undefined for lts before the first LTS release', async () => {
		assert.strictEqual(await lts('v24', at('2025-10-27')), undefined);
	});

	it('should return the correct lts version once v24 is LTS', async () => {
		assert.strictEqual(await newest('v24', 'lts', at()), '24.11.0');
	});

	it('should return the newest security release out by now', async () => {
		assert.strictEqual(await security('v24', at('2025-07-14')), '24.0.2');
		assert.strictEqual(await security('v24', at()), '24.4.1');
	});
});

describe('check missing data', async () => {
	it('should return undefined for lts on a release line without LTS', async () => {
		// an odd line, which schedule.json lists without an lts date
		assert.strictEqual(await newest('v25', 'lts', at()), undefined);
		// an old unstable line that isn't in schedule.json at all
		assert.strictEqual(await lts('v0.11', at()), undefined);
	});

	it('should return undefined for a release line that does not exist', async () => {
		assert.strictEqual(await newest('v999', 'lts', at()), undefined);
		assert.strictEqual(await newest('v999', 'security', at()), undefined);
		// names that exist on Object.prototype aren't release lines either
		assert.strictEqual(await security('toString', at()), undefined);
	});

	it('should return undefined for security on a release line without security releases', async () => {
		assert.strictEqual(await security('v5', at()), undefined);
	});
});
