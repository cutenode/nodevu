const assert = require('node:assert');
const { execFile } = require('node:child_process');
const { mkdir, mkdtemp, readFile, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { describe, it } = require('node:test');
const { promisify } = require('node:util');
const nodevu = require('@nodevu/core');
const fixtures = require('@nodevu/fixtures');
const now = require('@nodevu/fixtures/data/now.json');

// a full diff of every release takes node minutes to build, so failures say
// this instead
const mismatch = 'the build output should match what @nodevu/core returns';

describe('build:default', async () => {
	it('should save everything @nodevu/core returns', async () => {
		// Arrange
		const expected = await coreData();

		// Act
		const written = await runBuild('default');

		// Assert
		assert.deepStrictEqual(written, toJSON(expected), mismatch);
	});
});

describe('build:releases', async () => {
	it("should save each release line's releases", async () => {
		// Arrange
		const expected = pick(await coreData(), 'releases');

		// Act
		const written = await runBuild('releases');

		// Assert
		assert.deepStrictEqual(written, toJSON(expected), mismatch);
	});
});

describe('build:security', async () => {
	it("should save each release line's security data", async () => {
		// Arrange
		const expected = pick(await coreData(), 'security');

		// Act
		const written = await runBuild('security');

		// Assert
		assert.deepStrictEqual(written, toJSON(expected), mismatch);
	});
});

describe('build:support', async () => {
	it("should save each release line's support data", async () => {
		// Arrange
		const expected = pick(await coreData(), 'support');

		// Act
		const written = await runBuild('support');

		// Assert
		assert.deepStrictEqual(written, toJSON(expected), mismatch);
	});
});

describe('build', async () => {
	it('should exit non-zero when it cannot write its output', async () => {
		/** @type {Build[]} */
		const builds = ['default', 'releases', 'security', 'support'];

		for (const name of builds) {
			// Arrange
			// no data/ directory to write into
			const cwd = await buildDirectory();
			await rm(join(cwd, 'data'), { recursive: true });

			// Act
			const result = execBuild(name, cwd);

			// Assert
			await assert.rejects(result, { code: 1 }, name);
		}
	});
});

// Helpers

// what @nodevu/core returns for its snapshot data at the time it was taken
function coreData() {
	return nodevu(fixtures.at(now));
}

/**
 * @param {import('@nodevu/core').Data} data
 * @param {keyof import('@nodevu/core').ReleaseLine} key
 */
function pick(data, key) {
	return Object.fromEntries(
		Object.entries(data).map(([line, value]) => [line, value[key]]),
	);
}

// the build output is JSON, which drops undefined values
/** @param {unknown} data */
function toJSON(data) {
	return JSON.parse(JSON.stringify(data));
}

/** @typedef {'default' | 'releases' | 'security' | 'support'} Build */

// runs a build script in a copy of static/ and returns what it wrote
/** @param {Build} name */
async function runBuild(name) {
	const cwd = await buildDirectory();
	await execBuild(name, cwd);

	return JSON.parse(await readFile(join(cwd, 'data', `${name}.json`), 'utf8'));
}

// a directory laid out like static/, for the build scripts to write into
async function buildDirectory() {
	const cwd = join(await mkdtemp(join(tmpdir(), 'nodevu-')), 'static');
	await mkdir(join(cwd, 'data'), { recursive: true });

	return cwd;
}

// runs a build script the way `npm run build -w static` does, from `cwd`,
// with the snapshot data served instead of nodejs.org and the clock stopped
// at the time the snapshot was taken
/**
 * @param {Build} name
 * @param {string} cwd
 */
function execBuild(name, cwd) {
	const setup = [
		// core reads the time through luxon, which calls Date.now()
		`Date.now = () => ${Date.parse(now)};`,
		`globalThis.fetch = require(${JSON.stringify(require.resolve('@nodevu/fixtures'))}).at(${JSON.stringify(now)}).fetch;`,
	].join(' ');

	return promisify(execFile)(
		process.execPath,
		[
			'-e',
			`${setup} require(${JSON.stringify(require.resolve(`../build/${name}`))});`,
		],
		{ cwd },
	);
}
