const { deepStrictEqual } = require('node:assert');
const nodevu = require('../index');
const { describe, it } = require('node:test');

// these tests use made-up data that follows the release schedule starting with
// 27.x, where every release line gets Alpha releases (versioned as
// `vN.0.0-alpha.X.Y.Z`) before its first Current release.
//
// see https://nodejs.org/en/blog/announcements/evolving-the-nodejs-release-schedule
function release(version, date) {
	return { version, date, files: ['linux-x64', 'src'] };
}

const index = [
	release('v27.0.0', '2027-04-22'),
	release('v27.0.0-alpha.1.0.0', '2026-12-08'),
	release('v27.0.0-alpha.0.0.0', '2026-10-28'),
	release('v26.12.0', '2026-10-14'),
];

// 26.x follows the previous release schedule, while 27.x gets an Alpha phase
// and goes straight from Current to LTS, without a maintenance phase
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

async function mockFetch(url) {
	return Response.json(url.endsWith('schedule.json') ? schedule : index);
}

describe('check to make sure that Alpha releases work as expected', async () => {
	it('should have every Alpha release, with its full version', async () => {
		const data = await nodevu({ fetch: mockFetch });

		deepStrictEqual(Object.keys(data.v27.releases), [
			'v27.0.0',
			'v27.0.0-alpha.1.0.0',
			'v27.0.0-alpha.0.0.0',
		]);
		deepStrictEqual(data.v27.releases['v27.0.0'].releaseDate, '2027-04-22');
		deepStrictEqual(data.v27.releases['v27.0.0-alpha.1.0.0'].semver, {
			raw: '27.0.0-alpha.1.0.0',
			major: 27,
			minor: 0,
			patch: 0,
			line: 'v27',
		});
	});

	it('should have correct values for alpha in every release', async () => {
		const data = await nodevu({ fetch: mockFetch });

		deepStrictEqual(data.v27.releases['v27.0.0'].alpha.isAlpha, false);
		deepStrictEqual(
			data.v27.releases['v27.0.0-alpha.1.0.0'].alpha.isAlpha,
			true,
		);
		deepStrictEqual(
			data.v27.releases['v27.0.0-alpha.0.0.0'].alpha.isAlpha,
			true,
		);
		deepStrictEqual(data.v26.releases['v26.12.0'].alpha.isAlpha, false);
	});

	it('should have correct files for an Alpha release', async () => {
		const data = await nodevu({ fetch: mockFetch });

		const { linux, source } =
			data.v27.releases['v27.0.0-alpha.1.0.0'].files.links;

		deepStrictEqual(linux[0].files, [
			'node-v27.0.0-alpha.1.0.0-linux-x64.tar.gz',
			'node-v27.0.0-alpha.1.0.0-linux-x64.tar.xz',
		]);
		deepStrictEqual(source[0].files, [
			'node-v27.0.0-alpha.1.0.0.tar.gz',
			'node-v27.0.0-alpha.1.0.0.tar.xz',
		]);
	});

	it('should have correct support values for a release line with an Alpha phase', async () => {
		const data = await nodevu({ fetch: mockFetch });

		deepStrictEqual(data.v27.support.phases.dates.alpha, '2026-10-28');
		deepStrictEqual(data.v26.support.phases.dates.alpha, undefined);
	});

	it('should have correct dynamic values for support in a release line with an Alpha phase', async () => {
		const phases = [
			['2026-12-15', 'alpha', 'lts'],
			['2027-05-01', 'start', 'lts'],
			['2027-11-01', 'lts', 'maintenance'],
			['2030-05-01', 'end', 'end'],
		];

		for (const [now, v27, v26] of phases) {
			const data = await nodevu({ fetch: mockFetch, now });

			deepStrictEqual(data.v27.support.phases.current, v27, now);
			deepStrictEqual(data.v26.support.phases.current, v26, now);
		}
	});
});
