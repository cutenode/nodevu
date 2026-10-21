const assert = require('node:assert');
const { mkdtemp, readFile } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { describe, it } = require('node:test');
const write = require('../util/dev/write');

describe('write', async () => {
	it('should save data as tab-indented JSON', async () => {
		// Arrange
		const path = join(await mkdtemp(join(tmpdir(), 'nodevu-')), 'data.json');

		// Act
		await write(path, { v22: { codename: 'Jod' } });

		// Assert
		assert.strictEqual(
			await readFile(path, 'utf8'),
			'{\n\t"v22": {\n\t\t"codename": "Jod"\n\t}\n}',
		);
	});
});
