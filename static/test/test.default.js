const assert = require('node:assert');
const staticData = require('../index');
const { describe, it } = require('node:test');

// always feel free to add more checks here - any addition will help ensure that we're even more solid.
//
// these tests are also generally copy/pasted between the test files - both in this file and in core. why?
// specifically because we want to be sure the data is consistent *and* because we want to be sure that
// the various ways of accessing the data produce consistent results.

function check(data) {
	// releases checks
	assert.deepStrictEqual(
		data.v17.releases['v17.0.0'].dependencies.npm,
		'8.1.0',
	);
	assert.deepStrictEqual(
		data.v17.releases['v17.0.0'].dependencies.v8,
		'9.5.172.21',
	);
	assert.deepStrictEqual(
		data.v16.releases['v16.19.0'].dependencies.npm,
		'8.19.3',
	);
	assert.deepStrictEqual(
		data.v16.releases['v16.19.0'].files.available.length,
		19,
	);
	assert.deepStrictEqual(
		data.v16.releases['v16.19.0'].files.links.macos[0].files[0],
		'node-v16.19.0-darwin-arm64.tar.gz',
	);

	// support checks
	assert.deepStrictEqual(data.v14.support.codename, 'Fermium');
	assert.deepStrictEqual(data.v12.support.lts.newest, '12.22.12');
	assert.deepStrictEqual(data.v9.support.phases.current, 'end');
	assert.deepStrictEqual(data.v8.support.phases.current, 'end');
	// security checks
	assert.deepStrictEqual(data.v12.security.all.length, 15);
	assert.deepStrictEqual(data.v12.security.newest, '12.22.11');
	assert.deepStrictEqual(data.v12.security.oldest, '12.8.1');
}

describe('test some known data in default.json export, being called from the module generically imported', async () => {
	it('should return the correct data for all types', () => {
		check(staticData.default);
	});
});
