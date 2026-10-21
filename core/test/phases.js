const assert = require('node:assert');
const { describe, it } = require('node:test');
const fc = require('fast-check');
const { DateTime } = require('luxon');
const nodevu = require('../index');

const phases = ['alpha', 'start', 'lts', 'maintenance', 'end'];

describe('support.phases.current', async () => {
	it('should always be the newest phase that has begun by now', async () => {
		await fc.assert(
			fc.asyncProperty(fc.gen(), async (g) => {
				// Arrange
				const phaseDates = [
					DateTime.fromJSDate(
						g(fc.date, {
							min: new Date('1970-01-01'),
							max: new Date('2200-01-01'),
							noInvalidDate: true,
						}),
					).startOf('day'),
				];

				for (let i = 1; i < phases.length; i++) {
					phaseDates.push(phaseDates[i - 1].plus({ days: g(daysBetween) }));
				}

				const phase = g(fc.nat, { max: phases.length - 1 });

				const nextPhase = phaseDates[phase + 1];

				const daysInPhase = nextPhase
					? nextPhase.diff(phaseDates[phase], 'days').days
					: g(daysBetween);

				const now = phaseDates[phase].plus({
					days: g(fc.nat, { max: daysInPhase - 1 }),
				});

				const schedule = {
					v30: Object.fromEntries(
						phases.map((name, i) => [name, phaseDates[i].toISODate()]),
					),
				};

				// Act
				const data = await nodevu({
					fetch: async (url) =>
						Response.json(
							url.endsWith('schedule.json')
								? schedule
								: [{ version: 'v30.0.0', files: ['src'], lts: false }],
						),
					now: now.toISODate(),
				});

				// Assert
				assert.strictEqual(data.v30.support.phases.current, phases[phase]);
			}),
		);
	});
});

// Helpers

// phases are at least a day apart, and bounded so every date stays valid
function daysBetween() {
	return fc.integer({ min: 1, max: 5000 });
}
