const assert = require('node:assert');
const translate = require('../index');
const { describe, it } = require('node:test');

describe('test that translating an unknown value fails', async () => {
	it('should throw when passed a value that is not a Package Support term', async () => {
		await assert.rejects(translate('lts/latest'), {
			message: 'Unknown value: lts/latest',
		});
	});
});
