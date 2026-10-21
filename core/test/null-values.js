const assert = require('node:assert');
const { describe, it } = require('node:test');
const nodevu = require('../index');

const now = '2028-01-01';

function run(schedule, index) {
	return nodevu({
		fetch: async (url) =>
			Response.json(url.endsWith('schedule.json') ? schedule : index),
		now,
	});
}

// JSON can't hold undefined, so a value index.json or schedule.json doesn't
// know yet could come through as null. core reports those as undefined, the
// same as a missing key.
describe('null values in index.json and schedule.json', async () => {
	it('should report a null release date as undefined', async () => {
		// Arrange
		const index = [
			{ version: 'v28.0.0', date: null, files: ['src'], lts: false },
		];

		// Act
		const data = await run({}, index);

		// Assert
		assert.strictEqual(data.v28.releases['v28.0.0'].releaseDate, undefined);
	});

	it('should report a null start date as undefined', async () => {
		// Arrange
		const schedule = { v28: { start: null, end: '2031-04-30' } };

		// Act
		const data = await run(schedule, [release('v28.0.0')]);

		// Assert
		assert.strictEqual(data.v28.support.phases.dates.start, undefined);
	});

	it('should report a null end date as undefined', async () => {
		// Arrange
		const schedule = { v28: { start: '2027-04-20', end: null } };

		// Act
		const data = await run(schedule, [release('v28.0.0')]);

		// Assert
		assert.strictEqual(data.v28.support.phases.dates.end, undefined);
	});
});

// Helpers

function release(version) {
	return { version, date: '2027-04-20', files: ['src'], lts: false };
}
