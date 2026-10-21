const assert = require('node:assert');
const { execFile } = require('node:child_process');
const { mkdir, mkdtemp, readFile } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { describe, it } = require('node:test');
const { promisify } = require('node:util');
const { DateTime } = require('luxon');
const index = require('./data/static/index.json');
const schedule = require('./data/static/schedule.json');

describe('test:update:static', async () => {
	it('should save the index.json and schedule.json it downloads', async () => {
		// Arrange
		const cwd = await snapshotDirectory();

		// Act
		await runScript(
			'updateStaticData.js',
			`require(${JSON.stringify(require.resolve('../util/dev/beforeEachTemplate'))})();`,
			cwd,
		);

		// Assert
		assert.deepStrictEqual(
			{
				index: await readSnapshot(cwd, 'index.json'),
				schedule: await readSnapshot(cwd, 'schedule.json'),
			},
			{ index, schedule },
		);
	});
});

describe('test:update:now', async () => {
	it('should save the current time as an ISO string', async () => {
		// Arrange
		const cwd = await snapshotDirectory();
		const now = Date.parse('2025-10-30T15:51:04.858Z');

		// Act
		await runScript(
			'updateStaticNow.js',
			`require(${JSON.stringify(require.resolve('luxon'))}).Settings.now = () => ${now};`,
			cwd,
		);

		// Assert
		const saved = await readSnapshot(cwd, 'now.json');
		assert.strictEqual(DateTime.fromISO(saved).toMillis(), now);
	});
});

// Helpers

// a directory laid out like core, for the scripts to write their snapshots into
async function snapshotDirectory() {
	const cwd = await mkdtemp(join(tmpdir(), 'nodevu-'));
	await mkdir(join(cwd, 'test/data/static'), { recursive: true });

	return cwd;
}

async function readSnapshot(cwd, file) {
	return JSON.parse(
		await readFile(join(cwd, 'test/data/static', file), 'utf8'),
	);
}

// runs a util/dev script the way its npm script does, after `setup` stubs
// whatever it reaches outside the process for
function runScript(script, setup, cwd) {
	const path = require.resolve(`../util/dev/${script}`);

	return promisify(execFile)(
		process.execPath,
		['-e', `${setup} require(${JSON.stringify(path)});`],
		{ cwd },
	);
}
