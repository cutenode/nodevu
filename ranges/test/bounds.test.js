const { deepStrictEqual } = require('node:assert');
const ranges = require('../index');
const fixtures = require('./fixtures');
const { describe, it } = require('node:test');

// the LTS and security bounds of lts/maintenance and lts/active come from the
// newest and oldest lines in them, even when those lines have none. the
// expected values come from core's index.json and schedule.json snapshots.
describe('generateRanges', () => {
	it('should take the newest bounds of "lts/active" from "lts/maintenance" when "lts/latest" is empty', async () => {
		// Arrange
		// v20 went into maintenance on 2024-10-22 and v22 goes LTS on 2024-10-29,
		// so no line is in its LTS phase
		const options = fixtures.at('2024-10-23');

		// Act
		const data = await ranges('all', options);

		// Assert
		deepStrictEqual(data['lts/latest'], undefined);
		deepStrictEqual(data['lts/active'].newestLts, '20.18.0');
		deepStrictEqual(data['lts/active'].newestSecurity, '20.15.1');
	});

	it('should take the oldest bounds of "lts/active" from "lts/latest" when "lts/maintenance" is empty', async () => {
		// Arrange
		// v4 is the first LTS line, minted on 2015-10-12
		const options = fixtures.at('2015-10-12');

		// Act
		const data = await ranges('all', options);

		// Assert
		deepStrictEqual(data['lts/maintenance'], undefined);
		deepStrictEqual(data['lts/active'].oldestLts, '4.2.0');
	});

	it('should take the newest bounds of "lts/maintenance" from its newest line and the oldest from its oldest', async () => {
		// Arrange
		// v20 and v18 are both in maintenance
		const options = fixtures.at('2024-10-23');

		// Act
		const data = await ranges('lts/maintenance', options);

		// Assert
		deepStrictEqual(summarize(data['lts/maintenance']), {
			newest: 'v20.18.0',
			oldest: 'v18.12.0',
			newestLts: '20.18.0',
			oldestLts: '18.12.0',
			newestSecurity: '20.15.1',
			oldestSecurity: '18.5.0',
		});
	});

	it('should leave out the newest security bound of "lts/maintenance" when its newest line has none', async () => {
		// Arrange
		// made-up data, since the real data has no maintenance line without a
		// security release: both lines are in maintenance and only v98 has one
		const index = [
			release('v99.1.0', '2099-11-01', 'Placeholder'),
			release('v98.2.0', '2098-12-01', 'Placeholder', true),
			release('v98.1.0', '2098-11-01', 'Placeholder', true),
		];

		const schedule = {
			v98: line('2098'),
			v99: line('2099'),
		};

		const options = fixtures.at('2102-01-01', { index, schedule });

		// Act
		const data = await ranges('lts/maintenance', options);

		// Assert
		deepStrictEqual(data['lts/maintenance'].versions, [
			'v99.1.0',
			'v98.2.0',
			'v98.1.0',
		]);
		deepStrictEqual(data['lts/maintenance'].newestSecurity, undefined);
		deepStrictEqual(data['lts/maintenance'].oldestSecurity, '98.1.0');
	});
});

// Helpers

// a range without its versions, to compare its bounds
function summarize({ versions, ...range }) {
	return range;
}

// an index.json entry
function release(version, date, lts = false, security = false) {
	return { version, date, lts, security, files: ['linux-x64', 'src'] };
}

// a schedule.json entry for a line that's in maintenance from 2101 to 2103
function line(year) {
	return {
		start: `${year}-04-20`,
		lts: `${year}-10-20`,
		maintenance: '2101-01-01',
		end: '2103-04-30',
		codename: '',
	};
}
