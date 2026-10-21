const assert = require('node:assert');
const { execFile } = require('node:child_process');
const { mkdir, mkdtemp, readFile } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { dirname, join } = require('node:path');
const { describe, it } = require('node:test');
const { promisify } = require('node:util');
const nodevu = require('@nodevu/core');
const fixtures = require('../../core/util/dev/fixtures');
const now = require('../../core/test/data/static/now.json');

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

// Helpers

// what @nodevu/core returns for its snapshot data at the time it was taken
function coreData() {
	return nodevu(fixtures.at(now));
}

function pick(data, key) {
	return Object.fromEntries(
		Object.entries(data).map(([line, value]) => [line, value[key]]),
	);
}

// the build output is JSON, which drops undefined values
function toJSON(data) {
	return JSON.parse(JSON.stringify(data));
}

// runs a build script the way `npm run build -w static` does, from a copy of
// static/, with core's snapshot data served instead of nodejs.org and the
// clock stopped at the time the snapshot was taken. returns what it wrote.
async function runBuild(name) {
	const cwd = join(await mkdtemp(join(tmpdir(), 'nodevu-')), 'static');
	await mkdir(join(cwd, 'data'), { recursive: true });

	const luxon = require.resolve('luxon', {
		paths: [dirname(require.resolve('@nodevu/core'))],
	});

	const setup = [
		`require(${JSON.stringify(luxon)}).Settings.now = () => ${Date.parse(now)};`,
		`globalThis.fetch = require(${JSON.stringify(require.resolve('../../core/util/dev/fixtures'))}).at(${JSON.stringify(now)}).fetch;`,
	].join(' ');

	await promisify(execFile)(
		process.execPath,
		[
			'-e',
			`${setup} require(${JSON.stringify(require.resolve(`../build/${name}`))});`,
		],
		{ cwd },
	);

	return JSON.parse(await readFile(join(cwd, 'data', `${name}.json`), 'utf8'));
}
