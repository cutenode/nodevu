const assert = require('node:assert');
const { rejects } = require('node:assert');
const { describe, it } = require('node:test');
const fc = require('fast-check');
const { DateTime } = require('luxon');
const semver = require('semver');
const nodevu = require('../index');
const { at } = require('@nodevu/fixtures');

describe('errors while building the data', async () => {
	it('should reject when index.json has a version that cannot be parsed', async () => {
		const index = [{ version: 'not-a-version', files: [] }];

		/** @type {typeof globalThis.fetch} */
		const fetch = async (url) =>
			Response.json(String(url).endsWith('schedule.json') ? {} : index);

		await rejects(nodevu({ fetch, now: '2024-01-01T00:00:00.000Z' }));
	});

	it('should name any version semver cannot read, wherever it is in the index', async () => {
		await fc.assert(
			fc.asyncProperty(
				fc.array(fc.nat({ max: 30 }), { maxLength: 5 }),
				unreadableVersion(),
				fc.nat(),
				async (majors, version, position) => {
					// Arrange
					const index = majors.map((major) => release(`v${major}.0.0`));
					index.splice(position % (index.length + 1), 0, release(version));

					// Act
					const data = nodevu(at('2024-01-01', { index, schedule: {} }));

					// Assert
					await rejects(data, (error) => {
						assert.ok(error instanceof Error);
						assert.ok(!(error instanceof TypeError), error.message);
						assert.ok(
							error.message.includes(JSON.stringify(version)),
							error.message,
						);

						return true;
					});
				},
			),
		);
	});

	it('should name any now that is not a date, before fetching anything', async () => {
		await fc.assert(
			fc.asyncProperty(unreadableNow(), async (now) => {
				// Arrange
				let fetched = false;

				/** @type {typeof globalThis.fetch} */
				const fetch = async () => {
					fetched = true;

					return Response.json([]);
				};

				// Act
				const data = nodevu({ fetch, now: /** @type {string} */ (now) });

				// Assert
				await rejects(data, (error) => {
					assert.ok(error instanceof Error);
					assert.ok(
						error.message.includes(JSON.stringify(String(now))),
						error.message,
					);

					return true;
				});
				assert.strictEqual(fetched, false);
			}),
		);
	});
});

// Helpers

// anything index.json could hold in place of a version that semver.coerce
// returns null for
function unreadableVersion() {
	return fc
		.oneof(
			fc.string(),
			fc.constant(null),
			fc.boolean(),
			fc.array(fc.string()),
			fc.dictionary(fc.string(), fc.string()),
		)
		.filter(
			(version) =>
				semver.coerce(/** @type {string} */ (version), {
					includePrerelease: true,
				}) === null,
		);
}

/** @param {unknown} version */
function release(version) {
	return { version, date: '2024-01-01', files: ['src'] };
}

// a now that luxon can't read as an ISO 8601 date: a string, a JavaScript
// Date (whose string isn't ISO), or an invalid DateTime. An empty string
// means the default, so it's left out
function unreadableNow() {
	return fc.oneof(
		fc.string({ minLength: 1 }).filter((now) => !DateTime.fromISO(now).isValid),
		fc.date({ noInvalidDate: true }),
		fc.constant(DateTime.invalid('generated')),
	);
}
