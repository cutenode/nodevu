const assert = require('node:assert');
const { describe, it } = require('node:test');

const aliases = require('../index');

describe('aliases', () => {
	it('should list every alias @nodevu/ranges works out, in order', () => {
		assert.deepStrictEqual(aliases, [
			'alpha',
			'current',
			'lts/latest',
			'lts/active',
			'lts/maintenance',
			'eol',
			'all',
		]);
	});
});
