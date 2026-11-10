const assert = require('node:assert');
const translate = require('../index');
const { describe, it } = require('node:test');

describe('test that translating an unknown value fails', async () => {
	it('should throw when passed a value that is not a Package Support term', async () => {
		// @ts-expect-error: the types only take terms, and this checks a caller
		// that ignores them
		await assert.rejects(translate('lts/latest'), {
			message: 'Unknown value: lts/latest',
		});
	});
});
