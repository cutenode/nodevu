const assert = require('node:assert');
const { execFile } = require('node:child_process');
const { describe, it } = require('node:test');
const { promisify } = require('node:util');

describe('examples/default.js', async () => {
	it('should print the ranges for each Package Support term', async () => {
		// Arrange
		// serve core's snapshot data instead of fetching from nodejs.org
		const setup = `globalThis.fetch = require(${JSON.stringify(require.resolve('../../ranges/test/fixtures'))}).at().fetch;`;
		const example = JSON.stringify(require.resolve('../examples/default'));

		// Act
		const { stdout } = await promisify(execFile)(process.execPath, [
			'-e',
			`${setup} require(${example});`,
		]);

		// Assert
		assert.match(
			stdout,
			/current: \{[\s\S]*lts_latest: \{[\s\S]*lts: \{[\s\S]*supported: \{[\s\S]*all: \{/,
		);
	});
});
