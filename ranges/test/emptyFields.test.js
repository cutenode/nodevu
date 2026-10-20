const { deepStrictEqual } = require('node:assert');
const ranges = require('../index');
const { at } = require('./fixtures');
const { describe, it } = require('node:test');

// core's snapshot time, when the Current line hasn't had a security release yet
const snapshotNow = JSON.parse(require('../../core/test/data/static/now.json'));

describe('fields without a value should be undefined, not "undefined"', async () => {
	it('should leave out the security fields of a Current line without security releases', async () => {
		const data = await ranges(undefined, at(snapshotNow));

		deepStrictEqual(data.current.versions, ['v25.1.0', 'v25.0.0']);
		deepStrictEqual(data.current.oldestSecurity, undefined);
		deepStrictEqual(data.current.newestSecurity, undefined);
		deepStrictEqual(JSON.parse(JSON.stringify(data.current)), {
			versions: ['v25.1.0', 'v25.0.0'],
			newest: 'v25.1.0',
			oldest: 'v25.0.0',
		});
	});

	it('should leave out the security fields of an LTS line without security releases', async () => {
		// a date when the only Active LTS line hasn't had a security release
		const data = await ranges(undefined, at('2016-06-01'));

		deepStrictEqual(data['lts/latest'].oldestSecurity, undefined);
		deepStrictEqual(data['lts/latest'].newestSecurity, undefined);
		deepStrictEqual(data['lts/latest'].oldestLts, '4.2.0');
		deepStrictEqual(data['lts/latest'].newestLts, '4.4.5');
		deepStrictEqual(data['lts/active'].newestSecurity, undefined);
	});

	it('should only take the security fields from the first Current line', async () => {
		// a date when the newest Current line has no security releases, but an
		// older line also in "current" (one with no LTS or maintenance dates in
		// schedule.json) has one
		const data = await ranges('current', at('2016-06-23'));

		deepStrictEqual(data.current.newest, 'v6.2.2');
		deepStrictEqual(data.current.versions.includes('v0.12.15'), true);
		deepStrictEqual(data.current.oldestSecurity, undefined);
		deepStrictEqual(data.current.newestSecurity, undefined);
	});

	it('should leave out the LTS and security fields when the data has none', async () => {
		// made-up data, since the real data always has these by the time a line
		// is LTS: neither line has security releases, and the newest release of
		// each line isn't marked as LTS, so core has no `support.lts.newest`
		const release = (version, date, lts = false) => ({
			version,
			date,
			lts,
			files: ['linux-x64', 'src'],
		});
		const index = [
			release('v99.1.0', '2099-11-01'),
			release('v99.0.0', '2099-10-25', 'Placeholder'),
			release('v98.1.0', '2098-11-01'),
			release('v98.0.0', '2098-10-25', 'Placeholder'),
		];
		const schedule = {
			v98: {
				start: '2098-04-20',
				lts: '2098-10-20',
				maintenance: '2099-10-20',
				end: '2101-04-30',
				codename: '',
			},
			v99: {
				start: '2099-04-20',
				lts: '2099-10-20',
				maintenance: '2100-10-20',
				end: '2102-04-30',
				codename: '',
			},
		};
		// round-tripping through JSON to check what ends up in the output
		const data = JSON.parse(
			JSON.stringify(
				await ranges(undefined, at('2099-12-01', { index, schedule })),
			),
		);

		deepStrictEqual(data['lts/latest'], {
			versions: ['v99.0.0'],
			oldestLts: '99.0.0',
			newest: 'v99.0.0',
			oldest: 'v99.0.0',
		});
		deepStrictEqual(data['lts/maintenance'], {
			versions: ['v98.0.0'],
			oldestLts: '98.0.0',
			newest: 'v98.0.0',
			oldest: 'v98.0.0',
		});
		deepStrictEqual(data['lts/active'], {
			versions: ['v99.0.0', 'v98.0.0'],
			oldestLts: '98.0.0',
			newest: 'v99.0.0',
			oldest: 'v98.0.0',
		});
	});

	it('should never have "undefined" as a value', async () => {
		for (const now of [
			'2016-06-01',
			'2018-01-01',
			'2020-01-01',
			'2024-01-01',
			'2025-09-01',
			snapshotNow,
		]) {
			const data = await ranges(undefined, at(now));
			for (const range in data) {
				for (const field in data[range]) {
					deepStrictEqual(
						data[range][field] === 'undefined',
						false,
						`${now} ${range}.${field}`,
					);
				}
			}
		}
	});
});
