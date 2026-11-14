const assert = require('node:assert');
const { describe, it } = require('node:test');
const fc = require('fast-check');
const semver = require('semver');
const nodevu = require('../index');
const { at } = require('@nodevu/fixtures');
const snapshot = require('@nodevu/fixtures/data/index.json');

// every generated release is out by then
const now = '2027-01-01';

describe('core on a generated index.json', async () => {
	it('should keep every release as the index lists it, in any order', async () => {
		await fc.assert(
			fc.asyncProperty(index(), async (entries) => {
				// Arrange
				const options = at(now, { index: entries, schedule: {} });

				// Act
				const data = await nodevu(options);

				// Assert
				const keys = Object.values(data).flatMap(({ releases }) =>
					Object.keys(releases),
				);

				assert.strictEqual(keys.length, entries.length);

				for (const entry of entries) {
					const { line, key } = place(entry.version);
					const release = data[line].releases[key];

					const linked = Object.values(release.files.links).flatMap((links) =>
						links.map(({ id }) => id),
					);

					assert.strictEqual(release.semver.line, line);
					assert.strictEqual(release.releaseDate, entry.date);
					assert.strictEqual(release.lts.isLts, Boolean(entry.lts));
					assert.strictEqual(release.security.isSecurity, entry.security);
					assert.strictEqual(
						release.alpha.isAlpha,
						entry.version.includes('-alpha.'),
					);
					assert.deepStrictEqual(release.files.available, entry.files ?? []);
					assert.deepStrictEqual(
						linked.sort(),
						[...(entry.files ?? [])].sort(),
					);
				}

				for (const [line, { releases, security }] of Object.entries(data)) {
					const flagged = Object.values(releases)
						.filter((release) => release.security.isSecurity)
						.map((release) => release.semver.raw);

					assert.deepStrictEqual(
						[...security.all].sort(),
						flagged.sort(),
						line,
					);
				}
			}),
		);
	});

	it('should order security and LTS releases by version on a newest-first index', async () => {
		await fc.assert(
			fc.asyncProperty(index(), async (shuffled) => {
				// Arrange
				// index.json lists releases newest first, and core relies on it
				const entries = [...shuffled].sort((a, b) =>
					semver.rcompare(place(a.version).raw, place(b.version).raw),
				);

				const lines = new Set(
					entries.map((entry) => place(entry.version).line),
				);

				const schedule = Object.fromEntries(
					[...lines].map((line) => [line, { start: '2000-01-01' }]),
				);

				// Act
				const data = await nodevu(at(now, { index: entries, schedule }));

				// Assert
				for (const [line, { releases, security, support }] of Object.entries(
					data,
				)) {
					const all = Object.values(releases).map(({ semver }) => semver.raw);

					const lts = Object.values(releases)
						.filter((release) => release.lts.isLts)
						.map((release) => release.semver.raw)
						.sort(semver.rcompare);

					assert.deepStrictEqual(
						security.all,
						[...security.all].sort(semver.rcompare),
						line,
					);
					assert.strictEqual(security.newest, security.all[0], line);
					assert.strictEqual(security.oldest, security.all.at(-1), line);
					assert.strictEqual(support?.lts?.oldest, lts.at(-1), line);

					// newest is only set when the line's newest release is LTS, which
					// is always true of index.json, since a line stays LTS once it is
					const isNewestLts = releases[`v${all[0]}`].lts.isLts;
					assert.strictEqual(
						support?.lts?.newest,
						isNewestLts ? lts[0] : undefined,
						line,
					);
				}
			}),
		);
	});
});

// Helpers

/**
 * Where core files a version: its release line and its key in that line.
 *
 * @param {string} version
 */
function place(version) {
	const parsed = semver.coerce(version, { includePrerelease: true });
	assert.ok(parsed);

	return {
		raw: parsed.version,
		key: `v${parsed.version}`,
		line: parsed.major === 0 ? `v0.${parsed.minor}` : `v${parsed.major}`,
	};
}

// releases unique by version, in any order, with odd lts values, unknown file
// ids and missing files
function index() {
	const ids = [...new Set(snapshot.flatMap((release) => release.files))];

	return fc.uniqueArray(
		fc.record(
			{
				version: version(),
				date: fc
					.date({
						min: new Date('2009-06-01'),
						max: new Date('2026-12-31'),
						noInvalidDate: true,
					})
					.map((date) => date.toISOString().slice(0, 10)),
				lts: fc.oneof(fc.constant(false), fc.constant(true), fc.string()),
				security: fc.boolean(),
				files: fc.array(fc.oneof(fc.constantFrom(...ids), fc.string()), {
					maxLength: 5,
				}),
			},
			{ requiredKeys: ['version', 'date', 'lts', 'security'] },
		),
		{ selector: (entry) => place(entry.version).key, maxLength: 20 },
	);
}

// a version as index.json writes it, including 0.x lines and Alpha releases
function version() {
	return fc.oneof(
		fc
			.tuple(fc.nat({ max: 12 }), fc.nat({ max: 5 }))
			.map(([minor, patch]) => `v0.${minor}.${patch}`),
		fc
			.tuple(
				fc.integer({ min: 1, max: 30 }),
				fc.nat({ max: 5 }),
				fc.nat({ max: 5 }),
			)
			.map(([major, minor, patch]) => `v${major}.${minor}.${patch}`),
		fc
			.tuple(fc.integer({ min: 1, max: 30 }), fc.nat({ max: 5 }))
			.map(([major, alpha]) => `v${major}.0.0-alpha.${alpha}.0.0`),
	);
}
