const assert = require('node:assert');
const { describe, it } = require('node:test');
const fc = require('fast-check');
const nodevu = require('../index');
const { at } = require('@nodevu/fixtures');

describe('versions index.json lists more than once', async () => {
	it('should only keep the first entry for a version', async () => {
		await fc.assert(
			fc.asyncProperty(
				fc.uniqueArray(release(), {
					minLength: 1,
					maxLength: 10,
					selector: (entry) => entry.version,
				}),
				fc.array(fc.tuple(fc.nat(), fc.nat(), fc.boolean(), release()), {
					minLength: 1,
					maxLength: 5,
				}),
				async (firsts, repeats) => {
					// Arrange
					const index = [...firsts];

					for (const [which, position, dropV, fields] of repeats) {
						const first = firsts[which % firsts.length];
						const after = index.indexOf(first) + 1;
						const version = dropV ? first.version.slice(1) : first.version;

						index.splice(after + (position % (index.length - after + 1)), 0, {
							...fields,
							version,
						});
					}

					// Act
					const data = await nodevu(at('2027-01-01', { index, schedule: {} }));

					// Assert
					const expected = await nodevu(
						at('2027-01-01', { index: firsts, schedule: {} }),
					);

					assert.deepStrictEqual(data, expected);
				},
			),
		);
	});
});

// Helpers

function release() {
	return fc.record({
		version: fc
			.tuple(
				fc.integer({ min: 1, max: 3 }),
				fc.nat({ max: 2 }),
				fc.nat({ max: 2 }),
			)
			.map((parts) => `v${parts.join('.')}`),
		date: fc.constantFrom('2020-01-01', '2021-01-01'),
		lts: fc.oneof(fc.constant(false), fc.constant('Argon')),
		security: fc.boolean(),
		files: fc.subarray(['src', 'headers', 'linux-x64']),
	});
}
