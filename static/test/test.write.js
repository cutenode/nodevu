const assert = require('node:assert');
const { mkdir, mkdtemp, readFile } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { describe, it } = require('node:test');
const write = require('../util/dev/write');

describe('write', async () => {
	it('should save data as JSON indented with two spaces', async () => {
		// Arrange
		const path = join(await mkdtemp(join(tmpdir(), 'nodevu-')), 'data.json');

		// Act
		await write(path, { v22: { codename: 'Jod' } });

		// Assert
		assert.strictEqual(
			await readFile(path, 'utf8'),
			'{\n  "v22": {\n    "codename": "Jod"\n  }\n}',
		);
	});

	// the build scripts pass paths like ./static/data, so running them from
	// inside static/ would otherwise point at static/static/data
	it('should collapse a doubled static/static/ in the path', async () => {
		// Arrange
		const root = await mkdtemp(join(tmpdir(), 'nodevu-'));
		await mkdir(join(root, 'static'));

		// Act
		await write(join(root, 'static/static/data.json'), []);

		// Assert
		assert.strictEqual(
			await readFile(join(root, 'static/data.json'), 'utf8'),
			'[]',
		);
	});
});
