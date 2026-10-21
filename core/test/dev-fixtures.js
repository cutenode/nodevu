const assert = require('node:assert');
const { describe, it } = require('node:test');
const fc = require('fast-check');
const { at } = require('../util/dev/fixtures');
const schedule = require('./data/static/schedule.json');

describe('at', async () => {
	it('should pass now through as an option', () => {
		// Arrange
		const now = '2025-09-01';

		// Act
		const options = at(now);

		// Assert
		assert.strictEqual(options.now, now);
	});

	it("should serve core's schedule.json snapshot by default", async () => {
		// Arrange
		const { fetch } = at('2025-09-01');

		// Act
		const response = await fetch(
			'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json',
		);

		// Assert
		assert.deepStrictEqual(await response.json(), schedule);
	});

	it('should only serve the releases that were out by now', async () => {
		// Arrange
		const index = [
			{ version: 'v24.8.0', date: '2025-09-10' },
			{ version: 'v24.7.0', date: '2025-08-27' },
		];

		const { fetch } = at('2025-09-01', { index, schedule: {} });

		// Act
		const response = await fetch('https://nodejs.org/dist/index.json');

		// Assert
		assert.deepStrictEqual(await response.json(), [
			{ version: 'v24.7.0', date: '2025-08-27' },
		]);
	});

	it('should throw for any other URL', async () => {
		// Arrange
		const { fetch } = at('2025-09-01');

		// Act
		const response = fetch('https://nodejs.org/dist/v24.7.0/SHASUMS256.txt');

		// Assert
		await assert.rejects(response, /No fixture data/);
	});

	it('should never serve a release from after now', async () => {
		await fc.assert(
			fc.asyncProperty(
				fc.date({
					min: new Date('2009-01-01'),
					max: new Date('2100-01-01'),
					noInvalidDate: true,
				}),
				async (date) => {
					// Arrange
					const now = date.toISOString().slice(0, 10);
					const { fetch } = at(now);

					// Act
					const response = await fetch('https://nodejs.org/dist/index.json');

					// Assert
					const releases = await response.json();
					assert.ok(releases.every((release) => release.date <= now));
				},
			),
		);
	});
});
