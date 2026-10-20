const assert = require('node:assert');
const { describe, it } = require('node:test');
const nodevu = require('../index');

const now = '2028-01-01';

function release(version, date, lts) {
	return { version, date, files: ['src'], lts };
}

function run(schedule, index) {
	return nodevu({
		fetch: async (url) =>
			Response.json(url.endsWith('schedule.json') ? schedule : index),
		now,
	});
}

// index.json is the source of truth for LTS status, so core shouldn't crash
// when it disagrees with schedule.json
describe('LTS data when schedule.json and index.json disagree', async () => {
	it('should use index.json when the schedule entry has no lts key', async () => {
		const data = await run(
			{
				v27: {
					start: '2027-04-20',
					maintenance: '2027-10-20',
					end: '2030-04-30',
					codename: '',
				},
			},
			[
				release('v27.2.0', '2027-12-01', 'Somename'),
				release('v27.1.0', '2027-11-01', 'Somename'),
				release('v27.0.0', '2027-04-20', false),
			],
		);
		assert.deepStrictEqual(data.v27.support.lts, {
			newest: '27.2.0',
			oldest: '27.1.0',
		});
		assert.deepStrictEqual(data.v27.releases['v27.1.0'].lts.isLts, true);
	});

	it('should use index.json when only older releases are flagged LTS', async () => {
		const data = await run(
			{ v27: { start: '2027-04-20', end: '2030-04-30' } },
			[
				release('v27.1.0', '2027-11-01', false),
				release('v27.0.0', '2027-04-20', 'Somename'),
			],
		);
		assert.deepStrictEqual(data.v27.support.lts, { oldest: '27.0.0' });
	});

	it('should not crash on an LTS release in a line without a schedule entry', async () => {
		const data = await run({}, [release('v28.0.0', '2028-04-20', 'Othername')]);
		assert.deepStrictEqual(data.v28.support, undefined);
		assert.deepStrictEqual(data.v28.releases['v28.0.0'].lts.isLts, true);
	});

	it('should keep the existing output when both sources agree', async () => {
		const data = await run(
			{
				v22: {
					start: '2024-04-24',
					lts: '2024-10-29',
					maintenance: '2025-10-21',
					end: '2027-04-30',
					codename: 'Jod',
				},
				v23: {
					start: '2024-10-16',
					maintenance: '2025-04-01',
					end: '2025-06-01',
				},
			},
			[
				release('v23.0.0', '2024-10-16', false),
				release('v22.11.0', '2024-10-29', 'Jod'),
				release('v22.10.0', '2024-10-16', false),
			],
		);
		assert.deepStrictEqual(data.v23.support.lts, undefined);
		assert.deepStrictEqual(data.v22.support.lts, {
			newest: '22.11.0',
			oldest: '22.11.0',
		});
	});
});
