const assert = require('node:assert');
const { describe, it } = require('node:test');
const fc = require('fast-check');
const aliases = require('@nodevu/aliases');

const translate = require('../index');

/** @type {Parameters<typeof translate>[0][]} */
const terms = ['current', 'lts_latest', 'lts', 'supported', 'all'];

describe('translate', () => {
	it('should reject a name inherited from Object.prototype', async () => {
		// Arrange
		const name = 'toString';

		// Act
		// @ts-expect-error: the types only take terms, and this checks a caller
		// that ignores them
		const result = translate(name);

		// Assert
		await assert.rejects(result, { message: 'Unknown value: toString' });
	});

	it('should not let a caller change what later calls return', async () => {
		// Arrange
		// @ts-expect-error: the types only allow the term's own aliases, and this
		// checks a caller that adds another
		(await translate('lts')).push('eol');

		// Act
		const result = await translate('lts');

		// Assert
		assert.deepStrictEqual(result, ['lts/active', 'lts/maintenance']);
	});

	it("should never resolve a value that isn't a Package Support term", async () => {
		await fc.assert(
			fc.asyncProperty(notTermArbitrary(), async (value) => {
				// Arrange (by the arbitrary)

				// Act
				// @ts-expect-error: the types only take terms, and this checks a caller
				// that ignores them
				const result = translate(value);

				// Assert
				await assert.rejects(result, { message: `Unknown value: ${value}` });
			}),
		);
	});

	it('should always resolve a term to aliases from @nodevu/aliases', async () => {
		await fc.assert(
			fc.asyncProperty(fc.constantFrom(...terms), async (term) => {
				// Arrange (by the arbitrary)

				// Act
				const result = await translate(term);

				// Assert
				assert.ok(
					result.every((alias) => aliases.includes(alias)),
					result.join(', '),
				);
			}),
		);
	});
});

// Helpers

/** Any string, weighted toward names on Object.prototype, but not a term. */
function notTermArbitrary() {
	return fc
		.oneof(
			fc.string(),
			fc.constantFrom(...Object.getOwnPropertyNames(Object.prototype)),
		)
		.filter((value) => !(/** @type {string[]} */ (terms).includes(value)));
}
