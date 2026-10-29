const assert = require('node:assert');
const { describe, it } = require('node:test');
const fc = require('fast-check');
const semver = require('semver');
const nodevu = require('../index');
const { at } = require('../util/dev/fixtures');

const phases = ['alpha', 'start', 'lts', 'maintenance', 'end'];

describe('core', async () => {
	it('should key every release by its raw version, under its own line', async () => {
		await fc.assert(
			fc.asyncProperty(day(), async (now) => {
				// Arrange
				const options = at(now);

				// Act
				const data = await nodevu(options);

				// Assert
				for (const [line, { releases }] of Object.entries(data)) {
					for (const [key, release] of Object.entries(releases)) {
						assert.strictEqual(release.semver.line, line);
						assert.strictEqual(key, `v${release.semver.raw}`);
					}
				}
			}),
		);
	});

	it('should list every security release newest first, bounded by newest and oldest', async () => {
		await fc.assert(
			fc.asyncProperty(day(), async (now) => {
				// Arrange
				const options = at(now);

				// Act
				const data = await nodevu(options);

				// Assert
				for (const { releases, security } of Object.values(data)) {
					const flagged = Object.values(releases)
						.filter((release) => release.security.isSecurity)
						.map((release) => release.semver.raw);

					assert.deepStrictEqual(
						security.all,
						[...security.all].sort(semver.rcompare),
					);
					assert.strictEqual(security.newest, security.all[0]);
					assert.strictEqual(security.oldest, security.all.at(-1));
					assert.deepStrictEqual([...security.all].sort(), flagged.sort());
				}
			}),
		);
	});

	it('should bound support.lts by two LTS releases, newest >= oldest', async () => {
		await fc.assert(
			fc.asyncProperty(day(), async (now) => {
				// Arrange
				const options = at(now);

				// Act
				const data = await nodevu(options);

				// Assert
				for (const { releases, support } of Object.values(data)) {
					const newest = support?.lts?.newest;
					const oldest = support?.lts?.oldest;

					if (newest === undefined || oldest === undefined) {
						continue;
					}

					assert.ok(semver.gte(newest, oldest), `${newest} < ${oldest}`);
					assert.strictEqual(releases[`v${newest}`].lts.isLts, true);
					assert.strictEqual(releases[`v${oldest}`].lts.isLts, true);
				}
			}),
		);
	});

	it('should only ever move a line forward through its phases', async () => {
		await fc.assert(
			fc.asyncProperty(day(), day(), async (a, b) => {
				// Arrange
				const [earlier, later] = [a, b].sort();

				// Act
				const before = await nodevu(at(earlier));
				const after = await nodevu(at(later));

				// Assert
				for (const [line, { support }] of Object.entries(before)) {
					assert.ok(
						phaseIndex(after[line].support) >= phaseIndex(support),
						`${line} went from ${support?.phases.current} to ${after[line].support?.phases.current}`,
					);
				}
			}),
		);
	});
});

// Helpers

// a day anywhere in the fixture's span, as YYYY-MM-DD
function day() {
	return fc
		.date({
			min: new Date('2009-06-01'),
			max: new Date('2026-10-01'),
			noInvalidDate: true,
		})
		.map((date) => date.toISOString().slice(0, 10));
}

// a phase that hasn't begun (`{}`) sorts before every phase
function phaseIndex(support) {
	return phases.indexOf(String(support?.phases.current));
}
