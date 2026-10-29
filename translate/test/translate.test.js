const assert = require('node:assert');
const { describe, it } = require('node:test');

const translate = require('../index');

describe('translate', () => {
	it('should reject a name inherited from Object.prototype', async () => {
		// Arrange
		const name = 'toString';

		// Act
		const result = translate(name);

		// Assert
		await assert.rejects(result, { message: 'Unknown value: toString' });
	});

	it('should not let a caller change what later calls return', async () => {
		// Arrange
		(await translate('lts')).push('eol');

		// Act
		const result = await translate('lts');

		// Assert
		assert.deepStrictEqual(result, ['lts/active', 'lts/maintenance']);
	});
});
