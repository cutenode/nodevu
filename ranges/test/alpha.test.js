const { deepStrictEqual } = require('node:assert');
const ranges = require('../index');
const fixtures = require('./fixtures');
const { describe, it } = require('node:test');

// these tests use made-up data that follows the release schedule starting with
// 27.x, where every release line gets Alpha releases (versioned as
// `vN.0.0-alpha.X.Y.Z`) before its first Current release.
//
// see https://nodejs.org/en/blog/announcements/evolving-the-nodejs-release-schedule
function release(version, date, lts = false) {
	return { version, date, lts, files: ['linux-x64', 'src'] };
}

const index = [
	release('v27.2.0', '2027-10-20', 'Placeholder'),
	release('v27.1.0', '2027-06-01'),
	release('v27.0.0', '2027-04-22'),
	release('v27.0.0-alpha.1.0.0', '2026-12-08'),
	release('v27.0.0-alpha.0.0.0', '2026-10-28'),
	release('v26.13.0', '2026-10-28', 'Placeholder'),
	release('v26.12.0', '2026-10-14'),
];

// 27.x goes alpha -> start -> lts -> end, with no maintenance phase. the real
// schedule.json lists 27.x's lts date as `maintenance` until
// https://github.com/nodejs/Release/pull/1188 lands.
const schedule = {
	v26: {
		start: '2026-05-05',
		lts: '2026-10-28',
		maintenance: '2027-10-20',
		end: '2029-04-30',
		codename: '',
	},
	v27: {
		alpha: '2026-10-28',
		start: '2027-04-22',
		lts: '2027-10-20',
		end: '2030-04-30',
		codename: '',
	},
};

// serves the made-up data above instead of core's snapshots
const at = (now) => fixtures.at(now, { index, schedule });

describe('check to make sure that Alpha releases work as expected', async () => {
	it('should leave Alpha releases out of "all"', async () => {
		const data = await ranges('all', at('2026-12-15'));

		deepStrictEqual(data.all.versions, ['v26.13.0', 'v26.12.0']);
		deepStrictEqual(data.all.newest, 'v26.13.0');
		deepStrictEqual(data.all.oldest, 'v26.12.0');
	});

	it('should have the Alpha releases in "alpha" during the Alpha phase', async () => {
		deepStrictEqual(await ranges('alpha', at('2026-12-15')), {
			alpha: {
				versions: ['v27.0.0-alpha.1.0.0', 'v27.0.0-alpha.0.0.0'],
				newest: 'v27.0.0-alpha.1.0.0',
				oldest: 'v27.0.0-alpha.0.0.0',
			},
		});

		const data = await ranges(undefined, at('2026-12-15'));
		deepStrictEqual(data.alpha.versions, [
			'v27.0.0-alpha.1.0.0',
			'v27.0.0-alpha.0.0.0',
		]);
	});

	it('should not have "alpha" outside of the Alpha phase', async () => {
		for (const now of ['2026-10-20', '2027-05-01', '2027-11-01']) {
			deepStrictEqual(await ranges('alpha', at(now)), {}, now);
			deepStrictEqual((await ranges(undefined, at(now))).alpha, undefined, now);
		}
	});

	it('should leave Alpha releases out of "current" once the release line is Current', async () => {
		const data = await ranges(undefined, at('2027-05-01'));

		deepStrictEqual(data.current.versions, ['v27.0.0']);
		deepStrictEqual(data.current.newest, 'v27.0.0');
		deepStrictEqual(data.all.newest, 'v27.0.0');
	});

	it('should leave Alpha releases out of the LTS ranges once the release line is LTS', async () => {
		const data = await ranges(undefined, at('2027-11-01'));

		deepStrictEqual(data['lts/latest'].versions, ['v27.2.0']);
		deepStrictEqual(data['lts/active'].versions, ['v27.2.0', 'v26.13.0']);
		deepStrictEqual(data['lts/maintenance'].versions, ['v26.13.0']);
	});

	it('should leave Alpha releases out of "eol" once the release line is End of Life', async () => {
		const data = await ranges('eol', at('2030-05-01'));

		deepStrictEqual(data.eol.versions, [
			'v27.2.0',
			'v27.1.0',
			'v27.0.0',
			'v26.13.0',
			'v26.12.0',
		]);
	});
});
