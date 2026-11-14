const assert = require('node:assert');
const { describe, it } = require('node:test');
const fc = require('fast-check');
const { DateTime } = require('luxon');
const nodevu = require('../index');
const { at } = require('@nodevu/fixtures');
const snapshot = require('@nodevu/fixtures/data/schedule.json');

const phases = /** @type {const} */ ([
	'alpha',
	'start',
	'lts',
	'maintenance',
	'end',
]);

const lines = ['v20', 'v21', 'v22'];

// one release per line
const index = lines.map((line) => ({
	version: `${line}.0.0`,
	date: '2000-01-01',
	files: ['src'],
}));

describe('core on a generated schedule.json', async () => {
	it('should be in the latest phase that has begun, whatever the schedule holds', async () => {
		await fc.assert(
			fc.asyncProperty(schedule(), date(), async (generated, now) => {
				// Arrange
				const options = at('2027-01-01', { index, schedule: generated });

				// Act
				const data = await nodevu({ ...options, now });

				// Assert
				for (const line of lines) {
					const support = data[line].support;

					if (generated[line]?.start === undefined) {
						assert.strictEqual(support, undefined, line);
						continue;
					}

					assert.ok(support, line);

					const begun = phases.filter((phase) => {
						const start = DateTime.fromISO(support.phases.dates[phase] ?? '');

						return start.isValid && start <= DateTime.fromISO(now);
					});

					assert.deepStrictEqual(
						support.phases.current,
						begun.at(-1) ?? {},
						`${line}: ${JSON.stringify(generated[line])} on ${now}`,
					);
					assert.strictEqual(support.codename, generated[line].codename);

					for (const phase of phases) {
						assert.strictEqual(
							support.phases.dates[phase],
							generated[line][phase],
							line,
						);
					}
				}
			}),
		);
	});

	it('should give the same phases for one moment written in any zone', async () => {
		// the days a phase starts on, where a moment read in the wrong zone
		// lands in the wrong phase
		const starts = Object.values(snapshot)
			.flatMap((line) => Object.values(line))
			.filter(
				(value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && value <= '2026-10-01',
			);

		await fc.assert(
			fc.asyncProperty(
				fc.oneof(day(), fc.constantFrom(...starts)),
				zone(),
				async (now, zone) => {
					// Arrange
					const zoned = DateTime.fromISO(now).setZone(zone);
					const options = at(now);

					// Act
					const results = await Promise.all(
						[now, zoned, String(zoned.toISO())].map((written) =>
							nodevu({ ...options, now: written }),
						),
					);

					// Assert
					const [expected, ...others] = results.map((data) =>
						Object.fromEntries(
							Object.entries(data).map(([line, { support }]) => [
								line,
								support?.phases.current,
							]),
						),
					);

					for (const other of others) {
						assert.deepStrictEqual(other, expected);
					}
				},
			),
		);
	});
});

// Helpers

// a day, as YYYY-MM-DD
function day() {
	return fc
		.date({
			min: new Date('2009-06-01'),
			max: new Date('2026-10-01'),
			noInvalidDate: true,
		})
		.map((date) => date.toISOString().slice(0, 10));
}

// a day, or a moment with a time and an offset
function date() {
	return fc.oneof(
		day(),
		fc
			.tuple(day(), fc.integer({ min: 0, max: 86_399 }), zone())
			.map(([on, seconds, zone]) =>
				String(DateTime.fromISO(on, { zone }).plus({ seconds }).toISO()),
			),
	);
}

function zone() {
	return fc.constantFrom(
		'UTC',
		'America/New_York',
		'Asia/Kolkata',
		'Pacific/Chatham',
		'UTC+14',
		'UTC-12',
	);
}

// a schedule.json for each line, with phases missing, out of order, written
// with times and offsets, or unreadable
function schedule() {
	const phaseDate = fc.oneof(date(), fc.string());

	return fc.dictionary(
		fc.constantFrom(...lines),
		fc.record(
			{
				alpha: phaseDate,
				start: phaseDate,
				lts: phaseDate,
				maintenance: phaseDate,
				end: phaseDate,
				codename: fc.string(),
			},
			{ requiredKeys: [] },
		),
	);
}
