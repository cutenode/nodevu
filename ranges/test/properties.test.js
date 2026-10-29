const { deepStrictEqual, match } = require('node:assert');
const aliases = require('@nodevu/aliases');
const fc = require('fast-check');
const ranges = require('../index');
const { at } = require('./fixtures');
const index = require('../../core/test/data/static/index.json');
const schedule = require('../../core/test/data/static/schedule.json');
const { describe, it } = require('node:test');

// an LTS bound from @nodevu/core, a version without a `v`, like 20.9.0
const ltsVersion = /^\d+\.\d+\.\d+$/;

describe('generateRanges', () => {
	it('should give the same ranges for any filter as it does for "all"', async () => {
		await fc.assert(
			fc.asyncProperty(
				day(),
				// a filter with "all" in it is the same as "all", so it'd check nothing
				fc.subarray(
					aliases.filter((alias) => alias !== 'all'),
					{ minLength: 1 },
				),
				async (now, filter) => {
					// Arrange
					const everything = await ranges('all', at(now));

					// Act
					const data = await ranges(filter, at(now));

					// Assert
					for (const alias in data) {
						deepStrictEqual(data[alias], everything[alias], alias);
					}
				},
			),
			{ numRuns: 50 },
		);
	});

	it('should only give the requested ranges, unless "all" is requested', async () => {
		await fc.assert(
			fc.asyncProperty(
				day(),
				fc.subarray(aliases, { minLength: 1 }),
				async (now, filter) => {
					// Act
					const data = await ranges(filter, at(now));

					// Assert
					const unrequested = Object.keys(data).filter(
						(alias) => !filter.includes(alias),
					);

					deepStrictEqual(filter.includes('all') ? [] : unrequested, []);
				},
			),
			{ numRuns: 50 },
		);
	});

	it('should give every range a newest and oldest from its versions, and never empty versions', async () => {
		await fc.assert(
			fc.asyncProperty(day(), async (now) => {
				// Act
				const data = await ranges('all', at(now));

				// Assert
				for (const [alias, range] of Object.entries(data)) {
					deepStrictEqual(range.versions.length > 0, true, alias);
					deepStrictEqual(range.newest, range.versions[0], alias);
					deepStrictEqual(range.oldest, range.versions.at(-1), alias);
				}
			}),
			{ numRuns: 50 },
		);
	});

	it('should make "lts/active" the versions of "lts/latest" then "lts/maintenance"', async () => {
		await fc.assert(
			fc.asyncProperty(day(), async (now) => {
				// Act
				const data = await ranges('all', at(now));

				// Assert
				const versions = versionsOf(data['lts/latest']).concat(
					versionsOf(data['lts/maintenance']),
				);

				deepStrictEqual(versionsOf(data['lts/active']), versions);
			}),
			{ numRuns: 50 },
		);
	});

	it('should always give "lts/active" its LTS bounds', async () => {
		await fc.assert(
			fc.asyncProperty(day(), async (now) => {
				// Act
				const active = (await ranges('lts/active', at(now)))['lts/active'];

				// Assert
				// every release in lts/active is an LTS release, so its lines always
				// have LTS bounds
				if (active) {
					match(active.newestLts, ltsVersion);
					match(active.oldestLts, ltsVersion);
				}
			}),
			{ numRuns: 50 },
		);
	});

	it('should only put versions from "all" in the other ranges', async () => {
		await fc.assert(
			fc.asyncProperty(day(), async (now) => {
				// Act
				const data = await ranges('all', at(now));

				// Assert
				const all = new Set(versionsOf(data.all));

				for (const alias of [
					'current',
					'lts/latest',
					'lts/active',
					'lts/maintenance',
					'eol',
				]) {
					const outside = versionsOf(data[alias]).filter(
						(version) => !all.has(version),
					);

					deepStrictEqual(outside, [], alias);
				}
			}),
			{ numRuns: 50 },
		);
	});

	it('should never put an Alpha release in "all"', async () => {
		await fc.assert(
			fc.asyncProperty(
				day(),
				fc.integer({ min: 26 }),
				fc.uniqueArray(fc.nat(), { minLength: 1 }),
				async (now, major, alphas) => {
					// Arrange
					// the snapshot has no Alpha releases, so this adds a line in its
					// Alpha phase, newer than any in the snapshot
					const options = at(now, withAlphaLine(now, major, alphas));

					// Act
					const data = await ranges('all', options);

					// Assert
					deepStrictEqual(data.alpha.versions.length, alphas.length);
					deepStrictEqual(
						versionsOf(data.all).filter((version) =>
							version.includes('-alpha.'),
						),
						[],
					);
				},
			),
			{ numRuns: 50 },
		);
	});
});

// Helpers

// any day from before the snapshot's first release to after its newest,
// as YYYY-MM-DD
function day() {
	return fc
		.date({
			min: new Date('2009-06-01'),
			max: new Date('2026-10-01'),
			noInvalidDate: true,
		})
		.map((date) => date.toISOString().slice(0, 10));
}

// the snapshot's index.json and schedule.json, plus Alpha releases of
// `vMAJOR`, released on `now` and still in the Alpha phase
function withAlphaLine(now, major, alphas) {
	const releases = alphas.map((alpha) => ({
		version: `v${major}.0.0-alpha.${alpha}.0.0`,
		date: now,
		lts: false,
		security: false,
		files: ['linux-x64', 'src'],
	}));

	return {
		index: [...releases, ...index],
		schedule: {
			...schedule,
			[`v${major}`]: { alpha: now, start: '9999-01-01', end: '9999-12-31' },
		},
	};
}

// a range's versions, or none when it's left out
function versionsOf(range) {
	return range?.versions ?? [];
}
