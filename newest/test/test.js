const assert = require('node:assert');
const { newest, lts, security } = require('../index');
const { describe, it } = require('node:test');

describe('check v10', async () => {
	describe('running newest', async () => {
		it('should return the correct security version for v10', async () => {
			const data = await newest('v10', 'security');
			assert.equal(data, '10.24.1');
		});

		it('should return the correct lts version for v10', async () => {
			const data = await newest('v10', 'lts');
			assert.equal(data, '10.24.1');
		});
	});

	describe('running security', async () => {
		it('should return the correct security version for v10', async () => {
			const data = await security('v10');
			assert.equal(data, '10.24.1');
		});
	});

	describe('running lts', async () => {
		it('should return the correct lts version for v10', async () => {
			const data = await lts('v10');
			assert.equal(data, '10.24.1');
		});
	});
});
